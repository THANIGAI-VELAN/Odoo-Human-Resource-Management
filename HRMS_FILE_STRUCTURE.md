# HRMS — Complete Project File Structure

## Purpose

This document defines the complete repository structure for the HRMS project.

The project uses a **feature-first architecture**:

- Backend is organized by business feature.
- Frontend is organized by business feature.
- Database assets are isolated in `database/`.
- All project documentation is isolated in `docs/`.
- Shared backend functionality belongs in `backend/core/`.
- Shared frontend functionality belongs in `frontend/src/components/`.
- Business logic must remain inside the appropriate feature.

The structure is designed for maintainability, scalability, professional team development, and AI-assisted development with Gemini.

---

# 1. Complete Root Structure

```text
HRMS/
│
├── backend/
├── frontend/
├── database/
├── docs/
├── scripts/
├── tests/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

# 2. Backend Structure

The backend uses a **modular feature-first architecture**.

Each business feature owns its models, API logic, business services, validation, permissions, and tests.

```text
backend/
│
├── config/
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   ├── production.py
│   │   └── testing.py
│   │
│   ├── urls.py
│   ├── asgi.py
│   ├── wsgi.py
│   └── celery.py
│
├── core/
│   ├── exceptions/
│   ├── middleware/
│   ├── permissions/
│   ├── pagination/
│   ├── validators/
│   ├── constants/
│   └── utilities/
│
├── authentication/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   ├── permissions.py
│   ├── validators.py
│   └── tests/
│
├── employees/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   ├── filters.py
│   ├── permissions.py
│   ├── validators.py
│   └── tests/
│
├── departments/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   ├── permissions.py
│   └── tests/
│
├── attendance/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   ├── validators.py
│   ├── filters.py
│   ├── permissions.py
│   └── tests/
│
├── leave_management/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   ├── validators.py
│   ├── permissions.py
│   ├── filters.py
│   └── tests/
│
├── payroll/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   ├── calculations.py
│   ├── validators.py
│   ├── permissions.py
│   ├── tasks.py
│   ├── payslip.py
│   └── tests/
│
├── shifts/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   ├── validators.py
│   └── tests/
│
├── holidays/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   └── tests/
│
├── documents/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   ├── storage.py
│   ├── validators.py
│   ├── permissions.py
│   └── tests/
│
├── promotions/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   ├── permissions.py
│   └── tests/
│
├── performance/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   ├── calculations.py
│   ├── permissions.py
│   └── tests/
│
├── recruitment/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   ├── validators.py
│   ├── permissions.py
│   └── tests/
│
├── meetings/
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── services.py
│   └── tests/
│
├── notifications/
│   ├── models.py
│   ├── services.py
│   ├── tasks.py
│   ├── email.py
│   ├── sms.py
│   ├── serializers.py
│   └── tests/
│
├── reports/
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   ├── services.py
│   ├── permissions.py
│   ├── generators/
│   │   ├── employee_report.py
│   │   ├── attendance_report.py
│   │   ├── leave_report.py
│   │   ├── payroll_report.py
│   │   └── performance_report.py
│   └── tests/
│
├── audit/
│   ├── models.py
│   ├── serializers.py
│   ├── services.py
│   ├── middleware.py
│   ├── permissions.py
│   └── tests/
│
├── integrations/
│   ├── email/
│   ├── sms/
│   ├── storage/
│   ├── banking/
│   ├── accounting/
│   ├── biometric/
│   └── calendar/
│
├── tasks/
│   ├── payroll_tasks.py
│   ├── notification_tasks.py
│   ├── report_tasks.py
│   ├── maintenance_tasks.py
│   └── analytics_tasks.py
│
├── manage.py
├── requirements.txt
├── Dockerfile
└── .env.example
```

---

# 3. Backend Feature Architecture

Every major backend feature should follow this pattern:

```text
feature_name/
│
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── services.py
├── validators.py
├── permissions.py
├── filters.py
└── tests/
```

Not every feature needs every file. Only create files when they are actually required.

## File Responsibilities

| File | Responsibility |
|---|---|
| `models.py` | Database models and relationships |
| `serializers.py` | API input/output transformation |
| `views.py` | HTTP/API endpoints |
| `urls.py` | Feature API routes |
| `services.py` | Business logic and workflows |
| `validators.py` | Feature-specific validation |
| `permissions.py` | Feature-level authorization |
| `filters.py` | Search, filtering, sorting |
| `tasks.py` | Background jobs |
| `calculations.py` | Complex domain calculations |
| `tests/` | Unit and integration tests |

---

# 4. Backend Business Logic Rule

Do not put complex business logic directly inside API views.

Use:

```text
API Request
    ↓
View
    ↓
Serializer / Validation
    ↓
Service
    ↓
Model / Database
    ↓
Audit / Notification / Background Task
```

Example:

```text
POST /api/v1/leaves/{id}/approve
                ↓
        LeaveApprovalView
                ↓
       LeaveApprovalService
                ↓
        Validate permission
                ↓
        Validate request
                ↓
       Update leave request
                ↓
       Update leave balance
                ↓
       Update attendance
                ↓
          Audit action
                ↓
       Send notification
```

---

# 5. Authentication Backend

```text
authentication/
│
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── services.py
├── permissions.py
├── validators.py
└── tests/
```

Responsibilities:

- Login
- Logout
- Password reset
- Password change
- Session management
- User activation/deactivation
- Role assignment
- Authentication audit
- MFA-ready architecture

---

# 6. Employee Backend

```text
employees/
│
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── services.py
├── filters.py
├── permissions.py
├── validators.py
└── tests/
```

Responsibilities:

- Employee CRUD
- Employee profile
- Employee search
- Employee filtering
- Employment status
- Manager assignment
- Employee lifecycle
- Employee history
- Employee ID generation
- Employee archival

---

# 7. Department Backend

```text
departments/
│
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── services.py
├── permissions.py
└── tests/
```

Responsibilities:

- Create department
- Update department
- Archive department
- Assign department manager
- View department employees
- Department statistics

---

# 8. Attendance Backend

```text
attendance/
│
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── services.py
├── validators.py
├── filters.py
├── permissions.py
└── tests/
```

Responsibilities:

- Daily attendance
- Present/Absent/Leave
- Late attendance
- Half-day
- Overtime
- Attendance correction
- Attendance reports
- Attendance history

---

# 9. Leave Backend

```text
leave_management/
│
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── services.py
├── validators.py
├── permissions.py
├── filters.py
└── tests/
```

Responsibilities:

- Leave types
- Leave balances
- Leave requests
- Approval/rejection
- Leave cancellation
- Leave history
- Leave policies
- Leave calendar

---

# 10. Payroll Backend

Payroll is a high-sensitivity business domain and must remain isolated.

```text
payroll/
│
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── services.py
├── calculations.py
├── validators.py
├── permissions.py
├── tasks.py
├── payslip.py
└── tests/
```

Responsibilities:

- Salary structures
- Salary components
- Allowances
- Bonuses
- Deductions
- Overtime
- Tax
- PF
- Insurance
- Gross salary
- Net salary
- Payroll runs
- Payslips
- Payroll history

Payroll calculation logic must not be duplicated in the frontend.

---

# 11. Documents Backend

```text
documents/
│
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── services.py
├── storage.py
├── validators.py
├── permissions.py
└── tests/
```

Responsibilities:

- Upload documents
- Download documents
- Delete/archive documents
- Document categories
- Document expiry
- File validation
- Secure file access
- Document versioning

Sensitive employee documents must never be publicly accessible.

---

# 12. Performance Backend

```text
performance/
│
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── services.py
├── calculations.py
├── permissions.py
└── tests/
```

Responsibilities:

- Performance cycles
- Goals
- KPIs
- Self-review
- Manager review
- Ratings
- Feedback
- Performance history

---

# 13. Recruitment Backend

```text
recruitment/
│
├── models.py
├── serializers.py
├── views.py
├── urls.py
├── services.py
├── validators.py
├── permissions.py
└── tests/
```

Responsibilities:

- Job postings
- Candidates
- Applications
- Resume management
- Interview scheduling
- Interview feedback
- Offers
- Candidate lifecycle

---

# 14. Notifications Backend

```text
notifications/
│
├── models.py
├── serializers.py
├── services.py
├── tasks.py
├── email.py
├── sms.py
└── tests/
```

Notifications should support:

- In-app notifications
- Email
- SMS where required
- Notification preferences
- Read/unread state
- Background delivery

Heavy notification operations should use Celery.

---

# 15. Reports Backend

```text
reports/
│
├── views.py
├── serializers.py
├── urls.py
├── services.py
├── permissions.py
│
├── generators/
│   ├── employee_report.py
│   ├── attendance_report.py
│   ├── leave_report.py
│   ├── payroll_report.py
│   └── performance_report.py
│
└── tests/
```

Reports should support:

- CSV
- PDF
- Dashboard summaries
- Filtered reports
- Date ranges
- Department filtering
- Employee filtering

---

# 16. Audit Backend

```text
audit/
│
├── models.py
├── serializers.py
├── services.py
├── middleware.py
├── permissions.py
└── tests/
```

Audit important operations such as:

- Employee changes
- Salary changes
- Payroll finalization
- Leave approval
- Permission changes
- User creation
- Document access
- Employee termination

Audit records should be append-only from normal application interfaces.

---

# 17. Frontend Structure

The frontend should also be organized by feature.

```text
frontend/
│
├── public/
│   ├── images/
│   ├── icons/
│   └── assets/
│
├── src/
│   │
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   │
│   │   ├── employees/
│   │   │   ├── page.tsx
│   │   │   ├── create/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── attendance/
│   │   ├── leave/
│   │   ├── payroll/
│   │   ├── departments/
│   │   ├── performance/
│   │   ├── recruitment/
│   │   ├── reports/
│   │   └── settings/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── tables/
│   │   ├── forms/
│   │   ├── modals/
│   │   ├── charts/
│   │   └── common/
│   │
│   ├── features/
│   │   ├── authentication/
│   │   ├── employees/
│   │   ├── departments/
│   │   ├── attendance/
│   │   ├── leave/
│   │   ├── payroll/
│   │   ├── shifts/
│   │   ├── holidays/
│   │   ├── documents/
│   │   ├── promotions/
│   │   ├── performance/
│   │   ├── recruitment/
│   │   ├── meetings/
│   │   ├── notifications/
│   │   ├── reports/
│   │   ├── audit/
│   │   └── settings/
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── upload.ts
│   │
│   ├── hooks/
│   ├── stores/
│   ├── types/
│   ├── lib/
│   └── utils/
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
└── .env.example
```

---

# 18. Frontend Feature Structure

Each major frontend feature should follow this pattern:

```text
frontend/src/features/feature_name/
│
├── components/
├── hooks/
├── services/
├── schemas/
├── types/
└── index.ts
```

For example:

```text
frontend/src/features/employees/
│
├── components/
│   ├── EmployeeTable.tsx
│   ├── EmployeeForm.tsx
│   ├── EmployeeCard.tsx
│   ├── EmployeeFilters.tsx
│   ├── EmployeeProfile.tsx
│   └── EmployeeStatusBadge.tsx
│
├── hooks/
│   ├── useEmployees.ts
│   ├── useEmployee.ts
│   └── useCreateEmployee.ts
│
├── services/
│   └── employeeApi.ts
│
├── schemas/
│   └── employeeSchema.ts
│
├── types/
│   └── employee.ts
│
└── index.ts
```

---

# 19. Leave Frontend Example

```text
frontend/src/features/leave/
│
├── components/
│   ├── LeaveTable.tsx
│   ├── LeaveForm.tsx
│   ├── LeaveBalanceCard.tsx
│   ├── LeaveApprovalModal.tsx
│   ├── LeaveCalendar.tsx
│   └── LeaveStatusBadge.tsx
│
├── hooks/
│   ├── useLeaves.ts
│   ├── useLeaveBalance.ts
│   └── useLeaveApproval.ts
│
├── services/
│   └── leaveApi.ts
│
├── schemas/
│   └── leaveSchema.ts
│
├── types/
│   └── leave.ts
│
└── index.ts
```

---

# 20. Payroll Frontend Example

```text
frontend/src/features/payroll/
│
├── components/
│   ├── SalaryTable.tsx
│   ├── SalaryForm.tsx
│   ├── PayrollRunTable.tsx
│   ├── PayrollSummary.tsx
│   ├── PayslipViewer.tsx
│   ├── PayrollFilters.tsx
│   └── PayrollStatusBadge.tsx
│
├── hooks/
│   ├── useSalary.ts
│   ├── usePayrollRuns.ts
│   └── usePayslips.ts
│
├── services/
│   └── payrollApi.ts
│
├── schemas/
│   └── payrollSchema.ts
│
├── types/
│   └── payroll.ts
│
└── index.ts
```

---

# 21. Shared Frontend Components

Shared components should only contain genuinely reusable UI.

```text
frontend/src/components/
│
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Modal.tsx
│   ├── Badge.tsx
│   ├── Card.tsx
│   ├── Dropdown.tsx
│   ├── DatePicker.tsx
│   ├── DataTable.tsx
│   └── Pagination.tsx
│
├── layout/
│   ├── DashboardLayout.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── Footer.tsx
│
├── navigation/
│   ├── SidebarNavigation.tsx
│   ├── Breadcrumbs.tsx
│   └── PermissionGate.tsx
│
├── tables/
│   ├── Table.tsx
│   ├── TableToolbar.tsx
│   └── TablePagination.tsx
│
├── forms/
│   ├── FormField.tsx
│   ├── FormError.tsx
│   └── FormActions.tsx
│
├── modals/
│   ├── ConfirmationModal.tsx
│   └── DeleteModal.tsx
│
└── charts/
    ├── BarChart.tsx
    ├── LineChart.tsx
    ├── PieChart.tsx
    └── AreaChart.tsx
```

---

# 22. Frontend Services

```text
frontend/src/services/
│
├── api.ts
├── auth.ts
├── upload.ts
└── notifications.ts
```

`api.ts` should provide the common API client.

Feature-specific API calls should remain inside the feature:

```text
features/employees/services/employeeApi.ts
features/leave/services/leaveApi.ts
features/payroll/services/payrollApi.ts
```

Do not put every API call into one giant `api.ts`.

---

# 23. Frontend State Management

```text
frontend/src/stores/
│
├── authStore.ts
├── uiStore.ts
└── notificationStore.ts
```

Use server-state tools such as TanStack Query for API/server data.

Do not put all API data into a global state store unnecessarily.

---

# 24. Frontend Types

```text
frontend/src/types/
│
├── api.ts
├── auth.ts
├── user.ts
├── pagination.ts
└── common.ts
```

Feature-specific types should remain inside the feature:

```text
features/employees/types/employee.ts
features/payroll/types/payroll.ts
features/leave/types/leave.ts
```

---

# 25. Database Structure

The project uses PostgreSQL for production.

Django migrations remain the primary mechanism for application schema changes.

The `database/` directory contains database documentation, seed data, operational SQL, diagrams, and supporting database assets.

```text
database/
│
├── migrations/
│   ├── README.md
│   └── .gitkeep
│
├── seeds/
│   ├── roles.sql
│   ├── permissions.sql
│   ├── departments.sql
│   ├── holidays.sql
│   └── demo_data.sql
│
├── views/
│   ├── employee_summary.sql
│   ├── attendance_summary.sql
│   └── payroll_summary.sql
│
├── functions/
│   └── .gitkeep
│
├── indexes/
│   └── README.md
│
├── backups/
│   └── .gitkeep
│
├── schema/
│   ├── schema.sql
│   ├── erd.md
│   └── data-dictionary.md
│
└── README.md
```

---

# 26. Database Domains

The logical database domains are:

```text
Organization
│
├── Companies
├── Departments
├── Locations
└── Designations

Identity
│
├── Users
├── Roles
├── Permissions
└── User Roles

Employees
│
├── Employees
├── Employee Contacts
├── Emergency Contacts
├── Employment History
└── Reporting Relationships

Attendance
│
├── Attendance Records
├── Attendance Policies
├── Shifts
├── Shift Assignments
└── Holidays

Leave
│
├── Leave Types
├── Leave Policies
├── Leave Balances
├── Leave Requests
└── Leave Approvals

Payroll
│
├── Salary Structures
├── Salary Components
├── Payroll Runs
├── Payroll Records
├── Bonuses
├── Deductions
└── Payslips

Performance
│
├── Goals
├── Performance Cycles
├── Performance Reviews
├── Ratings
└── Feedback

Recruitment
│
├── Job Postings
├── Candidates
├── Applications
├── Interviews
└── Offers

HR Operations
│
├── Promotions
├── Transfers
├── Meetings
├── Notes
└── Announcements

System
│
├── Notifications
├── Audit Logs
├── System Settings
└── Integrations
```

---

# 27. Documentation Structure

All documentation should live inside `docs/`.

```text
docs/
│
├── README.md
│
├── prd/
│   └── PRD.md
│
├── architecture/
│   ├── architecture.md
│   ├── system-architecture.md
│   ├── backend-architecture.md
│   ├── frontend-architecture.md
│   │
│   └── diagrams/
│       ├── system-overview.png
│       ├── database-erd.png
│       ├── employee-lifecycle.png
│       ├── leave-workflow.png
│       ├── attendance-workflow.png
│       └── payroll-workflow.png
│
├── api/
│   ├── api-overview.md
│   ├── authentication.md
│   ├── employees.md
│   ├── departments.md
│   ├── attendance.md
│   ├── leave.md
│   ├── payroll.md
│   ├── documents.md
│   ├── performance.md
│   └── reports.md
│
├── database/
│   ├── database-design.md
│   ├── entities.md
│   ├── relationships.md
│   └── data-dictionary.md
│
├── features/
│   ├── authentication.md
│   ├── employees.md
│   ├── departments.md
│   ├── attendance.md
│   ├── leave.md
│   ├── payroll.md
│   ├── documents.md
│   ├── performance.md
│   ├── recruitment.md
│   ├── notifications.md
│   └── reports.md
│
├── workflows/
│   ├── employee-lifecycle.md
│   ├── leave-approval.md
│   ├── attendance.md
│   ├── payroll.md
│   ├── promotion.md
│   ├── recruitment.md
│   └── offboarding.md
│
├── security/
│   ├── security.md
│   ├── permissions.md
│   ├── authentication.md
│   ├── audit-logging.md
│   └── data-privacy.md
│
├── deployment/
│   ├── development.md
│   ├── staging.md
│   ├── production.md
│   ├── docker.md
│   └── backup-recovery.md
│
└── development/
    ├── coding-standards.md
    ├── git-workflow.md
    ├── testing.md
    ├── contributing.md
    └── troubleshooting.md
```

---

# 28. Scripts

Operational and data-management scripts belong in `scripts/`.

```text
scripts/
│
├── seed_database.py
├── import_employees.py
├── export_employees.py
├── backup_database.py
├── restore_database.py
├── generate_demo_data.py
└── cleanup.py
```

Scripts must not contain core business logic.

Business logic belongs inside backend feature services.

---

# 29. Tests

Tests are separated into unit/integration tests inside features and end-to-end tests at the root.

```text
tests/
│
├── integration/
│   ├── test_employee_workflow.py
│   ├── test_leave_workflow.py
│   ├── test_attendance_workflow.py
│   └── test_payroll_workflow.py
│
└── e2e/
    ├── auth/
    ├── employees/
    ├── attendance/
    ├── leave/
    ├── payroll/
    └── reports/
```

Feature-specific backend tests should remain inside each backend feature:

```text
backend/employees/tests/
backend/attendance/tests/
backend/leave_management/tests/
backend/payroll/tests/
```

---

# 30. Final Complete Repository Tree

```text
HRMS/
│
├── backend/
│   │
│   ├── config/
│   │   ├── settings/
│   │   │   ├── base.py
│   │   │   ├── development.py
│   │   │   ├── production.py
│   │   │   └── testing.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   ├── wsgi.py
│   │   └── celery.py
│   │
│   ├── core/
│   │   ├── exceptions/
│   │   ├── middleware/
│   │   ├── permissions/
│   │   ├── pagination/
│   │   ├── validators/
│   │   ├── constants/
│   │   └── utilities/
│   │
│   ├── authentication/
│   ├── employees/
│   ├── departments/
│   ├── attendance/
│   ├── leave_management/
│   ├── payroll/
│   ├── shifts/
│   ├── holidays/
│   ├── documents/
│   ├── promotions/
│   ├── performance/
│   ├── recruitment/
│   ├── meetings/
│   ├── notifications/
│   ├── reports/
│   ├── audit/
│   │
│   ├── integrations/
│   │   ├── email/
│   │   ├── sms/
│   │   ├── storage/
│   │   ├── banking/
│   │   ├── accounting/
│   │   ├── biometric/
│   │   └── calendar/
│   │
│   ├── tasks/
│   │   ├── payroll_tasks.py
│   │   ├── notification_tasks.py
│   │   ├── report_tasks.py
│   │   ├── maintenance_tasks.py
│   │   └── analytics_tasks.py
│   │
│   ├── manage.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   │
│   ├── public/
│   │   ├── images/
│   │   ├── icons/
│   │   └── assets/
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── employees/
│   │   │   ├── attendance/
│   │   │   ├── leave/
│   │   │   ├── payroll/
│   │   │   ├── departments/
│   │   │   ├── performance/
│   │   │   ├── recruitment/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   │
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   ├── layout/
│   │   │   ├── navigation/
│   │   │   ├── tables/
│   │   │   ├── forms/
│   │   │   ├── modals/
│   │   │   └── charts/
│   │   │
│   │   ├── features/
│   │   │   ├── authentication/
│   │   │   ├── employees/
│   │   │   ├── departments/
│   │   │   ├── attendance/
│   │   │   ├── leave/
│   │   │   ├── payroll/
│   │   │   ├── shifts/
│   │   │   ├── holidays/
│   │   │   ├── documents/
│   │   │   ├── promotions/
│   │   │   ├── performance/
│   │   │   ├── recruitment/
│   │   │   ├── meetings/
│   │   │   ├── notifications/
│   │   │   ├── reports/
│   │   │   ├── audit/
│   │   │   └── settings/
│   │   │
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── stores/
│   │   ├── types/
│   │   ├── lib/
│   │   └── utils/
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── .env.example
│
├── database/
│   ├── migrations/
│   ├── seeds/
│   ├── views/
│   ├── functions/
│   ├── indexes/
│   ├── backups/
│   └── schema/
│       ├── schema.sql
│       ├── erd.md
│       └── data-dictionary.md
│
├── docs/
│   ├── README.md
│   ├── prd/
│   ├── architecture/
│   ├── api/
│   ├── database/
│   ├── features/
│   ├── workflows/
│   ├── security/
│   ├── deployment/
│   └── development/
│
├── scripts/
│   ├── seed_database.py
│   ├── import_employees.py
│   ├── export_employees.py
│   ├── backup_database.py
│   ├── restore_database.py
│   └── generate_demo_data.py
│
├── tests/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
└── LICENSE
```

---

# 31. Architecture Rules for Gemini

Gemini must follow these rules while generating or modifying the project.

## Rule 1 — Feature First

Organize code by business feature.

Do not create giant global directories such as:

```text
controllers/
models/
services/
```

containing every feature.

Prefer:

```text
employees/
attendance/
leave_management/
payroll/
```

Each feature owns its implementation.

---

## Rule 2 — Backend Business Logic

Do not put complex business logic in `views.py`.

Use:

```text
View
 ↓
Serializer
 ↓
Service
 ↓
Model
```

---

## Rule 3 — Frontend Business Logic

Do not put feature-specific components into the global components directory.

Bad:

```text
components/
└── EmployeeTable.tsx
```

Good:

```text
features/
└── employees/
    └── components/
        └── EmployeeTable.tsx
```

Global components should only contain reusable UI.

---

## Rule 4 — Shared Code

Backend shared code:

```text
backend/core/
```

Frontend shared UI:

```text
frontend/src/components/
```

Frontend shared utilities:

```text
frontend/src/utils/
```

---

## Rule 5 — Database

Do not manually modify production database tables.

Use Django migrations for application schema changes.

Database SQL files should be used for:

- Seed data
- Reports/views
- Database documentation
- Operational scripts
- Special database functions when required

---

## Rule 6 — Security

Never:

- Hard-code passwords
- Hard-code API keys
- Expose employee documents publicly
- Return payroll data to unauthorized users
- Bypass RBAC
- Trust frontend permissions
- Store passwords in plain text

The backend must always enforce permissions.

---

## Rule 7 — API

Use:

```text
/api/v1/
```

for all APIs.

Example:

```text
/api/v1/auth/login
/api/v1/employees
/api/v1/employees/{id}
/api/v1/attendance
/api/v1/leaves
/api/v1/leaves/{id}/approve
/api/v1/payroll/runs
/api/v1/payroll/payslips
/api/v1/reports
```

---

## Rule 8 — Tests

Every major feature must have tests.

Minimum:

```text
employees/tests/
attendance/tests/
leave_management/tests/
payroll/tests/
```

Critical workflows must also have integration/E2E tests.

---

## Rule 9 — Documentation

Every major feature should have:

```text
docs/features/feature-name.md
```

Every major workflow should have:

```text
docs/workflows/workflow-name.md
```

Every API domain should have:

```text
docs/api/domain-name.md
```

---

## Rule 10 — Do Not Overengineer

Use a modular monolith initially.

Do not introduce microservices unless there is a real scaling, deployment, or organizational requirement.

The goal is:

```text
Simple
+
Modular
+
Secure
+
Testable
+
Scalable
```

not unnecessary complexity.

---

# 32. Feature Ownership Model

Each feature should conceptually own the following:

```text
FEATURE
│
├── Backend
│   ├── Database Model
│   ├── API
│   ├── Business Logic
│   ├── Validation
│   ├── Permissions
│   └── Tests
│
├── Frontend
│   ├── Pages
│   ├── Components
│   ├── Hooks
│   ├── API Client
│   ├── Types
│   └── Validation
│
└── Documentation
    ├── Requirements
    ├── Workflow
    └── API
```

For example:

```text
EMPLOYEES
│
├── backend/employees/
├── frontend/src/features/employees/
└── docs/features/employees.md
```

For Leave:

```text
LEAVE
│
├── backend/leave_management/
├── frontend/src/features/leave/
└── docs/features/leave.md
```

For Payroll:

```text
PAYROLL
│
├── backend/payroll/
├── frontend/src/features/payroll/
└── docs/features/payroll.md
```

This makes the project easy for both humans and AI coding agents to navigate.
