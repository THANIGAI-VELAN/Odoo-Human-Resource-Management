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
    # Import all models to register them with metadata
    from employees.models import Employee
    from authentication.models import User
    from leave_management.models import LeaveRequest, LeaveBalance
    from holidays.models import Holiday
    from attendance.models import AttendanceRecord, AttendanceRegularization

    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        # Seed employees if none exist
        existing_emp = session.exec(select(Employee)).first()
        if not existing_emp:
            mock_employees = [
                Employee(
                    id="OIARDE20220001", first_name="Arjun", last_name="Desai",
                    email="arjun.desai@odoo.internal", phone="+91 98765 43210",
                    department="Product Development", role="Senior Software Engineer",
                    job_position="Senior Software Engineer", company="Odoo India",
                    manager="Sarah Jenkins", location="Headquarters",
                    date_of_joining="2022-01-12", date_of_birth="1995-03-14",
                    residing_address="42 Tech Park, Whitefield, Bangalore 560066",
                    nationality="Indian", personal_email="arjun.personal@gmail.com",
                    gender="Male", marital_status="Single",
                    bank_account_number="1234567890123456", bank_name="HDFC Bank",
                    ifsc_code="HDFC0001234", pan_no="ABCDE1234F", uan_no="100123456789",
                    about="Passionate full-stack developer with expertise in React, Python, and cloud architecture. Building scalable HRMS solutions.",
                    job_love="I love solving complex problems and building products that make people's work lives easier.",
                    hobbies="Open source contributing, Chess, Mountain biking, Reading sci-fi novels",
                    skills="Python,JavaScript,React,FastAPI,PostgreSQL,Docker,AWS,TypeScript",
                    certifications="AWS Solutions Architect,Google Cloud Professional,Scrum Master Certified",
                    monthly_wage=50000.0, working_days_per_week=5, break_time_hrs=1.0,
                    profile_picture_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=b6e3f4",
                    status="Active",
                ),
                Employee(
                    id="OISAJE20210001", first_name="Sarah", last_name="Jenkins",
                    email="sarah.jenkins@odoo.internal", phone="+1 (555) 349-2918",
                    department="Product Team", role="HR Director",
                    job_position="HR Director", company="Odoo India",
                    manager="Executive Board", location="Headquarters",
                    date_of_joining="2021-03-15", date_of_birth="1988-07-22",
                    residing_address="12 Corporate Drive, Manhattan, NY 10001",
                    nationality="American", personal_email="sarah.j.personal@gmail.com",
                    gender="Female", marital_status="Married",
                    bank_account_number="9876543210987654", bank_name="Chase Bank",
                    ifsc_code="CHAS0009876", pan_no="FGHIJ5678K", uan_no="200987654321",
                    about="HR Director with 10+ years of experience in talent management and organizational development.",
                    job_love="Building and nurturing teams that deliver exceptional results.",
                    hobbies="Yoga, Travel photography, Wine tasting, Mentoring",
                    skills="HR Strategy,Talent Acquisition,Performance Management,Conflict Resolution,Labour Law",
                    certifications="SHRM-SCP,PHR Certified,Executive Coaching Certificate",
                    monthly_wage=72000.0, working_days_per_week=5, break_time_hrs=1.0,
                    profile_picture_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffd5dc",
                    status="Active",
                ),
                Employee(
                    id="OIMACH20220001", first_name="Marcus", last_name="Chen",
                    email="marcus.chen@odoo.internal", phone="+1 (555) 489-1049",
                    department="Engineering", role="Lead Developer",
                    job_position="Lead Developer", company="Odoo India",
                    manager="Sarah Jenkins", location="Headquarters",
                    date_of_joining="2022-06-01", date_of_birth="1992-11-08",
                    nationality="American", gender="Male", marital_status="Single",
                    about="Full-stack developer specializing in microservices and distributed systems.",
                    skills="Java,Spring Boot,Kubernetes,React,GraphQL,MongoDB",
                    monthly_wage=68000.0, working_days_per_week=5, break_time_hrs=1.0,
                    profile_picture_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=c0aede",
                    status="Active",
                ),
                Employee(
                    id="OIELRO20230001", first_name="Elena", last_name="Rodriguez",
                    email="elena.rodriguez@odoo.internal", phone="+1 (555) 912-3849",
                    department="Design Team", role="UX Designer",
                    job_position="Senior UX Designer", company="Odoo India",
                    manager="Sarah Jenkins", location="Remote",
                    date_of_joining="2023-01-10", date_of_birth="1994-05-30",
                    nationality="Mexican", gender="Female", marital_status="Single",
                    about="UX Designer passionate about creating intuitive and accessible user experiences.",
                    skills="Figma,Adobe XD,User Research,Prototyping,Design Systems,CSS",
                    monthly_wage=55000.0, working_days_per_week=5, break_time_hrs=1.0,
                    profile_picture_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffd5dc",
                    status="Active",
                ),
                Employee(
                    id="OIDAKI20200001", first_name="David", last_name="Kim",
                    email="david.kim@odoo.internal", phone="+1 (555) 723-9014",
                    department="Marketing", role="Marketing Director",
                    job_position="Marketing Director", company="Odoo India",
                    manager="Executive Board", location="Headquarters",
                    date_of_joining="2020-11-01", date_of_birth="1985-09-15",
                    nationality="Korean-American", gender="Male", marital_status="Married",
                    about="Marketing strategist with deep expertise in B2B SaaS growth and brand positioning.",
                    skills="Marketing Strategy,Content Marketing,SEO,Analytics,Brand Management",
                    monthly_wage=85000.0, working_days_per_week=5, break_time_hrs=1.0,
                    profile_picture_url="https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=b6e3f4",
                    status="Active",
                ),
            ]
            for emp in mock_employees:
                session.add(emp)
            session.commit()

        # Seed users if none exist
        existing_user = session.exec(select(User)).first()
        if not existing_user:
            from authentication.services import get_password_hash
            mock_users = [
                User(
                    login_id="OISAJE20210001", email="sarah.jenkins@odoo.internal",
                    first_name="Sarah", last_name="Jenkins",
                    hashed_password=get_password_hash("password123"),
                    role="Admin", employee_id="OISAJE20210001", year_of_joining=2021,
                ),
                User(
                    login_id="OIARDE20220001", email="arjun.desai@odoo.internal",
                    first_name="Arjun", last_name="Desai",
                    hashed_password=get_password_hash("password123"),
                    role="Employee", employee_id="OIARDE20220001", year_of_joining=2022,
                ),
                User(
                    login_id="OIMACH20220001", email="marcus.chen@odoo.internal",
                    first_name="Marcus", last_name="Chen",
                    hashed_password=get_password_hash("password123"),
                    role="Employee", employee_id="OIMACH20220001", year_of_joining=2022,
                ),
                User(
                    login_id="OIELRO20230001", email="elena.rodriguez@odoo.internal",
                    first_name="Elena", last_name="Rodriguez",
                    hashed_password=get_password_hash("password123"),
                    role="Employee", employee_id="OIELRO20230001", year_of_joining=2023,
                ),
                User(
                    login_id="OIDAKI20200001", email="david.kim@odoo.internal",
                    first_name="David", last_name="Kim",
                    hashed_password=get_password_hash("password123"),
                    role="Admin", employee_id="OIDAKI20200001", year_of_joining=2020,
                ),
            ]
            for user in mock_users:
                session.add(user)
            session.commit()

        # Seed holidays if none exist
        existing_holiday = session.exec(select(Holiday)).first()
        if not existing_holiday:
            mock_holidays = [
                Holiday(date="2026-01-14", name="Makar Sankranti"),
                Holiday(date="2026-01-26", name="Republic Day"),
                Holiday(date="2026-03-14", name="Holi"),
                Holiday(date="2026-04-14", name="Ambedkar Jayanti"),
                Holiday(date="2026-05-01", name="May Day"),
                Holiday(date="2026-08-15", name="Independence Day"),
                Holiday(date="2026-10-02", name="Gandhi Jayanti"),
                Holiday(date="2026-10-20", name="Dussehra"),
                Holiday(date="2026-11-09", name="Diwali"),
                Holiday(date="2026-12-25", name="Christmas Day"),
            ]
            for h in mock_holidays:
                session.add(h)
            session.commit()

        # Seed attendance data for current month
        existing_att = session.exec(select(AttendanceRecord)).first()
        if not existing_att:
            from datetime import datetime, timedelta
            import random

            today = datetime.utcnow().date()
            emp_ids = ["OIARDE20220001", "OISAJE20210001", "OIMACH20220001", "OIELRO20230001", "OIDAKI20200001"]

            for emp_id in emp_ids:
                for day_offset in range(1, 16):
                    dt = today - timedelta(days=day_offset)
                    if dt.weekday() in (5, 6):  # Skip weekends
                        continue

                    # Random check-in between 08:30 and 10:00
                    check_in_hour = random.choice([8, 9, 9, 9, 10])
                    check_in_min = random.randint(0, 59)
                    check_in = f"{check_in_hour:02d}:{check_in_min:02d}"

                    # Random check-out between 17:00 and 20:00
                    check_out_hour = random.choice([17, 18, 18, 19, 19, 20])
                    check_out_min = random.randint(0, 59)
                    check_out = f"{check_out_hour:02d}:{check_out_min:02d}"

                    # Calculate work hours
                    in_mins = check_in_hour * 60 + check_in_min
                    out_mins = check_out_hour * 60 + check_out_min
                    total_mins = max(0, out_mins - in_mins - 60)  # minus 1hr break
                    work_h = total_mins // 60
                    work_m = total_mins % 60
                    extra_mins = max(0, total_mins - 9 * 60)
                    extra_h = extra_mins // 60
                    extra_m = extra_mins % 60

                    att_status = "Late" if in_mins > (9 * 60 + 15) else "Present"

                    record = AttendanceRecord(
                        employee_id=emp_id,
                        date=dt.strftime("%Y-%m-%d"),
                        check_in=check_in,
                        check_out=check_out,
                        work_hours=f"{work_h:02d}:{work_m:02d}",
                        extra_hours=f"{extra_h:02d}:{extra_m:02d}",
                        status=att_status,
                        source="System",
                    )
                    session.add(record)

            session.commit()

        # Seed leave balances if none exist
        existing_balance = session.exec(select(LeaveBalance)).first()
        if not existing_balance:
            for emp_id in ["OIARDE20220001", "OISAJE20210001", "OIMACH20220001", "OIELRO20230001", "OIDAKI20200001"]:
                balance = LeaveBalance(employee_id=emp_id)
                session.add(balance)
            session.commit()
