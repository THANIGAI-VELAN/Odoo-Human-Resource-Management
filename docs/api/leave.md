# Leave Management REST API Specifications

All endpoints are prefix by `/api/v1/leaves`.

## Authentication & Authorization
All endpoints require a valid JWT passed in the request header:
`Authorization: Bearer <jwt-token>`

- **Employee Persona:** Can only view and cancel their own requests/balances.
- **Admin & Manager Persona:** Can view all requests, balances, and approve/reject/cancel requests.

---

## Endpoints

### 1. Retrieve Leave Requests
`GET /api/v1/leaves/requests`
- **Query Parameters:**
  - `employee_id` (string, optional)
  - `status` (string, optional: `Pending`, `Approved`, `Rejected`, `Cancelled`)
  - `leave_type` (string, optional)
  - `start_date` (string, optional)
  - `end_date` (string, optional)
  - `search` (string, optional)
  - `skip` (integer, default: 0)
  - `limit` (integer, default: 100)
- **Response (200 OK):** Array of `LeaveRequestResponse`

### 2. Apply for Leave
`POST /api/v1/leaves/apply`
- **Request Body (`LeaveRequestCreate`):**
  ```json
  {
    "employee_id": "emp-1",
    "leave_type": "Annual Leave",
    "start_date": "2026-08-25",
    "end_date": "2026-08-28",
    "reason": "Family vacation",
    "is_half_day": false,
    "half_day_position": null
  }
  ```
- **Response (201 Created):** `LeaveRequestResponse`

### 3. Approve Request
`POST /api/v1/leaves/{id}/approve`
- **Response (200 OK):** `LeaveRequestResponse`

### 4. Reject Request
`POST /api/v1/leaves/{id}/reject`
- **Response (200 OK):** `LeaveRequestResponse`

### 5. Cancel Request
`POST /api/v1/leaves/{id}/cancel`
- **Response (200 OK):** `LeaveRequestResponse`

### 6. Get Employee Balance
`GET /api/v1/leaves/balances/{employee_id}`
- **Response (200 OK):**
  ```json
  {
    "employee_id": "emp-1",
    "annual_leave": 16.0,
    "sick_leave": 12.0,
    "casual_leave": 10.0,
    "annual_leave_taken": 2.0,
    "sick_leave_taken": 0.0,
    "casual_leave_taken": 0.0,
    "unpaid_leave_taken": 0.0
  }
  ```

### 7. Get Calendar Events
`GET /api/v1/leaves/calendar`
- **Response (200 OK):** Array of approved `LeaveRequestResponse` for public calendar rendering.
