# GEMINI.md — HRMS AI Coding Agent Instructions

## 1. Role

You are the primary AI coding agent for this HRMS repository.

You must work within the repository's established **feature-first modular architecture**. The repository is structured so that backend code, frontend code, database assets, documentation, scripts, and tests have clear ownership.

Your priorities are:

1. Correctness
2. Security
3. Stability
4. Maintainability
5. Architectural consistency
6. Testability
7. Development speed

Do not optimize for speed by sacrificing the first six priorities.

---

# 2. Source-of-Truth Architecture

The repository follows this high-level structure:

```text
HRMS/
├── backend/
├── frontend/
├── database/
├── docs/
├── scripts/
├── tests/
├── .env.example
├── .gitignore
├── docker-compose.yml
├── README.md
└── LICENSE
```

The architecture is **feature-first**:

- Backend business logic belongs to its business feature.
- Frontend business logic belongs to its feature.
- Database assets belong in `database/`.
- Documentation belongs in `docs/`.
- Shared backend functionality belongs in `backend/core/`.
- Shared frontend UI belongs in `frontend/src/components/`.
- Shared frontend utilities belong in `frontend/src/utils/`.
- Business logic must not be scattered across unrelated global folders.

Do not redesign this architecture unless explicitly instructed.

---

# 3. Backend Architecture

The backend is a modular feature-first Django application.

Core structure:

```text
backend/
├── config/
├── core/
├── authentication/
├── employees/
├── departments/
├── attendance/
├── leave_management/
├── payroll/
├── shifts/
├── holidays/
├── documents/
├── promotions/
├── performance/
├── recruitment/
├── meetings/
├── notifications/
├── reports/
├── audit/
├── integrations/
├── tasks/
├── manage.py
├── requirements.txt
├── Dockerfile
└── .env.example
```

A backend feature should generally follow:

```text
feature_name/
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

Not every feature requires every file. Create files only when the feature actually needs them.

### Backend file responsibilities

| File | Responsibility |
|---|---|
| `models.py` | Database models and relationships |
| `serializers.py` | API input/output transformation |
| `views.py` | HTTP/API endpoints |
| `urls.py` | Feature routes |
| `services.py` | Business logic and workflows |
| `validators.py` | Feature-specific validation |
| `permissions.py` | Authorization |
| `filters.py` | Filtering, search, sorting |
| `tasks.py` | Background jobs |
| `calculations.py` | Complex domain calculations |
| `tests/` | Unit and integration tests |

---

# 4. Backend Business Logic Rule

Do not place complex business logic directly inside API views.

Preferred flow:

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

For example, leave approval should conceptually follow:

```text
POST /api/v1/leaves/{id}/approve
        ↓
Leave Approval View
        ↓
Leave Approval Service
        ↓
Permission validation
        ↓
Request validation
        ↓
Update leave request
        ↓
Update leave balance
        ↓
Update related attendance if required
        ↓
Create audit record
        ↓
Send notification
```

Do not duplicate business rules between the frontend and backend.

The backend is the source of truth for business rules and authorization.

---

# 5. Frontend Architecture

The frontend uses Next.js with a feature-first structure.

```text
frontend/
├── public/
└── src/
    ├── app/
    ├── components/
    ├── features/
    ├── services/
    ├── hooks/
    ├── stores/
    ├── types/
    ├── lib/
    └── utils/
```

Major business features belong under:

```text
frontend/src/features/
```

A feature should generally follow:

```text
frontend/src/features/feature_name/
├── components/
├── hooks/
├── services/
├── schemas/
├── types/
└── index.ts
```

Example:

```text
frontend/src/features/employees/
├── components/
│   ├── EmployeeTable.tsx
│   ├── EmployeeForm.tsx
│   ├── EmployeeCard.tsx
│   ├── EmployeeFilters.tsx
│   ├── EmployeeProfile.tsx
│   └── EmployeeStatusBadge.tsx
├── hooks/
├── services/
│   └── employeeApi.ts
├── schemas/
├── types/
└── index.ts
```

### Frontend rule

Do NOT put feature-specific components into the global components directory.

Bad:

```text
frontend/src/components/EmployeeTable.tsx
```

Good:

```text
frontend/src/features/employees/components/EmployeeTable.tsx
```

Global components are only for genuinely reusable UI.

---

# 6. Shared Frontend Code

Use:

```text
frontend/src/components/
```

for genuinely reusable UI such as:

```text
components/
├── ui/
├── layout/
├── navigation/
├── tables/
├── forms/
├── modals/
└── charts/
```

Examples:

```text
Button
Input
Modal
Badge
Card
DataTable
Pagination
Sidebar
Header
Breadcrumbs
ConfirmationModal
Charts
```

Do not put employee-, payroll-, attendance-, or leave-specific components there.

---

# 7. Frontend API Services

The common API client belongs in:

```text
frontend/src/services/api.ts
```

Shared services may include:

```text
frontend/src/services/
├── api.ts
├── auth.ts
├── upload.ts
└── notifications.ts
```

Feature-specific API calls must remain inside their feature:

```text
features/employees/services/employeeApi.ts
features/leave/services/leaveApi.ts
features/payroll/services/payrollApi.ts
```

Do not turn `api.ts` into one giant file containing every API endpoint.

---

# 8. State Management

Use:

```text
frontend/src/stores/
```

only for genuinely global client state.

Examples:

```text
authStore.ts
uiStore.ts
notificationStore.ts
```

Use server-state tools such as TanStack Query for API/server data where appropriate.

Do not put every API response into a global store.

---

# 9. Database Rules

Production database:

```text
PostgreSQL
```

Django migrations are the primary mechanism for application schema changes.

The `database/` directory contains supporting database assets:

```text
database/
├── migrations/
├── seeds/
├── views/
├── functions/
├── indexes/
├── backups/
├── schema/
└── README.md
```

Database documentation/schema assets include:

```text
database/schema/
├── schema.sql
├── erd.md
└── data-dictionary.md
```

### Critical database rule

Do not manually modify production database tables.

For Django application schema changes:

1. Modify the Django model.
2. Generate a migration.
3. Review the migration.
4. Run the migration in the appropriate environment.
5. Test it.
6. Commit the migration.
7. Push it.

Never use destructive database operations casually.

Do not execute:

```text
DROP DATABASE
DROP TABLE
TRUNCATE
destructive production migrations
```

without explicit authorization.

---

# 10. Database Ownership

Logical domains include:

```text
Organization
Identity
Employees
Attendance
Leave
Payroll
Performance
Recruitment
HR Operations
System
```

Keep domain-specific database behavior associated with the corresponding backend feature.

For example:

```text
backend/employees/
backend/attendance/
backend/payroll/
backend/leave_management/
```

Do not create a separate giant global business-logic layer.

---

# 11. Payroll Is High Sensitivity

Payroll must remain isolated.

```text
backend/payroll/
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

Payroll calculations must live in the backend.

Do not duplicate payroll calculation logic in React/Next.js.

Payroll data must only be returned to authorized users.

---

# 12. Security Rules

Security is mandatory.

Never:

- hard-code passwords
- hard-code API keys
- hard-code tokens
- commit private keys
- expose database credentials
- store passwords in plaintext
- bypass RBAC
- trust frontend permissions
- expose sensitive employee documents publicly
- return payroll data to unauthorized users

Use environment variables for secrets.

Never commit:

```text
.env
API keys
access tokens
JWT secrets
database passwords
service-account credentials
private keys
```

Use `.env.example` for documenting required variables without real secrets.

The backend must always enforce authorization even if the frontend hides an action.

---

# 13. Authentication and Authorization

Authentication belongs in:

```text
backend/authentication/
```

It handles:

- Login
- Logout
- Password reset
- Password change
- Session management
- User activation/deactivation
- Role assignment
- Authentication auditing
- MFA-ready architecture

Permissions must be enforced server-side.

Never rely on frontend checks as a security boundary.

---

# 14. API Rules

All APIs use:

```text
/api/v1/
```

Examples:

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

Follow existing API response, validation, authentication, and error-handling conventions.

Do not introduce breaking API changes without explicit authorization.

---

# 15. Feature Ownership Model

Each major feature conceptually owns:

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

Example:

```text
EMPLOYEES
├── backend/employees/
├── frontend/src/features/employees/
└── docs/features/employees.md
```

Leave:

```text
LEAVE
├── backend/leave_management/
├── frontend/src/features/leave/
└── docs/features/leave.md
```

Payroll:

```text
PAYROLL
├── backend/payroll/
├── frontend/src/features/payroll/
└── docs/features/payroll.md
```

Maintain this ownership model whenever implementing new features.

---

# 16. Documentation Rules

All project documentation belongs in:

```text
docs/
```

Main documentation areas:

```text
docs/
├── prd/
├── architecture/
├── api/
├── database/
├── features/
├── workflows/
├── security/
├── deployment/
└── development/
```

When a major feature is added or changed, update relevant documentation.

Examples:

```text
docs/features/feature-name.md
docs/workflows/workflow-name.md
docs/api/domain-name.md
```

Do not create random documentation files at the repository root.

---

# 17. Scripts

Operational and data-management scripts belong in:

```text
scripts/
```

Examples:

```text
seed_database.py
import_employees.py
export_employees.py
backup_database.py
restore_database.py
generate_demo_data.py
```

Scripts must not contain core business logic.

Business logic belongs inside backend feature services.

---

# 18. Testing Structure

Feature-specific tests belong inside their backend feature:

```text
backend/employees/tests/
backend/attendance/tests/
backend/leave_management/tests/
backend/payroll/tests/
```

Root-level integration and E2E tests belong in:

```text
tests/
├── integration/
└── e2e/
```

Critical workflows should have integration/E2E coverage.

Examples:

```text
Employee workflow
Leave workflow
Attendance workflow
Payroll workflow
Authentication workflow
```

---

# 19. Development Workflow

For every coding task, follow this sequence:

```text
UNDERSTAND
    ↓
INSPECT
    ↓
PLAN
    ↓
IMPLEMENT
    ↓
TEST
    ↓
REVIEW
    ↓
COMMIT
    ↓
PUSH
    ↓
REPORT
```

Do not skip the inspection stage.

Before modifying code, inspect:

```bash
git status
git branch --show-current
```

Then inspect the relevant existing implementation.

Understand dependencies and existing patterns before changing anything.

---

# 20. Minimal-Change Principle

Make the smallest safe change that solves the requested problem.

Do not:

- rewrite working modules unnecessarily
- refactor unrelated code
- rename unrelated files
- change architecture without justification
- add unnecessary dependencies
- delete functionality without permission
- change configuration blindly

If you notice an unrelated problem, report it separately instead of silently expanding the task.

---

# 21. Dependency Rules

Before adding a dependency:

1. Check whether the repository already has an equivalent.
2. Check whether the feature can reasonably be implemented without it.
3. Consider security and maintenance impact.
4. Use the project's existing package manager.

After adding a dependency:

```text
Install
↓
Update lockfile
↓
Test
↓
Review
↓
Commit
↓
Push
```

Do not add libraries merely because they are convenient.

---

# 22. Error Handling

Never silently swallow errors.

Bad:

```python
try:
    do_something()
except Exception:
    pass
```

Errors should be:

- meaningful
- properly handled
- safely logged
- useful for debugging
- safe for users

Do not expose internal stack traces, secrets, or sensitive implementation details to clients.

Follow the repository's existing exception and logging conventions.

---

# 23. Code Quality

Write code that is:

- readable
- modular
- maintainable
- testable
- predictable
- consistent with the existing codebase

Avoid:

- duplicated logic
- giant functions
- giant components
- magic values
- unnecessary abstractions
- premature optimization
- dead code
- unused imports
- unnecessary comments
- unexplained hacks

Comments should explain **why**, not obvious **what**.

---

# 24. Do Not Overengineer

The project should remain a modular monolith initially.

Do not introduce microservices unless there is an actual:

- scaling requirement
- deployment requirement
- organizational requirement
- strong technical reason

Prefer:

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

over unnecessary complexity.

---

# 25. Git Rules — MANDATORY

Git synchronization is a core requirement.

After **every completed logical modification**:

1. Check the changed files.
2. Review the diff.
3. Run relevant tests/checks.
4. Commit the modification.
5. Push the commit to the remote repository.

Required pattern:

```bash
git status
git diff

# Run relevant tests/checks

git add <relevant-files>
git commit -m "type: short description"
git push
```

Do not leave completed work only on the local machine.

Do not accumulate unrelated completed modifications before committing and pushing.

The remote repository should remain synchronized with the latest working implementation.

---

# 26. Commit Rules

Use Conventional Commits.

Format:

```text
<type>: <description>
```

Allowed types:

```text
feat
fix
refactor
docs
test
chore
style
perf
build
ci
```

Examples:

```text
feat: add employee attendance module
fix: resolve leave approval validation
refactor: simplify payroll service
docs: update employee API documentation
test: add payroll calculation tests
chore: update backend dependencies
```

Keep commits focused and logically scoped.

Do not create meaningless commits such as:

```text
update
changes
fix stuff
work
final
```

---

# 27. Never Push Known-Broken Code

Before pushing, run appropriate checks.

Backend examples:

```bash
python manage.py check
python manage.py test
```

Frontend examples:

```bash
npm run lint
npm run build
npm test
```

Use the actual scripts defined by the repository when they differ.

For database changes, test migrations and affected queries.

For frontend changes, verify:

- affected page
- affected component
- API integration
- loading state
- error state
- empty state
- console errors
- build

For backend changes, verify:

- application startup
- affected endpoints
- validation
- permissions
- database behavior
- error handling

If your modification breaks the project, fix it before pushing.

If a failure existed before your change, do not falsely attribute it to your work. Report it clearly.

---

# 28. Git Diff Review

Before every commit:

```bash
git diff
git status
```

Look specifically for:

- accidental file changes
- debug statements
- temporary files
- secrets
- generated files that should not be committed
- unrelated formatting changes
- unintended deletions
- incorrect imports
- test artifacts

Do not blindly use:

```bash
git add .
```

when the repository contains unrelated changes.

Prefer staging the files belonging to the current task.

---

# 29. Git Branch Safety

Before working:

```bash
git branch --show-current
git status
```

Never accidentally work on the wrong branch.

Never force-push unless explicitly authorized.

Do not use:

```bash
git push --force
```

as a normal conflict-resolution strategy.

If remote changes exist:

```bash
git fetch
git status
```

Understand the remote changes before merging/rebasing.

Never blindly overwrite another developer's work.

---

# 30. Git Push Failure

If `git push` fails:

Do not claim that the code was pushed.

Investigate the failure.

Possible causes include:

```text
authentication failure
remote changes
merge conflict
branch protection
network failure
pre-commit hook
CI failure
```

Resolve the problem where possible.

If the changes are committed locally but cannot be pushed, explicitly report:

```text
Changes committed locally.
Push failed.
Reason: <actual reason>
```

Never lie about repository state.

---

# 31. No Fake Completion

Never claim:

```text
Tests passed
Build passed
Commit created
Changes pushed
Feature completed
```

unless you actually performed the corresponding action.

Do not say "done" merely because code was written.

A task is complete only after the implementation is validated and the required Git workflow has been completed.

---

# 32. Secrets and Git Safety

Before committing, verify that no sensitive information is included.

Check:

```bash
git status
git diff
```

Never commit:

```text
.env
credentials
private keys
API tokens
passwords
database secrets
```

If a secret has already been committed or pushed:

1. Stop treating it as safe.
2. Remove it from the code.
3. Determine whether it reached the remote.
4. Recommend rotating/revoking the credential.
5. Do not simply delete the current file and assume the secret is gone from Git history.

---

# 33. Database Migration Git Workflow

When changing Django models:

```text
Modify model
    ↓
Create migration
    ↓
Review migration
    ↓
Run checks/tests
    ↓
Commit model + migration
    ↓
Push
```

Do not commit a model change while forgetting its required migration.

---

# 34. Feature Development Workflow

For a new feature:

### Step 1 — Inspect

Find the existing implementation patterns for:

- related backend features
- related frontend features
- database models
- API routes
- permissions
- tests
- documentation

### Step 2 — Plan

Identify:

```text
Backend files to create/change
Frontend files to create/change
Database changes
API changes
Tests
Documentation
```

### Step 3 — Implement

Implement using existing architecture.

### Step 4 — Test

Test:

```text
Happy path
Validation failures
Permission failures
Important edge cases
Integration behavior
```

### Step 5 — Review

Review:

```bash
git diff
git status
```

### Step 6 — Commit

Create a focused Conventional Commit.

### Step 7 — Push

Push immediately after successful commit.

### Step 8 — Report

Summarize what changed and the verification performed.

---

# 35. Bug-Fix Workflow

For a bug:

```text
Reproduce
    ↓
Identify root cause
    ↓
Implement smallest safe fix
    ↓
Add regression test when practical
    ↓
Run tests
    ↓
Review diff
    ↓
Commit
    ↓
Push
```

Do not hide symptoms with unnecessary workarounds when the root cause can be fixed properly.

---

# 36. Documentation Synchronization

When implementation changes behavior, update documentation when appropriate.

Examples:

- New API → update API docs.
- New feature → update feature docs.
- New workflow → update workflow docs.
- Database schema change → update database documentation when needed.
- New environment variable → update `.env.example` and relevant documentation.
- Architecture change → update architecture documentation.

Documentation should describe the actual implementation, not an imagined future implementation.

---

# 37. Feature-Specific Architecture

The following business features are already defined by the repository structure:

```text
authentication
employees
departments
attendance
leave_management
payroll
shifts
holidays
documents
promotions
performance
recruitment
meetings
notifications
reports
audit
```

Use the existing feature name and location.

Do not create duplicate feature directories such as:

```text
leave/
leave_management/
```

when the existing architecture already defines `leave_management/`.

---

# 38. Integrations

External integrations belong under:

```text
backend/integrations/
```

Current integration categories include:

```text
email/
sms/
storage/
banking/
accounting/
biometric/
calendar/
```

Do not mix third-party integration implementation throughout unrelated business features.

Feature services may call integration services through clean interfaces.

---

# 39. Background Jobs

Background work belongs in Celery/task infrastructure according to the existing architecture.

Relevant locations include:

```text
backend/tasks/
backend/notifications/tasks.py
backend/payroll/tasks.py
```

Use background jobs for heavy or asynchronous work such as:

- payroll processing
- notifications
- report generation
- maintenance
- analytics

Do not block normal HTTP requests with unnecessarily expensive operations.

---

# 40. Audit Logging

Important HRMS operations must be auditable.

Examples:

```text
Employee changes
Salary changes
Payroll finalization
Leave approval
Permission changes
User creation
Document access
Employee termination
```

Audit records should be append-only through normal application interfaces.

Do not bypass audit logging for sensitive workflows.

---

# 41. Sensitive Employee Documents

Documents may contain highly sensitive information.

The document system supports:

```text
Upload
Download
Delete/archive
Categories
Expiry
Validation
Secure access
Versioning
```

Sensitive employee documents must never become publicly accessible.

Always verify authorization before allowing document access.

---

# 42. Reports

Reports belong in:

```text
backend/reports/
```

Report generators may include:

```text
employee_report.py
attendance_report.py
leave_report.py
payroll_report.py
performance_report.py
```

Reports may support:

- CSV
- PDF
- Dashboard summaries
- Filtering
- Date ranges
- Department filtering
- Employee filtering

Respect the same permission rules as the underlying data.

---

# 43. Frontend Routing

The Next.js application uses feature-oriented routes under:

```text
frontend/src/app/
```

Major routes include:

```text
login/
dashboard/
employees/
attendance/
leave/
payroll/
departments/
performance/
recruitment/
reports/
settings/
```

Keep route-level UI focused on composition and page behavior.

Move reusable feature implementation into:

```text
frontend/src/features/
```

---

# 44. Final Verification Checklist

Before declaring a task complete, verify:

```text
[ ] Correct branch
[ ] Working tree understood
[ ] Existing architecture inspected
[ ] Requested change implemented
[ ] No unrelated changes
[ ] No secrets exposed
[ ] Backend checks passed where relevant
[ ] Frontend checks passed where relevant
[ ] Database migrations checked where relevant
[ ] Tests passed where relevant
[ ] Git diff reviewed
[ ] Correct files staged
[ ] Conventional commit created
[ ] Commit exists locally
[ ] Push completed successfully
[ ] Final git status checked
[ ] Documentation updated where necessary
```

---

# 45. Final Response Format

After completing a coding task, report concisely:

```text
## Completed

- <implementation summary>
- <important files changed>
- <tests/checks performed>
- Commit: `<commit hash/message>`
- Push: successful

## Notes

- <important architectural/security note if applicable>
```

If something could not be completed:

```text
## Partially Completed

- <what was completed>

## Blocker

- <exact failure>
- <current repository state>
- <what remains>
```

Never hide failures.

---

# 46. Absolute Rules

These are non-negotiable:

1. Follow the existing feature-first architecture.
2. Inspect before modifying.
3. Keep business logic inside the appropriate feature.
4. Keep complex backend logic out of views.
5. Keep feature-specific frontend code out of shared components.
6. Use Django migrations for application schema changes.
7. Enforce authorization on the backend.
8. Never expose secrets.
9. Never expose sensitive employee documents publicly.
10. Never duplicate payroll calculations in the frontend.
11. Test meaningful changes.
12. Review the Git diff before committing.
13. Commit every completed logical modification.
14. Push every completed logical modification.
15. Never claim a push succeeded if it did not.
16. Never force-push without explicit authorization.
17. Never silently modify unrelated code.
18. Never destroy production data without explicit authorization.
19. Never claim tests passed unless they actually passed.
20. Never claim a task is complete when required validation or Git synchronization is still incomplete.

---

# 47. Default Agent Loop

For every coding request, automatically execute:

```text
┌─────────────────────────────┐
│ 1. Understand the request   │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ 2. Inspect repository       │
│    and existing patterns    │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ 3. Check Git status/branch  │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ 4. Plan smallest safe change│
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ 5. Implement                │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ 6. Test and validate        │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ 7. Review git diff          │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ 8. Commit                   │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ 9. Push to remote           │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ 10. Verify final Git state  │
└──────────────┬──────────────┘
               ↓
┌─────────────────────────────┐
│ 11. Report accurately       │
└─────────────────────────────┘
```

This loop is the default behavior unless the user explicitly instructs otherwise.
