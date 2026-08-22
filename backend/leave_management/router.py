from fastapi import APIRouter, Depends, status, HTTPException
from sqlmodel import Session, select
from typing import Optional, List
from config.database import get_session
from employees.models import Employee
from .models import LeaveRequest, LeaveBalance
from .schemas import LeaveRequestCreate, LeaveRequestResponse, LeaveBalanceResponse
from . import services

router = APIRouter()

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
        status=req.status,
        applied_time=req.applied_time
    )

@router.get('/requests', response_model=List[LeaveRequestResponse])
def get_all_leave_requests(
    employee_id: Optional[str] = None,
    session: Session = Depends(get_session)
):
    stmt = select(LeaveRequest, Employee).join(Employee, LeaveRequest.employee_id == Employee.id)
    if employee_id:
        stmt = stmt.where(LeaveRequest.employee_id == employee_id)
    # Sort requests by applied_time descending (newest first)
    stmt = stmt.order_by(LeaveRequest.id.desc())
    results = session.exec(stmt).all()
    return [_make_response_obj(req, emp) for req, emp in results]

@router.post('/apply', response_model=LeaveRequestResponse, status_code=status.HTTP_201_CREATED)
def apply_leave(
    req_body: LeaveRequestCreate,
    session: Session = Depends(get_session)
):
    leave_req = services.apply_leave_request(session, req_body)
    # Fetch employee to construct response
    emp = session.exec(select(Employee).where(Employee.id == leave_req.employee_id)).first()
    return _make_response_obj(leave_req, emp)

@router.post('/{id}/approve', response_model=LeaveRequestResponse)
def approve_leave(
    id: int,
    session: Session = Depends(get_session)
):
    leave_req = services.approve_leave_request(session, id)
    emp = session.exec(select(Employee).where(Employee.id == leave_req.employee_id)).first()
    return _make_response_obj(leave_req, emp)

@router.post('/{id}/reject', response_model=LeaveRequestResponse)
def reject_leave(
    id: int,
    session: Session = Depends(get_session)
):
    leave_req = services.reject_leave_request(session, id)
    emp = session.exec(select(Employee).where(Employee.id == leave_req.employee_id)).first()
    return _make_response_obj(leave_req, emp)

@router.get('/balances/{employee_id}', response_model=LeaveBalanceResponse)
def get_employee_balances(
    employee_id: str,
    session: Session = Depends(get_session)
):
    # Verify employee exists first
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
        unpaid_leave_taken=balance.unpaid_leave_taken
    )
