from pydantic import BaseModel
from typing import Optional

class EmployeeCreate(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    department: str
    role: str
    status: Optional[str] = "Active"

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None
    status: Optional[str] = None

class EmployeeOut(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    department: str
    role: str
    status: str

    class Config:
        from_attributes = True
