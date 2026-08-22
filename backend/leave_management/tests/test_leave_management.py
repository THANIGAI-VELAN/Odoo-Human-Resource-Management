import unittest
from datetime import datetime, timedelta
from sqlmodel import SQLModel, create_engine, Session, select
from fastapi.testclient import TestClient

from config.database import get_session
from main import app
from employees.models import Employee
from authentication.models import User
from holidays.models import Holiday
from leave_management.models import LeaveRequest, LeaveBalance
from leave_management.services import (
    calculate_chargeable_days,
    get_or_create_balance,
    apply_leave_request,
    approve_leave_request,
    reject_leave_request,
    cancel_leave_request
)
from leave_management.schemas import LeaveRequestCreate
from authentication.services import get_password_hash

class TestLeaveManagement(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Create an in-memory SQLite database for testing
        cls.engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
        SQLModel.metadata.create_all(cls.engine)

        # Seed static dependencies
        with Session(cls.engine) as session:
            # Seed holiday
            cls.holiday = Holiday(date="2026-09-07", name="Labor Day")
            session.add(cls.holiday)
            
            # Seed employee
            cls.employee = Employee(
                id="emp-test",
                first_name="John",
                last_name="Doe",
                email="john.doe@dayflow.internal",
                department="QA",
                role="QA Engineer",
                status="Active"
            )
            session.add(cls.employee)
            
            # Seed user
            cls.user = User(
                email="john.doe@dayflow.internal",
                hashed_password=get_password_hash("password123"),
                role="Employee"
            )
            cls.admin_user = User(
                email="admin@dayflow.internal",
                hashed_password=get_password_hash("password123"),
                role="Admin"
            )
            session.add(cls.user)
            session.add(cls.admin_user)
            session.commit()

        cls.client = TestClient(app)

    def setUp(self):
        # Override database session dependency in FastAPI
        def get_session_override():
            with Session(self.engine) as session:
                yield session
        app.dependency_overrides[get_session] = get_session_override
        self.session = Session(self.engine)

    def tearDown(self):
        self.session.close()
        # Clean up requests and reset balances
        with Session(self.engine) as session:
            session.exec(select(LeaveRequest)).all()
            for req in session.exec(select(LeaveRequest)).all():
                session.delete(req)
            for bal in session.exec(select(LeaveBalance)).all():
                session.delete(bal)
            session.commit()

    def test_calculate_chargeable_days(self):
        # 1. Normal duration
        # Friday (2026-09-04) to Tuesday (2026-09-08)
        # Saturday/Sunday: 05, 06. Monday (Holiday): 07.
        # Chargeable: Friday (04), Tuesday (08) -> 2 days.
        days = calculate_chargeable_days(self.session, "2026-09-04", "2026-09-08", False)
        self.assertEqual(days, 2.0)

        # 2. Half day
        days_half = calculate_chargeable_days(self.session, "2026-09-04", "2026-09-08", True)
        self.assertEqual(days_half, 0.5)

    def test_get_or_create_balance(self):
        bal = get_or_create_balance(self.session, "emp-test")
        self.assertEqual(bal.employee_id, "emp-test")
        self.assertEqual(bal.annual_leave, 18.0)
        self.assertEqual(bal.sick_leave, 12.0)

    def test_apply_and_approve_leave_workflow(self):
        # Apply for 2 days (Friday 2026-09-04 to Tuesday 2026-09-08 -> Friday, Tuesday)
        req_in = LeaveRequestCreate(
            employee_id="emp-test",
            leave_type="Annual Leave",
            start_date="2026-09-04",
            end_date="2026-09-08",
            reason="Vacation",
            e_letter="Hello HR",
            is_half_day=False,
            half_day_position=None
        )
        req = apply_leave_request(self.session, req_in)
        self.assertEqual(req.status, "Pending")
        self.assertEqual(req.days_count, 2.0)

        # Verify balance is not yet deducted
        bal = get_or_create_balance(self.session, "emp-test")
        self.assertEqual(bal.annual_leave, 18.0)

        # Overlap check (should raise 400 when applying in same dates)
        with self.assertRaises(Exception):
            apply_leave_request(self.session, req_in)

        # Approve
        approved = approve_leave_request(self.session, req.id)
        self.assertEqual(approved.status, "Approved")

        # Verify balance is deducted
        bal_after = get_or_create_balance(self.session, "emp-test")
        self.assertEqual(bal_after.annual_leave, 16.0)
        self.assertEqual(bal_after.annual_leave_taken, 2.0)

        # Cancel approved request
        cancelled = cancel_leave_request(self.session, req.id)
        self.assertEqual(cancelled.status, "Cancelled")

        # Verify balance is restored
        bal_restored = get_or_create_balance(self.session, "emp-test")
        self.assertEqual(bal_restored.annual_leave, 18.0)
        self.assertEqual(bal_restored.annual_leave_taken, 0.0)

    def test_insufficient_balance(self):
        # Apply for leave longer than balance (18 days)
        # 2026-09-01 to 2026-10-15 is ~30+ days
        req_in = LeaveRequestCreate(
            employee_id="emp-test",
            leave_type="Annual Leave",
            start_date="2026-09-01",
            end_date="2026-10-15",
            reason="Long trip",
            e_letter=""
        )
        with self.assertRaises(Exception):
            apply_leave_request(self.session, req_in)
