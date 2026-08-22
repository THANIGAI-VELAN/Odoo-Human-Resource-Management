from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class AttendanceRecord(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: str = Field(index=True)  # References Employee.id
    date: str = Field(index=True)  # YYYY-MM-DD
    check_in: Optional[str] = None  # HH:MM format (24h)
    check_out: Optional[str] = None  # HH:MM format (24h)
    work_hours: Optional[str] = None  # HH:MM format
    extra_hours: Optional[str] = None  # HH:MM format (overtime)
    status: str = Field(default="Present")  # Present, Absent, Late, Half Day, On Leave, Holiday, Weekend
    source: str = Field(default="Manual")  # Manual, Biometric, System
    notes: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"))


class AttendanceRegularization(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: str = Field(index=True)
    date: str  # YYYY-MM-DD
    reason: str
    requested_check_in: Optional[str] = None
    requested_check_out: Optional[str] = None
    status: str = Field(default="Pending")  # Pending, Approved, Rejected
    approved_by: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"))
