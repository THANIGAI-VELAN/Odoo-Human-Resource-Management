from pydantic import BaseModel
from typing import Optional

class LeaveRequestCreate(BaseModel):
    employee_id: str
    leave_type: str
    start_date: str  # YYYY-MM-DD
    end_date: str    # YYYY-MM-DD
    reason: str

class LeaveRequestResponse(BaseModel):
    id: int
    employee_id: str
    employee_name: str
    employee_avatar: str
    leave_type: str
    start_date: str
    end_date: str
    days_count: int
    reason: str
    status: str
    applied_time: str

    class Config:
        from_attributes = True

class LeaveBalanceResponse(BaseModel):
    employee_id: str
    annual_leave: int
    sick_leave: int
    unpaid_leave_taken: int

    class Config:
        from_attributes = True
