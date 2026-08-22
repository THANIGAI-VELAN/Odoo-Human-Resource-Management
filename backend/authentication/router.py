from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from config.database import get_session
from config.settings import settings
from .models import User
from .schemas import UserCreate, UserSignup, UserOut, Token
from employees.models import Employee
from .services import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
)

router = APIRouter()

COMPANY_PREFIX = "OI"  # Odoo India


def generate_login_id(session: Session, first_name: str, last_name: str, year: int) -> str:
    """Generate Login ID: [Company Prefix] + [Name Initials 2+2] + [Year] + [Serial].
    Example: OIARDE20220001 for Arjun Desai, 2022, serial 0001.
    """
    # Get first 2 chars of first name + first 2 chars of last name (uppercase)
    fn = (first_name[:2] if len(first_name) >= 2 else first_name.ljust(2, 'X')).upper()
    ln = (last_name[:2] if len(last_name) >= 2 else last_name.ljust(2, 'X')).upper()
    name_initials = fn + ln

    prefix = f"{COMPANY_PREFIX}{name_initials}{year}"

    # Find next serial number for this prefix
    existing = session.exec(
        select(User).where(User.login_id.like(f"{prefix}%"))
    ).all()

    serial = len(existing) + 1
    login_id = f"{prefix}{serial:04d}"
    return login_id


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(user_in: UserSignup, session: Session = Depends(get_session)):
    """Employee signup with auto-generated Login ID."""
    # Validate passwords match
    if user_in.password != user_in.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    # Check if email already exists
    existing_user = session.exec(select(User).where(User.email == user_in.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="A user with this email already exists.")

    year = user_in.year_of_joining or datetime.utcnow().year

    # Generate Login ID
    login_id = generate_login_id(session, user_in.first_name, user_in.last_name, year)

    # Create Employee record
    emp = Employee(
        id=login_id,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        phone=user_in.phone,
        department="Unassigned",
        role="Employee",
        company="Odoo India",
        date_of_joining=f"{year}-01-01",
        monthly_wage=50000.0,
    )
    session.add(emp)

    # Create User record
    hashed_password = get_password_hash(user_in.password)
    user = User(
        login_id=login_id,
        email=user_in.email,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        phone=user_in.phone,
        hashed_password=hashed_password,
        role=user_in.role or "Employee",
        employee_id=login_id,
        year_of_joining=year,
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session)
):
    """Login with email or Login ID + password."""
    # Try email first, then login_id
    user = session.exec(select(User).where(User.email == form_data.username)).first()
    if not user:
        user = session.exec(select(User).where(User.login_id == form_data.username)).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email/login ID or password"
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    return Token(
        access_token=access_token,
        token_type="bearer",
        login_id=user.login_id,
        role=user.role,
        email=user.email,
        employee_id=user.employee_id,
    )


@router.get("/me", response_model=UserOut)
def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user
