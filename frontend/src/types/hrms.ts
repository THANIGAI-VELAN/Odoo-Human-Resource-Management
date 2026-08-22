export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export type UserRole = 'super_admin' | 'hr_admin' | 'manager' | 'employee' | 'finance';

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  avatar: string;
  status: AttendanceStatus;
  checkInTime?: string;
  locationType: 'HQ Office' | 'Remote' | 'Branch Office';
  grossSalary: number;
  joiningDate: string;
  designation: string;
  managerName: string;
  emergencyContact: string;
  leaveBalance: {
    casual: number;
    sick: number;
    annual: number;
  };
}

export interface ActivityItem {
  id: string;
  userName: string;
  userAvatar?: string;
  type: 'check_in' | 'check_in_late' | 'leave_request' | 'commit' | 'deploy' | 'comment';
  description: string;
  target?: string;
  commentQuote?: string;
  timestamp: string;
  badgeStatus?: AttendanceStatus;
  badgeColor?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tag: string;
  tagType: 'internal' | 'on_hold' | 'client' | 'completed';
  description: string;
  progress: number;
  teamAvatars: string[];
  dueDate: string;
  status: 'active' | 'on_hold' | 'completed' | 'archived';
  isBlocked?: boolean;
  blockedReason?: string;
}

export interface SalaryBreakdown {
  grossMonthly: number;
  basicPay: number;
  hra: number;
  standardAllowance: number;
  performanceBonus: number;
  lta: number;
  fixedAllowance: number;
  totalEarnings: number;
  providentFund: number;
  professionalTax: number;
  totalDeductions: number;
  estimatedNetPay: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  leaveType: 'Sick Leave' | 'Casual Leave' | 'Annual Leave' | 'Unpaid Leave';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedTime: string;
}
