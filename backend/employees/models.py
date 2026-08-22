from sqlmodel import SQLModel, Field
from typing import Optional

class Employee(SQLModel, table=True):
    # Standard employee record
    id: str = Field(primary_key=True, index=True)  # e.g. EMP-001
    first_name: str
    last_name: str
    email: str = Field(index=True)
    department: str
    role: str
    status: str = Field(default="Active")  # Active, On Leave, Inactive
