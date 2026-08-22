from sqlmodel import SQLModel, create_engine, Session, select
from .settings import settings

connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(settings.DATABASE_URL, connect_args=connect_args, echo=False)

def get_session():
    with Session(engine) as session:
        yield session

def init_db():
    # Import models here to register them with metadata before creating tables
    from employees.models import Employee
    from authentication.models import User
    from leave_management.models import LeaveRequest, LeaveBalance
    from holidays.models import Holiday

    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # Seed mock employees if none exist
        existing_emp = session.exec(select(Employee)).first()
        if not existing_emp:
            mock_employees = [
                Employee(id="emp-1", first_name="Arjun", last_name="Desai", email="arjun.desai@dayflow.internal", department="Product Development", role="Senior Software Engineer", status="Active"),
                Employee(id="emp-2", first_name="Sarah", last_name="Jenkins", email="sarah.jenkins@dayflow.internal", department="Product Team", role="Senior Product Manager", status="Active"),
                Employee(id="emp-3", first_name="Marcus", last_name="Chen", email="marcus.chen@dayflow.internal", department="Engineering", role="Lead Developer", status="Active"),
                Employee(id="emp-4", first_name="Elena", last_name="Rodriguez", email="elena.rodriguez@dayflow.internal", department="Design Team", role="UX Designer", status="Active"),
                Employee(id="emp-5", first_name="David", last_name="Kim", email="david.kim@dayflow.internal", department="Marketing", role="Marketing Director", status="Active"),
            ]
            for emp in mock_employees:
                session.add(emp)
            session.commit()

        # Seed mock users if none exist
        existing_user = session.exec(select(User)).first()
        if not existing_user:
            from authentication.services import get_password_hash
            mock_users = [
                User(email="admin@dayflow.internal", hashed_password=get_password_hash("demopassword123"), role="Admin"),
                User(email="admin@prohrms.com", hashed_password=get_password_hash("password"), role="Admin"),
                User(email="arjun.desai@dayflow.internal", hashed_password=get_password_hash("demopassword123"), role="Employee"),
                User(email="sarah.jenkins@dayflow.internal", hashed_password=get_password_hash("demopassword123"), role="Admin"),
            ]
            for user in mock_users:
                session.add(user)
            session.commit()

        # Seed holidays if none exist
        existing_holiday = session.exec(select(Holiday)).first()
        if not existing_holiday:
            mock_holidays = [
                Holiday(date="2026-01-01", name="New Year's Day"),
                Holiday(date="2026-07-04", name="Independence Day"),
                Holiday(date="2026-09-07", name="Labor Day"),
                Holiday(date="2026-11-26", name="Thanksgiving"),
                Holiday(date="2026-12-25", name="Christmas Day"),
            ]
            for h in mock_holidays:
                session.add(h)
            session.commit()

