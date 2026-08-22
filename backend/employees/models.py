from sqlmodel import SQLModel, Field
from typing import Optional

class Employee(SQLModel, table=True):
    # Core identity
    id: str = Field(primary_key=True, index=True)  # Auto-generated Login ID e.g. OIARDE20220001
    first_name: str
    last_name: str
    email: str = Field(index=True)
    phone: Optional[str] = None
    department: str
    role: str  # Job title
    job_position: Optional[str] = None
    status: str = Field(default="Active")  # Active, On Leave, Inactive
    profile_picture_url: Optional[str] = None

    # Organizational
    company: str = Field(default="Odoo India")
    manager: Optional[str] = None
    location: Optional[str] = Field(default="Headquarters")
    date_of_joining: Optional[str] = None  # YYYY-MM-DD

    # Private Info
    date_of_birth: Optional[str] = None  # YYYY-MM-DD
    residing_address: Optional[str] = None
    nationality: Optional[str] = None
    personal_email: Optional[str] = None
    gender: Optional[str] = None  # Male, Female, Other
    marital_status: Optional[str] = None  # Single, Married, Divorced, Widowed

    # Bank & Compliance
    bank_account_number: Optional[str] = None
    bank_name: Optional[str] = None
    ifsc_code: Optional[str] = None
    pan_no: Optional[str] = None
    uan_no: Optional[str] = None

    # Resume sections
    about: Optional[str] = None
    job_love: Optional[str] = None  # "What I love about my job"
    hobbies: Optional[str] = None  # "My interests and hobbies"
    skills: Optional[str] = None  # Comma-separated skills
    certifications: Optional[str] = None  # Comma-separated certifications

    # Salary
    monthly_wage: float = Field(default=50000.0)
    working_days_per_week: int = Field(default=5)
    break_time_hrs: float = Field(default=1.0)
