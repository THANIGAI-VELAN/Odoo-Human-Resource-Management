from sqlmodel import Session, select
from fastapi import HTTPException, status
from datetime import datetime
from .models import LeaveRequest, LeaveBalance
from .schemas import LeaveRequestCreate
from employees.models import Employee

def get_or_create_balance(session: Session, employee_id: str) -> LeaveBalance:
    # Get or lazily initialize leave balance record for employee
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

    # 2. Parse dates & calculate duration
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

    days_count = (end_dt - start_dt).days + 1

    # 3. Check PTO balance bounds
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

    # 4. Insert Request
    leave_req = LeaveRequest(
        employee_id=req.employee_id,
        leave_type=req.leave_type,
        start_date=req.start_date,
        end_date=req.end_date,
        days_count=days_count,
        reason=req.reason,
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

    # Deduct balance
    balance = get_or_create_balance(session, leave_req.employee_id)
    if leave_req.leave_type == "Annual Leave":
        balance.annual_leave = max(0, balance.annual_leave - leave_req.days_count)
    elif leave_req.leave_type == "Sick Leave":
        balance.sick_leave = max(0, balance.sick_leave - leave_req.days_count)
    elif leave_req.leave_type == "Unpaid Leave":
        balance.unpaid_leave_taken += leave_req.days_count

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
