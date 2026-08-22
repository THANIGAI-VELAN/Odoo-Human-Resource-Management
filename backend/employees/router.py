from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, or_
from typing import List, Optional
from config.database import get_session
from authentication.services import get_current_user
from authentication.models import User
from .models import Employee
from .schemas import EmployeeCreate, EmployeeUpdate, EmployeeOut, SalaryBreakdown

router = APIRouter()


def compute_salary_breakdown(emp: Employee) -> SalaryBreakdown:
    """Auto-calculate salary components based on monthly wage.
    Rules:
    - Basic: 50% of wage
    - HRA: 50% of basic
    - Standard Allowance: 4167 (fixed)
    - Performance Bonus: 8.33% of basic
    - LTA: 8.33% of basic
    - Fixed Allowance: wage - sum of all other components
    - PF Employee/Employer: 12% of basic
    - Professional Tax: 200 fixed
    """
    wage = emp.monthly_wage or 50000.0

    basic = round(wage * 0.50, 2)
    hra = round(basic * 0.50, 2)
    std_allowance = 4167.00
    perf_bonus = round(basic * 0.0833, 2)
    lta = round(basic * 0.0833, 2)

    allocated = basic + hra + std_allowance + perf_bonus + lta
    fixed_allowance = round(max(0, wage - allocated), 2)

    gross_earnings = basic + hra + std_allowance + perf_bonus + lta + fixed_allowance

    pf_employee = round(basic * 0.12, 2)
    pf_employer = round(basic * 0.12, 2)
    professional_tax = 200.00
    total_deductions = pf_employee + professional_tax
    net_pay = round(gross_earnings - total_deductions, 2)

    return SalaryBreakdown(
        monthly_wage=wage,
        yearly_wage=round(wage * 12, 2),
        basic_salary=basic,
        basic_percentage=50.00,
        hra=hra,
        hra_percentage=round(hra / wage * 100, 2) if wage else 0,
        standard_allowance=std_allowance,
        standard_allowance_percentage=round(std_allowance / wage * 100, 2) if wage else 0,
        performance_bonus=perf_bonus,
        performance_bonus_percentage=round(perf_bonus / wage * 100, 2) if wage else 0,
        lta=lta,
        lta_percentage=round(lta / wage * 100, 2) if wage else 0,
        fixed_allowance=fixed_allowance,
        fixed_allowance_percentage=round(fixed_allowance / wage * 100, 2) if wage else 0,
        gross_earnings=round(gross_earnings, 2),
        pf_employee=pf_employee,
        pf_employee_percentage=12.00,
        pf_employer=pf_employer,
        pf_employer_percentage=12.00,
        professional_tax=professional_tax,
        total_deductions=round(total_deductions, 2),
        net_pay=net_pay,
        working_days_per_week=emp.working_days_per_week or 5,
        break_time_hrs=emp.break_time_hrs or 1.0,
    )


@router.post("/", response_model=EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(
    emp_in: EmployeeCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in ["Admin", "HR Super Admin"]:
        raise HTTPException(status_code=403, detail="You do not have permission to add employees.")

    existing = session.get(Employee, emp_in.id)
    if existing:
        raise HTTPException(status_code=400, detail="Employee with this ID already exists.")

    db_emp = Employee(**emp_in.dict())
    session.add(db_emp)
    session.commit()
    session.refresh(db_emp)
    return db_emp


@router.get("/", response_model=List[EmployeeOut])
def read_employees(
    search: Optional[str] = None,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    statement = select(Employee)
    if search:
        statement = statement.where(
            or_(
                Employee.first_name.like(f"%{search}%"),
                Employee.last_name.like(f"%{search}%"),
                Employee.department.like(f"%{search}%"),
                Employee.id.like(f"%{search}%"),
                Employee.role.like(f"%{search}%"),
            )
        )
    return session.exec(statement).all()


@router.get("/{id}", response_model=EmployeeOut)
def read_employee_by_id(
    id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    db_emp = session.get(Employee, id)
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found.")
    return db_emp


@router.put("/{id}", response_model=EmployeeOut)
def update_employee(
    id: str,
    emp_in: EmployeeUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    db_emp = session.get(Employee, id)
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found.")

    # Employees can update their own non-salary fields
    if current_user.role == "Employee":
        emp_record = session.exec(select(Employee).where(Employee.email == current_user.email)).first()
        if not emp_record or emp_record.id != id:
            raise HTTPException(status_code=403, detail="You can only update your own profile.")
        # Block salary changes for non-admin
        if emp_in.monthly_wage is not None or emp_in.working_days_per_week is not None:
            raise HTTPException(status_code=403, detail="Only admins can modify salary information.")

    update_data = emp_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_emp, key, value)

    session.add(db_emp)
    session.commit()
    session.refresh(db_emp)
    return db_emp


@router.get("/{id}/salary", response_model=SalaryBreakdown)
def get_employee_salary(
    id: str,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get auto-calculated salary breakdown. Admin-only endpoint."""
    if current_user.role not in ["Admin", "HR Super Admin", "Manager"]:
        raise HTTPException(status_code=403, detail="Salary information is restricted to admins.")

    db_emp = session.get(Employee, id)
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found.")

    return compute_salary_breakdown(db_emp)


@router.put("/{id}/salary")
def update_employee_salary(
    id: str,
    monthly_wage: float,
    working_days_per_week: int = 5,
    break_time_hrs: float = 1.0,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Update employee salary (admin-only). Returns recalculated breakdown."""
    if current_user.role not in ["Admin", "HR Super Admin"]:
        raise HTTPException(status_code=403, detail="Only admins can modify salary information.")

    db_emp = session.get(Employee, id)
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found.")

    db_emp.monthly_wage = monthly_wage
    db_emp.working_days_per_week = working_days_per_week
    db_emp.break_time_hrs = break_time_hrs
    session.add(db_emp)
    session.commit()
    session.refresh(db_emp)

    return compute_salary_breakdown(db_emp)
