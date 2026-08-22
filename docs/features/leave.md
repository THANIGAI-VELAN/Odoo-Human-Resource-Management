# Leave Management Feature spec

The Leave Management module is built to handle vacation and sick time-off requests, balances, and allocations for all employees in the organization.

## Entities and Database Schema

### `LeaveRequest`
Stores each submitted leave application, including requested dates, duration, reason, status, and half-day schedule options.
- `id` (int, Primary Key): Unique request identifier.
- `employee_id` (str): Foreign key to the employee.
- `leave_type` (str): The leave category (e.g. `Annual Leave`, `Sick Leave`, `Casual Leave`, `Unpaid Leave`).
- `start_date` (str): Start date formatted as `YYYY-MM-DD`.
- `end_date` (str): End date formatted as `YYYY-MM-DD`.
- `days_count` (float): Chargeable duration in days (supports fractional half days).
- `reason` (str): Description of the leave reason.
- `is_half_day` (bool): `True` if it is a half-day request.
- `half_day_position` (str, optional): `Morning` or `Afternoon` shift.
- `status` (str): Current status (`Pending`, `Approved`, `Rejected`, `Cancelled`).
- `applied_time` (str): Timestamp of submission.

### `LeaveBalance`
Tracks active PTO accounts for each employee.
- `annual_leave` (float): Available annual leave days.
- `sick_leave` (float): Available sick leave days.
- `casual_leave` (float): Available casual leave days.
- `annual_leave_taken` (float): Confirmed annual leave days taken.
- `sick_leave_taken` (float): Confirmed sick leave days taken.
- `casual_leave_taken` (float): Confirmed casual leave days taken.
- `unpaid_leave_taken` (float): Confirmed unpaid leave days taken.

### `Holiday`
Holds public organization holidays which are excluded from chargeable leave duration.
- `date` (str, Primary Key): Calendar date of the holiday as `YYYY-MM-DD`.
- `name` (str): Description of the holiday (e.g. `Labor Day`).

---

## Business Rules

1. **Chargeable Leave Duration Calculation:**
   - Weekends (Saturdays and Sundays) and gazetted organization holidays (recorded in the `Holiday` table) are excluded from the leave duration count.
   - For example, a request from Friday to Monday containing a weekend and a Monday holiday will only count as 1.0 day (Friday).
   - If `is_half_day` is checked, the request is computed as exactly `0.5` days.

2. **Overlap Detection:**
   - An employee cannot apply for overlapping leaves. The backend verifies that no request in `Pending` or `Approved` status exists for the same employee covering any day of the proposed range.

3. **Status Transitions:**
   - Valid status transitions:
     - `Pending` -> `Approved`
     - `Pending` -> `Rejected`
     - `Pending` -> `Cancelled`
     - `Approved` -> `Cancelled`
   - Balance deductions occur only on transitioning to `Approved`.
   - Restoring balances occurs only if an `Approved` request is transitioning to `Cancelled`.
