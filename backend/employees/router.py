from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select, or_
from typing import List, Optional
from config.database import get_session
from authentication.services import get_current_user
from authentication.models import User
from .models import Employee
from .schemas import EmployeeCreate, EmployeeUpdate, EmployeeOut

router = APIRouter()

@router.post("/", response_model=EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(
    emp_in: EmployeeCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    # Enforce admin/manager authorization if needed (simplified check first)
    if current_user.role not in ["Admin", "HR Super Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to add employees."
        )
        
    # Check if ID exists
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
                Employee.name.like(f"%{search}%") if hasattr(Employee, 'name') else False,
                Employee.first_name.like(f"%{search}%"),
                Employee.last_name.like(f"%{search}%"),
                Employee.department.like(f"%{search}%"),
                Employee.id.like(f"%{search}%")
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
    if current_user.role not in ["Admin", "HR Super Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to modify employees."
        )
        
    db_emp = session.get(Employee, id)
    if not db_emp:
        raise HTTPException(status_code=404, detail="Employee not found.")
        
    update_data = emp_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_emp, key, value)
        
    session.add(db_emp)
    session.commit()
    session.refresh(db_emp)
    return db_emp
