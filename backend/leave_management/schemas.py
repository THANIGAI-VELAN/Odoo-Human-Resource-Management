from pydantic import BaseModel
from typing import Optional

class LeaveRequestCreate(BaseModel):
    employee_id: str
    leave_type: str
    start_date: str  # YYYY-MM-DD
    end_date: str    # YYYY-MM-DD
    reason: str
    e_letter: Optional[str] = ""    # The e-letter text submitted by the employee (optional)
    is_half_day: Optional[bool] = False
    half_day_position: Optional[str] = None  # "Morning" or "Afternoon"

class LeaveRequestResponse(BaseModel):
    id: int
    employee_id: str
    employee_name: str
    employee_avatar: str
    leave_type: str
    start_date: str
    end_date: str
    days_count: float
    reason: str
    e_letter: Optional[str] = ""
    is_half_day: bool
    half_day_position: Optional[str] = None
    status: str
    applied_time: str

    class Config:
        from_attributes = True

class LeaveBalanceResponse(BaseModel):
    employee_id: str
    annual_leave: float
    sick_leave: float
    casual_leave: float
    annual_leave_taken: float
    sick_leave_taken: float
    casual_leave_taken: float
    unpaid_leave_taken: float

    class Config:
        from_attributes = True
