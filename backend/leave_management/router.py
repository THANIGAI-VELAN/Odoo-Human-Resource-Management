from fastapi import APIRouter, Depends, status, HTTPException, Query
from sqlmodel import Session, select, or_
from typing import Optional, List
from config.database import get_session
from employees.models import Employee
from authentication.services import get_current_user
from authentication.models import User
from .models import LeaveRequest, LeaveBalance
from .schemas import LeaveRequestCreate, LeaveRequestResponse, LeaveBalanceResponse
from . import services

router = APIRouter()

def get_current_employee_or_raise(session: Session, user: User) -> Employee:
    emp = session.exec(select(Employee).where(Employee.email == user.email)).first()
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee profile not found for user {user.email}."
        )
    return emp

def _make_response_obj(req: LeaveRequest, emp: Employee) -> LeaveRequestResponse:
    avatar_seed = f"{emp.first_name} {emp.last_name}"
    return LeaveRequestResponse(
        id=req.id,
        employee_id=req.employee_id,
        employee_name=f"{emp.first_name} {emp.last_name}",
        employee_avatar=f"https://api.dicebear.com/7.x/initials/svg?seed={avatar_seed}",
        leave_type=req.leave_type,
        start_date=req.start_date,
        end_date=req.end_date,
        days_count=req.days_count,
        reason=req.reason,
        e_letter=req.e_letter,
        is_half_day=req.is_half_day,
        half_day_position=req.half_day_position,
        status=req.status,
        applied_time=req.applied_time
    )

@router.get('/requests', response_model=List[LeaveRequestResponse])
def get_all_leave_requests(
    employee_id: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    leave_type: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    stmt = select(LeaveRequest, Employee).join(Employee, LeaveRequest.employee_id == Employee.id)

    # Enforce RBAC / Object-level permissions
    if current_user.role == "Employee":
        # Employees can only view their own requests
        emp = get_current_employee_or_raise(session, current_user)
        stmt = stmt.where(LeaveRequest.employee_id == emp.id)
    else:
        # Managers/Admins can view specified employee or all
        if employee_id:
            stmt = stmt.where(LeaveRequest.employee_id == employee_id)

    # Filtering
    if status_filter:
        stmt = stmt.where(LeaveRequest.status == status_filter)
    if leave_type:
        stmt = stmt.where(LeaveRequest.leave_type == leave_type)
    if start_date:
        stmt = stmt.where(LeaveRequest.start_date >= start_date)
    if end_date:
        stmt = stmt.where(LeaveRequest.end_date <= end_date)

    # Search (searches employee first name, last name, or reason)
    if search:
        stmt = stmt.where(
            or_(
                Employee.first_name.like(f"%{search}%"),
                Employee.last_name.like(f"%{search}%"),
                LeaveRequest.reason.like(f"%{search}%")
            )
        )

    # Sorting (latest request first)
    stmt = stmt.order_by(LeaveRequest.id.desc())
    
    # Pagination
    stmt = stmt.offset(skip).limit(limit)
    
    results = session.exec(stmt).all()
    return [_make_response_obj(req, emp) for req, emp in results]

@router.post('/apply', response_model=LeaveRequestResponse, status_code=status.HTTP_201_CREATED)
def apply_leave(
    req_body: LeaveRequestCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Enforce permissions: Employees can only apply for themselves
    if current_user.role == "Employee":
        emp = get_current_employee_or_raise(session, current_user)
        if req_body.employee_id != emp.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only apply for leave for yourself."
            )

    leave_req = services.apply_leave_request(session, req_body)
    emp = session.exec(select(Employee).where(Employee.id == leave_req.employee_id)).first()
    return _make_response_obj(leave_req, emp)

@router.post('/{id}/approve', response_model=LeaveRequestResponse)
def approve_leave(
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Enforce Manager/Admin permissions
    if current_user.role not in ["Admin", "Manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins or Managers can approve leave requests."
        )

    leave_req = services.approve_leave_request(session, id)
    emp = session.exec(select(Employee).where(Employee.id == leave_req.employee_id)).first()
    return _make_response_obj(leave_req, emp)

@router.post('/{id}/reject', response_model=LeaveRequestResponse)
def reject_leave(
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Enforce Manager/Admin permissions
    if current_user.role not in ["Admin", "Manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Admins or Managers can reject leave requests."
        )

    leave_req = services.reject_leave_request(session, id)
    emp = session.exec(select(Employee).where(Employee.id == leave_req.employee_id)).first()
    return _make_response_obj(leave_req, emp)

@router.post('/{id}/cancel', response_model=LeaveRequestResponse)
def cancel_leave(
    id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    stmt = select(LeaveRequest).where(LeaveRequest.id == id)
    leave_req = session.exec(stmt).first()
    if not leave_req:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Leave request not found."
        )

    # Enforce permissions: Employees can only cancel their own requests
    if current_user.role == "Employee":
        emp = get_current_employee_or_raise(session, current_user)
        if leave_req.employee_id != emp.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only cancel your own leave requests."
            )

    cancelled_req = services.cancel_leave_request(session, id)
    emp = session.exec(select(Employee).where(Employee.id == cancelled_req.employee_id)).first()
    return _make_response_obj(cancelled_req, emp)

@router.get('/balances/{employee_id}', response_model=LeaveBalanceResponse)
def get_employee_balances(
    employee_id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Enforce permissions: Employees can only view their own balance
    if current_user.role == "Employee":
        emp = get_current_employee_or_raise(session, current_user)
        if employee_id != emp.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view your own leave balance."
            )

    emp = session.exec(select(Employee).where(Employee.id == employee_id)).first()
    if not emp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee {employee_id} not found."
        )
    balance = services.get_or_create_balance(session, employee_id)
    return LeaveBalanceResponse(
        employee_id=balance.employee_id,
        annual_leave=balance.annual_leave,
        sick_leave=balance.sick_leave,
        casual_leave=balance.casual_leave,
        annual_leave_taken=balance.annual_leave_taken,
        sick_leave_taken=balance.sick_leave_taken,
        casual_leave_taken=balance.casual_leave_taken,
        unpaid_leave_taken=balance.unpaid_leave_taken
    )

@router.get('/calendar', response_model=List[LeaveRequestResponse])
def get_calendar_events(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Calendar displays approved requests
    stmt = select(LeaveRequest, Employee).join(Employee, LeaveRequest.employee_id == Employee.id).where(LeaveRequest.status == "Approved")
    results = session.exec(stmt).all()
    return [_make_response_obj(req, emp) for req, emp in results]
