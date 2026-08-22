from sqlmodel import Session, select
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from .models import LeaveRequest, LeaveBalance
from .schemas import LeaveRequestCreate
from employees.models import Employee
from holidays.models import Holiday

def calculate_chargeable_days(session: Session, start_date_str: str, end_date_str: str, is_half_day: bool) -> float:
    if is_half_day:
        return 0.5

    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dates must be in YYYY-MM-DD format."
        )

    # Fetch all holidays
    holidays = session.exec(select(Holiday)).all()
    holiday_dates = {datetime.strptime(h.date, "%Y-%m-%d").date() for h in holidays}

    curr = start_date
    chargeable_days = 0.0
    while curr <= end_date:
        is_weekend = curr.weekday() in (5, 6)  # Saturday=5, Sunday=6
        is_holiday = curr in holiday_dates
        if not is_weekend and not is_holiday:
            chargeable_days += 1.0
        curr += timedelta(days=1)

    return chargeable_days

def get_or_create_balance(session: Session, employee_id: str) -> LeaveBalance:
    stmt = select(LeaveBalance).where(LeaveBalance.employee_id == employee_id)
    balance = session.exec(stmt).first()
    if not balance:
        balance = LeaveBalance(employee_id=employee_id)
        session.add(balance)
        session.commit()
        session.refresh(balance)
    return balance

def apply_leave_request(session: Session, req: LeaveRequestCreate) -> LeaveRequest:
    # 1. Verify employee exists
    emp_stmt = select(Employee).where(Employee.id == req.employee_id)
    emp = session.exec(emp_stmt).first()
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {req.employee_id} not found."
        )

    # 2. Validate date ordering
    try:
        start_dt = datetime.strptime(req.start_date, "%Y-%m-%d")
        end_dt = datetime.strptime(req.end_date, "%Y-%m-%d")
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dates must be in YYYY-MM-DD format."
        )

    if end_dt < start_dt:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date cannot be prior to start date."
        )

    # 3. Check for overlaps
    overlap_stmt = select(LeaveRequest).where(
        LeaveRequest.employee_id == req.employee_id,
        LeaveRequest.status.in_(["Pending", "Approved"]),
        LeaveRequest.start_date <= req.end_date,
        LeaveRequest.end_date >= req.start_date
    )
    overlapping = session.exec(overlap_stmt).first()
    if overlapping:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Leave request overlaps with an existing {overlapping.status} request ({overlapping.start_date} to {overlapping.end_date})."
        )

    # 4. Calculate duration (excluding weekends/holidays)
    days_count = calculate_chargeable_days(session, req.start_date, req.end_date, req.is_half_day)
    if days_count <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Leave duration cannot be 0 days (entirely weekends or holidays)."
        )

    # 5. Check balance bounds
    balance = get_or_create_balance(session, req.employee_id)
    if req.leave_type == "Annual Leave":
        if balance.annual_leave < days_count:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient Annual Leave balance. Available: {balance.annual_leave} days, Requested: {days_count} days."
            )
    elif req.leave_type == "Sick Leave":
        if balance.sick_leave < days_count:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient Sick Leave balance. Available: {balance.sick_leave} days, Requested: {days_count} days."
            )
    elif req.leave_type == "Casual Leave":
        if balance.casual_leave < days_count:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient Casual Leave balance. Available: {balance.casual_leave} days, Requested: {days_count} days."
            )

    # 6. Create request
    leave_req = LeaveRequest(
        employee_id=req.employee_id,
        leave_type=req.leave_type,
        start_date=req.start_date,
        end_date=req.end_date,
        days_count=days_count,
        reason=req.reason,
        e_letter=req.e_letter if req.e_letter else "",
        is_half_day=req.is_half_day,
        half_day_position=req.half_day_position,
        status="Pending"
    )
    session.add(leave_req)
    session.commit()
    session.refresh(leave_req)
    return leave_req

def approve_leave_request(session: Session, leave_id: int) -> LeaveRequest:
    stmt = select(LeaveRequest).where(LeaveRequest.id == leave_id)
    leave_req = session.exec(stmt).first()
    if not leave_req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found."
        )

    if leave_req.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Leave request is already marked as {leave_req.status}."
        )

    # Verify and deduct balance
    balance = get_or_create_balance(session, leave_req.employee_id)
    if leave_req.leave_type == "Annual Leave":
        if balance.annual_leave < leave_req.days_count:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient balance. Available: {balance.annual_leave}, Required: {leave_req.days_count}"
            )
        balance.annual_leave = round(balance.annual_leave - leave_req.days_count, 2)
        balance.annual_leave_taken = round(balance.annual_leave_taken + leave_req.days_count, 2)
    elif leave_req.leave_type == "Sick Leave":
        if balance.sick_leave < leave_req.days_count:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient balance. Available: {balance.sick_leave}, Required: {leave_req.days_count}"
            )
        balance.sick_leave = round(balance.sick_leave - leave_req.days_count, 2)
        balance.sick_leave_taken = round(balance.sick_leave_taken + leave_req.days_count, 2)
    elif leave_req.leave_type == "Casual Leave":
        if balance.casual_leave < leave_req.days_count:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Insufficient balance. Available: {balance.casual_leave}, Required: {leave_req.days_count}"
            )
        balance.casual_leave = round(balance.casual_leave - leave_req.days_count, 2)
        balance.casual_leave_taken = round(balance.casual_leave_taken + leave_req.days_count, 2)
    elif leave_req.leave_type == "Unpaid Leave":
        balance.unpaid_leave_taken = round(balance.unpaid_leave_taken + leave_req.days_count, 2)

    leave_req.status = "Approved"

    # Update employee status if leave covers current date
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    if leave_req.start_date <= today_str <= leave_req.end_date:
        emp_stmt = select(Employee).where(Employee.id == leave_req.employee_id)
        emp = session.exec(emp_stmt).first()
        if emp:
            emp.status = "On Leave"
            session.add(emp)

    session.add(balance)
    session.add(leave_req)
    session.commit()
    session.refresh(leave_req)
    return leave_req

def reject_leave_request(session: Session, leave_id: int) -> LeaveRequest:
    stmt = select(LeaveRequest).where(LeaveRequest.id == leave_id)
    leave_req = session.exec(stmt).first()
    if not leave_req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found."
        )

    if leave_req.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Leave request is already marked as {leave_req.status}."
        )

    leave_req.status = "Rejected"
    session.add(leave_req)
    session.commit()
    session.refresh(leave_req)
    return leave_req

def cancel_leave_request(session: Session, leave_id: int) -> LeaveRequest:
    stmt = select(LeaveRequest).where(LeaveRequest.id == leave_id)
    leave_req = session.exec(stmt).first()
    if not leave_req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found."
        )

    if leave_req.status not in ["Pending", "Approved"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel a leave request in {leave_req.status} status."
        )

    # Revert balance if it was already approved
    if leave_req.status == "Approved":
        balance = get_or_create_balance(session, leave_req.employee_id)
        if leave_req.leave_type == "Annual Leave":
            balance.annual_leave = round(balance.annual_leave + leave_req.days_count, 2)
            balance.annual_leave_taken = max(0.0, round(balance.annual_leave_taken - leave_req.days_count, 2))
        elif leave_req.leave_type == "Sick Leave":
            balance.sick_leave = round(balance.sick_leave + leave_req.days_count, 2)
            balance.sick_leave_taken = max(0.0, round(balance.sick_leave_taken - leave_req.days_count, 2))
        elif leave_req.leave_type == "Casual Leave":
            balance.casual_leave = round(balance.casual_leave + leave_req.days_count, 2)
            balance.casual_leave_taken = max(0.0, round(balance.casual_leave_taken - leave_req.days_count, 2))
        elif leave_req.leave_type == "Unpaid Leave":
            balance.unpaid_leave_taken = max(0.0, round(balance.unpaid_leave_taken - leave_req.days_count, 2))
        session.add(balance)

        # Revert employee status if on leave
        today_str = datetime.utcnow().strftime("%Y-%m-%d")
        if leave_req.start_date <= today_str <= leave_req.end_date:
            emp_stmt = select(Employee).where(Employee.id == leave_req.employee_id)
            emp = session.exec(emp_stmt).first()
            if emp and emp.status == "On Leave":
                emp.status = "Active"
                session.add(emp)

    leave_req.status = "Cancelled"
    session.add(leave_req)
    session.commit()
    session.refresh(leave_req)
    return leave_req
