from sqlmodel import Session, select
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from .models import AttendanceRecord, AttendanceRegularization
from employees.models import Employee
from leave_management.models import LeaveRequest
from holidays.models import Holiday
import calendar


STANDARD_WORK_HOURS = 9  # 9:00 AM to 6:00 PM
STANDARD_START = "09:00"
GRACE_PERIOD_MINUTES = 15


def _time_to_minutes(t: str) -> int:
    """Convert HH:MM to total minutes."""
    parts = t.split(":")
    return int(parts[0]) * 60 + int(parts[1])


def _minutes_to_hhmm(minutes: int) -> str:
    """Convert total minutes to HH:MM format."""
    h = minutes // 60
    m = minutes % 60
    return f"{h:02d}:{m:02d}"


def calculate_work_hours(check_in: str, check_out: str, break_hrs: float = 1.0) -> tuple:
    """Calculate work hours and extra hours from check_in/check_out times.
    Returns (work_hours_str, extra_hours_str)
    """
    in_mins = _time_to_minutes(check_in)
    out_mins = _time_to_minutes(check_out)
    if out_mins <= in_mins:
        out_mins += 24 * 60  # handle overnight

    total_mins = out_mins - in_mins - int(break_hrs * 60)
    if total_mins < 0:
        total_mins = 0

    standard_mins = STANDARD_WORK_HOURS * 60
    extra_mins = max(0, total_mins - standard_mins)

    return _minutes_to_hhmm(total_mins), _minutes_to_hhmm(extra_mins)


def determine_status(check_in: str) -> str:
    """Determine if employee is Present or Late based on check-in time."""
    in_mins = _time_to_minutes(check_in)
    standard_mins = _time_to_minutes(STANDARD_START)
    grace_limit = standard_mins + GRACE_PERIOD_MINUTES

    if in_mins <= grace_limit:
        return "Present"
    return "Late"


def check_in_employee(session: Session, employee_id: str, check_in_time: str = None) -> AttendanceRecord:
    """Record employee check-in for today."""
    emp = session.get(Employee, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail=f"Employee {employee_id} not found.")

    today = datetime.utcnow().strftime("%Y-%m-%d")
    if not check_in_time:
        check_in_time = datetime.utcnow().strftime("%H:%M")

    # Check if already checked in today
    existing = session.exec(
        select(AttendanceRecord).where(
            AttendanceRecord.employee_id == employee_id,
            AttendanceRecord.date == today
        )
    ).first()

    if existing and existing.check_in:
        raise HTTPException(
            status_code=400,
            detail=f"Already checked in today at {existing.check_in}."
        )

    att_status = determine_status(check_in_time)

    if existing:
        existing.check_in = check_in_time
        existing.status = att_status
        session.add(existing)
        session.commit()
        session.refresh(existing)
        return existing

    record = AttendanceRecord(
        employee_id=employee_id,
        date=today,
        check_in=check_in_time,
        status=att_status,
        source="Manual"
    )
    session.add(record)
    session.commit()
    session.refresh(record)
    return record


def check_out_employee(session: Session, employee_id: str, check_out_time: str = None) -> AttendanceRecord:
    """Record employee check-out for today."""
    today = datetime.utcnow().strftime("%Y-%m-%d")
    if not check_out_time:
        check_out_time = datetime.utcnow().strftime("%H:%M")

    record = session.exec(
        select(AttendanceRecord).where(
            AttendanceRecord.employee_id == employee_id,
            AttendanceRecord.date == today
        )
    ).first()

    if not record or not record.check_in:
        raise HTTPException(
            status_code=400,
            detail="No check-in record found for today. Please check in first."
        )

    if record.check_out:
        raise HTTPException(
            status_code=400,
            detail=f"Already checked out today at {record.check_out}."
        )

    # Get employee break time
    emp = session.get(Employee, employee_id)
    break_hrs = emp.break_time_hrs if emp else 1.0

    work_hours, extra_hours = calculate_work_hours(record.check_in, check_out_time, break_hrs)

    record.check_out = check_out_time
    record.work_hours = work_hours
    record.extra_hours = extra_hours
    session.add(record)
    session.commit()
    session.refresh(record)
    return record


def get_daily_attendance(session: Session, date: str) -> list:
    """Get attendance for all employees on a given date (Admin view)."""
    records = session.exec(
        select(AttendanceRecord).where(AttendanceRecord.date == date)
    ).all()

    results = []
    for rec in records:
        emp = session.get(Employee, rec.employee_id)
        if emp:
            results.append({
                "id": rec.id,
                "employee_id": rec.employee_id,
                "employee_name": f"{emp.first_name} {emp.last_name}",
                "employee_avatar": emp.profile_picture_url or f"https://api.dicebear.com/7.x/initials/svg?seed={emp.first_name} {emp.last_name}",
                "date": rec.date,
                "check_in": rec.check_in,
                "check_out": rec.check_out,
                "work_hours": rec.work_hours,
                "extra_hours": rec.extra_hours,
                "status": rec.status,
                "source": rec.source,
            })
    return results


def get_employee_monthly_attendance(session: Session, employee_id: str, year: int, month: int) -> dict:
    """Get monthly attendance for a specific employee (Employee view)."""
    emp = session.get(Employee, employee_id)
    if not emp:
        raise HTTPException(status_code=404, detail=f"Employee {employee_id} not found.")

    # Get all days in month
    _, days_in_month = calendar.monthrange(year, month)

    # Get attendance records
    month_str = f"{year}-{month:02d}"
    records = session.exec(
        select(AttendanceRecord).where(
            AttendanceRecord.employee_id == employee_id,
            AttendanceRecord.date.like(f"{month_str}%")
        )
    ).all()

    # Get holidays
    holidays = session.exec(select(Holiday)).all()
    holiday_dates = {h.date for h in holidays}

    # Get approved leaves
    leaves = session.exec(
        select(LeaveRequest).where(
            LeaveRequest.employee_id == employee_id,
            LeaveRequest.status == "Approved"
        )
    ).all()

    leave_dates = set()
    for leave in leaves:
        try:
            start = datetime.strptime(leave.start_date, "%Y-%m-%d").date()
            end = datetime.strptime(leave.end_date, "%Y-%m-%d").date()
            curr = start
            while curr <= end:
                leave_dates.add(curr.strftime("%Y-%m-%d"))
                curr += timedelta(days=1)
        except ValueError:
            pass

    record_map = {r.date: r for r in records}
    today = datetime.utcnow().date()

    days_present = 0
    days_absent = 0
    days_late = 0
    days_leave = 0
    days_holiday = 0
    total_working_days = 0
    response_records = []

    for day in range(1, days_in_month + 1):
        dt = datetime(year, month, day).date()
        date_str = dt.strftime("%Y-%m-%d")
        is_weekend = dt.weekday() in (5, 6)
        is_holiday = date_str in holiday_dates
        is_leave = date_str in leave_dates

        if is_weekend:
            continue

        if is_holiday:
            days_holiday += 1
            continue

        total_working_days += 1

        if date_str in record_map:
            rec = record_map[date_str]
            if rec.status == "Late":
                days_late += 1
                days_present += 1
            elif rec.status == "Present":
                days_present += 1
            elif rec.status == "Absent":
                days_absent += 1
            response_records.append({
                "id": rec.id,
                "employee_id": rec.employee_id,
                "employee_name": f"{emp.first_name} {emp.last_name}",
                "employee_avatar": emp.profile_picture_url,
                "date": rec.date,
                "check_in": rec.check_in,
                "check_out": rec.check_out,
                "work_hours": rec.work_hours,
                "extra_hours": rec.extra_hours,
                "status": rec.status,
                "source": rec.source,
            })
        elif is_leave:
            days_leave += 1
            response_records.append({
                "id": 0,
                "employee_id": employee_id,
                "employee_name": f"{emp.first_name} {emp.last_name}",
                "employee_avatar": emp.profile_picture_url,
                "date": date_str,
                "check_in": None,
                "check_out": None,
                "work_hours": None,
                "extra_hours": None,
                "status": "On Leave",
                "source": "System",
            })
        elif dt < today:
            days_absent += 1
            response_records.append({
                "id": 0,
                "employee_id": employee_id,
                "employee_name": f"{emp.first_name} {emp.last_name}",
                "employee_avatar": emp.profile_picture_url,
                "date": date_str,
                "check_in": None,
                "check_out": None,
                "work_hours": None,
                "extra_hours": None,
                "status": "Absent",
                "source": "System",
            })

    return {
        "employee_id": employee_id,
        "month": month,
        "year": year,
        "days_present": days_present,
        "days_absent": days_absent,
        "days_late": days_late,
        "days_leave": days_leave,
        "days_holiday": days_holiday,
        "total_working_days": total_working_days,
        "records": sorted(response_records, key=lambda x: x["date"], reverse=True),
    }
