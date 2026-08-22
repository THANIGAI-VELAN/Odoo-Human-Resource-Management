from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import Optional, List
from datetime import datetime
from config.database import get_session
from authentication.services import get_current_user
from authentication.models import User
from employees.models import Employee
from .schemas import (
    CheckInRequest, CheckOutRequest,
    AttendanceRecordResponse, MonthlyAttendanceSummary,
    RegularizationRequest, RegularizationResponse,
)
from . import services

router = APIRouter()


def _get_employee_for_user(session: Session, user: User) -> Employee:
    """Resolve the Employee record linked to the current user."""
    emp = session.exec(select(Employee).where(Employee.email == user.email)).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee profile not found for this user.")
    return emp


@router.post("/check-in", response_model=AttendanceRecordResponse)
def check_in(
    body: CheckInRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Record employee check-in. Employees can only check in for themselves."""
    if current_user.role == "Employee":
        emp = _get_employee_for_user(session, current_user)
        if body.employee_id != emp.id:
            raise HTTPException(status_code=403, detail="You can only check in for yourself.")

    record = services.check_in_employee(session, body.employee_id, body.check_in_time)
    emp = session.get(Employee, record.employee_id)
    return AttendanceRecordResponse(
        id=record.id,
        employee_id=record.employee_id,
        employee_name=f"{emp.first_name} {emp.last_name}" if emp else "",
        employee_avatar=emp.profile_picture_url if emp else None,
        date=record.date,
        check_in=record.check_in,
        check_out=record.check_out,
        work_hours=record.work_hours,
        extra_hours=record.extra_hours,
        status=record.status,
        source=record.source,
    )


@router.post("/check-out", response_model=AttendanceRecordResponse)
def check_out(
    body: CheckOutRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Record employee check-out. Employees can only check out for themselves."""
    if current_user.role == "Employee":
        emp = _get_employee_for_user(session, current_user)
        if body.employee_id != emp.id:
            raise HTTPException(status_code=403, detail="You can only check out for yourself.")

    record = services.check_out_employee(session, body.employee_id, body.check_out_time)
    emp = session.get(Employee, record.employee_id)
    return AttendanceRecordResponse(
        id=record.id,
        employee_id=record.employee_id,
        employee_name=f"{emp.first_name} {emp.last_name}" if emp else "",
        employee_avatar=emp.profile_picture_url if emp else None,
        date=record.date,
        check_in=record.check_in,
        check_out=record.check_out,
        work_hours=record.work_hours,
        extra_hours=record.extra_hours,
        status=record.status,
        source=record.source,
    )


@router.get("/daily", response_model=List[AttendanceRecordResponse])
def get_daily_attendance(
    date: Optional[str] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Get attendance for all employees on a date (Admin/Manager view).
    Employees see only their own record for the day."""
    if not date:
        date = datetime.utcnow().strftime("%Y-%m-%d")

    if current_user.role == "Employee":
        emp = _get_employee_for_user(session, current_user)
        all_records = services.get_daily_attendance(session, date)
        return [r for r in all_records if r["employee_id"] == emp.id]

    return services.get_daily_attendance(session, date)


@router.get("/monthly/{employee_id}", response_model=MonthlyAttendanceSummary)
def get_monthly_attendance(
    employee_id: str,
    month: Optional[int] = None,
    year: Optional[int] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Get monthly attendance summary for an employee.
    Employees can only view their own monthly data."""
    if not month:
        month = datetime.utcnow().month
    if not year:
        year = datetime.utcnow().year

    if current_user.role == "Employee":
        emp = _get_employee_for_user(session, current_user)
        if employee_id != emp.id:
            raise HTTPException(status_code=403, detail="You can only view your own attendance.")

    return services.get_employee_monthly_attendance(session, employee_id, year, month)


@router.get("/my-status")
def get_my_attendance_status(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """Get current user's attendance status for today."""
    emp = _get_employee_for_user(session, current_user)
    today = datetime.utcnow().strftime("%Y-%m-%d")

    from .models import AttendanceRecord
    record = session.exec(
        select(AttendanceRecord).where(
            AttendanceRecord.employee_id == emp.id,
            AttendanceRecord.date == today
        )
    ).first()

    if not record:
        return {"checked_in": False, "checked_out": False, "employee_id": emp.id}

    return {
        "checked_in": record.check_in is not None,
        "checked_out": record.check_out is not None,
        "check_in_time": record.check_in,
        "check_out_time": record.check_out,
        "work_hours": record.work_hours,
        "status": record.status,
        "employee_id": emp.id,
    }
