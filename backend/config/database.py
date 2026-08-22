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
    # Helper to generate database schemas directly first
    SQLModel.metadata.create_all(engine)

    # Seed mock employees if none exist
    from employees.models import Employee
    with Session(engine) as session:
        stmt = select(Employee)
        existing = session.exec(stmt).first()
        if not existing:
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
