from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class LeaveRequest(SQLModel, table=True):
    # Leave requests applied by employees
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: str = Field(index=True)  # References Employee.id
    leave_type: str  # Annual Leave, Sick Leave, Casual Leave, Unpaid Leave
    start_date: str  # format YYYY-MM-DD
    end_date: str    # format YYYY-MM-DD
    days_count: float
    reason: str
    e_letter: str    # Justification letter text submitted by the employee
    is_half_day: bool = Field(default=False)
    half_day_position: Optional[str] = Field(default=None)  # "Morning" or "Afternoon"
    status: str = Field(default="Pending")  # Pending, Approved, Rejected, Cancelled
    applied_time: str = Field(default_factory=lambda: datetime.utcnow().strftime("%Y-%m-%d %H:%M"))

class LeaveBalance(SQLModel, table=True):
    # Tracks PTO balances for employees
    id: Optional[int] = Field(default=None, primary_key=True)
    employee_id: str = Field(index=True, unique=True)  # References Employee.id
    annual_leave: float = Field(default=18.0)
    sick_leave: float = Field(default=12.0)
    casual_leave: float = Field(default=10.0)
    annual_leave_taken: float = Field(default=0.0)  # Increments only on approval
    sick_leave_taken: float = Field(default=0.0)    # Increments only on approval
    casual_leave_taken: float = Field(default=0.0)  # Increments only on approval
    unpaid_leave_taken: float = Field(default=0.0)  # Increments only on approval
