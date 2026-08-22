from pydantic import BaseModel
from typing import Optional

class UserSignup(BaseModel):
    """Signup form matching the wireframe: Name, Email, Phone, Password, Confirm Password."""
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    password: str
    confirm_password: str
    role: Optional[str] = "Employee"
    year_of_joining: Optional[int] = None  # Defaults to current year

class UserCreate(BaseModel):
    email: str
    password: str
    role: Optional[str] = "Employee"

class UserOut(BaseModel):
    id: int
    login_id: Optional[str] = None
    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool
    role: str
    employee_id: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    login_id: Optional[str] = None
    role: str = "Employee"
    email: str = ""
    employee_id: Optional[str] = None

class TokenData(BaseModel):
    email: Optional[str] = None
