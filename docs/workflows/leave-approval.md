# Leave Approval & Cancellation Workflow

This document describes the state machine, permissions, and side-effects of the leave request lifecycle.

```mermaid
stateDiagram-sync
    [*] --> Pending : Employee Applies
    Pending --> Approved : Manager Approves
    Pending --> Rejected : Manager Rejects
    Pending --> Cancelled : Employee/Manager Cancels
    Approved --> Cancelled : Employee Cancels (Restores Balance)
```

## State Side-Effects

### 1. Application (`Pending`)
- Overlaps are checked.
- Chargeable days are calculated (excluding weekends & holidays).
- The employee's requested balance is verified, but **no deduction is made yet**.

### 2. Approval (`Approved`)
- Can only be triggered by `Admin` or `Manager` users.
- The corresponding `LeaveBalance` is decremented.
- The corresponding `Employee` status is set to `On Leave` if the current date falls within the start/end dates.

### 3. Rejection (`Rejected`)
- Can only be triggered by `Admin` or `Manager` users.
- No balance or employee status updates occur.

### 4. Cancellation (`Cancelled`)
- Can be triggered by the employee who applied, or any admin/manager.
- Allowed from `Pending` or `Approved` states.
- **Critical Action:** If the cancelled request was already `Approved`, the taken balance is restored to the employee's available PTO balance, and their status is reverted to `Active` if they were marked `On Leave`.
