from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    login_id: Optional[str] = Field(default=None, unique=True, index=True)  # Auto-generated e.g. OIARDE20220001
    email: str = Field(unique=True, index=True)
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    hashed_password: str
    is_active: bool = Field(default=True)
    role: str = Field(default="Employee")  # Admin, Manager, Payroll, Employee
    employee_id: Optional[str] = Field(default=None, index=True)  # References Employee.id
    year_of_joining: Optional[int] = None
