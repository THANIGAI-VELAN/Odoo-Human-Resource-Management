from pydantic import BaseModel
from typing import Optional, List

class CheckInRequest(BaseModel):
    employee_id: str
    check_in_time: Optional[str] = None  # HH:MM, defaults to current time

class CheckOutRequest(BaseModel):
    employee_id: str
    check_out_time: Optional[str] = None  # HH:MM, defaults to current time

class AttendanceRecordResponse(BaseModel):
    id: int
    employee_id: str
    employee_name: Optional[str] = None
    employee_avatar: Optional[str] = None
    date: str
    check_in: Optional[str] = None
    check_out: Optional[str] = None
    work_hours: Optional[str] = None
    extra_hours: Optional[str] = None
    status: str
    source: str

    class Config:
        from_attributes = True

class MonthlyAttendanceSummary(BaseModel):
    employee_id: str
    month: int
    year: int
    days_present: int
    days_absent: int
    days_late: int
    days_leave: int
    days_holiday: int
    total_working_days: int
    records: List[AttendanceRecordResponse]

class RegularizationRequest(BaseModel):
    employee_id: str
    date: str
    reason: str
    requested_check_in: Optional[str] = None
    requested_check_out: Optional[str] = None

class RegularizationResponse(BaseModel):
    id: int
    employee_id: str
    date: str
    reason: str
    requested_check_in: Optional[str] = None
    requested_check_out: Optional[str] = None
    status: str
    approved_by: Optional[str] = None

    class Config:
        from_attributes = True
