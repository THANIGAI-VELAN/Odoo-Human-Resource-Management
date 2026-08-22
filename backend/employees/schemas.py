from pydantic import BaseModel
from typing import Optional

class EmployeeCreate(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    department: str
    role: str
    job_position: Optional[str] = None
    status: Optional[str] = "Active"
    profile_picture_url: Optional[str] = None
    company: Optional[str] = "Odoo India"
    manager: Optional[str] = None
    location: Optional[str] = "Headquarters"
    date_of_joining: Optional[str] = None
    monthly_wage: Optional[float] = 50000.0

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    role: Optional[str] = None
    job_position: Optional[str] = None
    status: Optional[str] = None
    profile_picture_url: Optional[str] = None
    company: Optional[str] = None
    manager: Optional[str] = None
    location: Optional[str] = None
    date_of_joining: Optional[str] = None
    date_of_birth: Optional[str] = None
    residing_address: Optional[str] = None
    nationality: Optional[str] = None
    personal_email: Optional[str] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_name: Optional[str] = None
    ifsc_code: Optional[str] = None
    pan_no: Optional[str] = None
    uan_no: Optional[str] = None
    about: Optional[str] = None
    job_love: Optional[str] = None
    hobbies: Optional[str] = None
    skills: Optional[str] = None
    certifications: Optional[str] = None
    monthly_wage: Optional[float] = None
    working_days_per_week: Optional[int] = None
    break_time_hrs: Optional[float] = None

class EmployeeOut(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    department: str
    role: str
    job_position: Optional[str] = None
    status: str
    profile_picture_url: Optional[str] = None
    company: Optional[str] = None
    manager: Optional[str] = None
    location: Optional[str] = None
    date_of_joining: Optional[str] = None
    date_of_birth: Optional[str] = None
    residing_address: Optional[str] = None
    nationality: Optional[str] = None
    personal_email: Optional[str] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    bank_account_number: Optional[str] = None
    bank_name: Optional[str] = None
    ifsc_code: Optional[str] = None
    pan_no: Optional[str] = None
    uan_no: Optional[str] = None
    about: Optional[str] = None
    job_love: Optional[str] = None
    hobbies: Optional[str] = None
    skills: Optional[str] = None
    certifications: Optional[str] = None
    monthly_wage: Optional[float] = None
    working_days_per_week: Optional[int] = None
    break_time_hrs: Optional[float] = None

    class Config:
        from_attributes = True

class SalaryBreakdown(BaseModel):
    """Auto-calculated salary breakdown based on monthly wage."""
    monthly_wage: float
    yearly_wage: float
    basic_salary: float
    basic_percentage: float
    hra: float
    hra_percentage: float
    standard_allowance: float
    standard_allowance_percentage: float
    performance_bonus: float
    performance_bonus_percentage: float
    lta: float
    lta_percentage: float
    fixed_allowance: float
    fixed_allowance_percentage: float
    gross_earnings: float
    pf_employee: float
    pf_employee_percentage: float
    pf_employer: float
    pf_employer_percentage: float
    professional_tax: float
    total_deductions: float
    net_pay: float
    working_days_per_week: int
    break_time_hrs: float
