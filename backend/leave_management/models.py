from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date, datetime

class LeaveRequest(SQLModel, table=True):
    # Leave requests applied by employees
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: str = Field(index=True)  # References Employee.id
    leave_type: str  # Annual Leave, Sick Leave, Unpaid Leave
    start_date: str  # format YYYY-MM-DD
    end_date: str    # format YYYY-MM-DD
    days_count: int
    reason: str
    status: str = Field(default="Pending")  # Pending, Approved, Rejected
    applied_time: str = Field(default_factory=lambda: datetime.utcnow().strftime("%Y-%m-%d %H:%M"))

class LeaveBalance(SQLModel, table=True):
    # Tracks PTO balances for employees
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: str = Field(index=True, unique=True)  # References Employee.id
    annual_leave: int = Field(default=18)
    sick_leave: int = Field(default=12)
    unpaid_leave_taken: int = Field(default=0)
