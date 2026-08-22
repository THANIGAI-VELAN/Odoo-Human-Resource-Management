'use client';

import React, { useState } from 'react';
import { DayflowSideNav, DayflowTab } from './components/layout/DayflowSideNav';
import { DayflowTopNav } from './components/layout/DayflowTopNav';
import { NexusSideNav, NexusTab } from './components/layout/NexusSideNav';
import { NexusTopNav } from './components/layout/NexusTopNav';

import { DayflowDashboard } from './components/dashboard/DayflowDashboard';
import { EmployeeDirectory } from './components/employees/EmployeeDirectory';
import { EmployeeProfileSalary } from './components/employees/EmployeeProfileSalary';
import { AttendanceView } from './components/attendance/AttendanceView';

import { NexusDashboard } from './components/workspace/NexusDashboard';
import { NexusProjects } from './components/workspace/NexusProjects';
import { SignInView } from './components/auth/SignInView';

import { NewEmployeeModal } from './components/modals/NewEmployeeModal';
import { NewLeaveModal } from './components/modals/NewLeaveModal';
import { NewTaskModal } from './components/modals/NewTaskModal';
import { CreateProjectModal } from './components/modals/CreateProjectModal';
import { MessageModal } from './components/modals/MessageModal';
import { ToastContainer, ToastMessage } from './components/common/Toast';

import {
  INITIAL_EMPLOYEES,
  INITIAL_DAYFLOW_ACTIVITIES,
  INITIAL_NEXUS_ACTIVITIES,
  INITIAL_PROJECTS,
  INITIAL_LEAVE_REQUESTS,
} from './data/mockData';
import { Employee, ProjectItem, ActivityItem, LeaveRequest } from './types/hrms';

export default function App() {
  // App Mode: 'dayflow' | 'nexus' | 'auth'
  const [appMode, setAppMode] = useState<'dayflow' | 'nexus' | 'auth'>('dayflow');
  const [dayflowTab, setDayflowTab] = useState<DayflowTab>('dashboard');
  const [nexusTab, setNexusTab] = useState<NexusTab>('overview');

  // Core Data
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(INITIAL_EMPLOYEES[0]);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [dayflowActivities, setDayflowActivities] = useState<ActivityItem[]>(INITIAL_DAYFLOW_ACTIVITIES);
  const [nexusActivities, setNexusActivities] = useState<ActivityItem[]>(INITIAL_NEXUS_ACTIVITIES);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(INITIAL_LEAVE_REQUESTS);

  // App State & Controls
  const [isAdminMode, setIsAdminMode] = useState<boolean>(true);
  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // User Persona
  const [currentUser, setCurrentUser] = useState({
    name: 'Sarah Jenkins',
    role: 'HR Director (Admin)',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSczSVfxDdBfTHgoprUThz6wpjH1wjUV3-vDp2Ap9TdCeXCqoNtPzwCfJ3wj1bJ7xQbFSRcITH4nmeu6e-9YSneuY7JAkGbF2RDKgNjzBtoCyHfuUb_J1JHOeadz5IKzwWWhSWsIW63nlbQOA0CmlUANB2GqS1TxxWOkcDQPIT4xmAnUZjZWzqb2VeFWAgm0YJhx_TqwLzPGOX5pf4LSG3BMpwG_AV-kHaH8c_3ob24IAddmWDbQHJ',
  });

  // Modals
  const [isNewEmployeeOpen, setIsNewEmployeeOpen] = useState(false);
  const [isNewLeaveOpen, setIsNewLeaveOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [messageTargetEmployee, setMessageTargetEmployee] = useState<Employee | null>(null);

  // Helper to trigger toast
  const addToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Toggle Check-in status
  const handleToggleCheckIn = () => {
    const newStatus = !isCheckedIn;
    setIsCheckedIn(newStatus);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (newStatus) {
      addToast('success', 'Biometric Check-In Recorded', `Successfully checked in at ${now} from HQ Office.`);
      setDayflowActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          type: 'check_in',
          description: 'checked in.',
          target: 'HQ Office',
          timestamp: 'Just now',
          badgeStatus: 'present',
        },
        ...prev,
      ]);
    } else {
      addToast('info', 'Check-Out Completed', `Shift ended at ${now}. Total work duration: 8 hrs 24 mins.`);
    }
  };

  // Switch persona
  const handleSwitchUser = (userKey: string) => {
    if (userKey === 'admin') {
      setCurrentUser({
        name: 'Sarah Jenkins',
        role: 'HR Director (Admin)',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSczSVfxDdBfTHgoprUThz6wpjH1wjUV3-vDp2Ap9TdCeXCqoNtPzwCfJ3wj1bJ7xQbFSRcITH4nmeu6e-9YSneuY7JAkGbF2RDKgNjzBtoCyHfuUb_J1JHOeadz5IKzwWWhSWsIW63nlbQOA0CmlUANB2GqS1TxxWOkcDQPIT4xmAnUZjZWzqb2VeFWAgm0YJhx_TqwLzPGOX5pf4LSG3BMpwG_AV-kHaH8c_3ob24IAddmWDbQHJ',
      });
      setIsAdminMode(true);
      addToast('info', 'Switched Persona', 'Switched to HR Director (Super Admin Mode).');
    } else {
      const arjun = employees.find((e) => e.name === 'Arjun Desai') || employees[0];
      setCurrentUser({
        name: arjun.name,
        role: arjun.role,
        avatar: arjun.avatar,
      });
      setIsAdminMode(false);
      setSelectedEmployee(arjun);
      addToast('info', 'Switched Persona', 'Switched to Arjun Desai (Senior Software Engineer).');
    }
  };

  // Save Salary Structure
  const handleSaveSalary = (employeeId: string, newGross: number) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === employeeId ? { ...emp, grossSalary: newGross } : emp))
    );
    if (selectedEmployee.id === employeeId) {
      setSelectedEmployee((prev) => ({ ...prev, grossSalary: newGross }));
    }
    addToast(
      'success',
      'Salary Structure Updated',
      `New compensation plan saved and synchronized with Payroll ledger for ${selectedEmployee.name}.`
    );
  };

  // Update employee profile
  const handleUpdateEmployee = (updated: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    setSelectedEmployee(updated);
    addToast('success', 'Profile Updated', `Employee profile updated for ${updated.name}.`);
  };

  // Add Employee
  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);
    setSelectedEmployee(newEmp);
    addToast('success', 'Employee Created', `${newEmp.name} has been enrolled into Dayflow HRMS.`);
  };

  // Leave Management
  const handleApplyLeave = (reqData: Omit<LeaveRequest, 'id' | 'status' | 'appliedTime'>) => {
    const newReq: LeaveRequest = {
      ...reqData,
      id: `leave-${Date.now()}`,
      status: 'Pending',
      appliedTime: 'Just now',
    };
    setLeaveRequests((prev) => [newReq, ...prev]);
    addToast('info', 'Leave Application Submitted', 'Your request has been routed to reporting manager.');
  };

  const handleApproveLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'Approved' } : l))
    );
    addToast('success', 'Leave Approved', 'The leave request status is now marked Approved.');
  };

  const handleRejectLeave = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: 'Rejected' } : l))
    );
    addToast('warning', 'Leave Rejected', 'The leave request has been declined.');
  };

  // Mark Attendance
  const handleMarkAttendance = (empId: string, status: 'present' | 'absent' | 'late' | 'leave') => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, status } : e))
    );
    addToast('info', 'Attendance Overridden', `Status updated to ${status.toUpperCase()}.`);
  };

  // Direct Message
  const handleSendMessage = (employeeName: string, message: string) => {
    addToast('success', 'Message Dispatched', `Direct message sent to ${employeeName}.`);
  };

  // Create Project & Task
  const handleCreateProject = (project: ProjectItem) => {
    setProjects((prev) => [project, ...prev]);
    addToast('success', 'Project Initialized', `${project.title} has been launched.`);
  };

  const handleAddTask = (task: { title: string; assignee: string; priority: string; sprint: string }) => {
    setNexusActivities((prev) => [
      {
        id: `nexus-act-${Date.now()}`,
        userName: currentUser.name,
        userAvatar: currentUser.avatar,
        type: 'comment',
        description: 'created sprint task',
        target: task.title,
        commentQuote: `Assigned to ${task.assignee} • Priority: ${task.priority}`,
        timestamp: 'Just now',
      },
      ...prev,
    ]);
    addToast('success', 'Task Created', `Task "${task.title}" added to active sprint.`);
  };

  // If Auth screen is active
  if (appMode === 'auth') {
    return (
      <div className="min-h-screen bg-[#faf8ff]">
        <SignInView
          onSignInSuccess={(role, userKey) => {
            handleSwitchUser(userKey);
            setAppMode('dayflow');
            addToast('success', 'Welcome Back', `Successfully signed in as ${userKey === 'admin' ? 'HR Director' : 'Arjun Desai'}.`);
          }}
          onCancel={() => setAppMode('dayflow')}
        />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#191b22] flex flex-col font-sans">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Modals */}
      <NewEmployeeModal
        isOpen={isNewEmployeeOpen}
        onClose={() => setIsNewEmployeeOpen(false)}
        onAddEmployee={handleAddEmployee}
      />

      <NewLeaveModal
        isOpen={isNewLeaveOpen}
        onClose={() => setIsNewLeaveOpen(false)}
        leaveRequests={leaveRequests}
        onApplyLeave={handleApplyLeave}
        onApproveLeave={handleApproveLeave}
        onRejectLeave={handleRejectLeave}
        currentUserName={currentUser.name}
        currentUserAvatar={currentUser.avatar}
      />

      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      <CreateProjectModal
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreateProject={handleCreateProject}
      />

      <MessageModal
        employee={messageTargetEmployee}
        isOpen={!!messageTargetEmployee}
        onClose={() => setMessageTargetEmployee(null)}
        onSendMessage={handleSendMessage}
      />

      {/* Mode 1: Dayflow HRMS */}
      {appMode === 'dayflow' ? (
        <div className="flex flex-col min-h-screen">
          {/* Top Bar */}
          <DayflowTopNav
            isCheckedIn={isCheckedIn}
            onToggleCheckIn={handleToggleCheckIn}
            onLogout={() => setAppMode('auth')}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentUser={currentUser}
            onSwitchUser={handleSwitchUser}
            onOpenNotifications={() => setIsNewLeaveOpen(true)}
            notificationCount={leaveRequests.filter((l) => l.status === 'Pending').length}
          />

          <div className="flex flex-1 pt-14">
            {/* Side Navigation */}
            <DayflowSideNav
              currentTab={dayflowTab}
              onTabChange={(tab) => setDayflowTab(tab)}
              onSwitchToNexus={() => {
                setAppMode('nexus');
                addToast('info', 'Switched Workspace', 'Entered Project Alpha / Nexus Workspace.');
              }}
            />

            {/* Main Content Area */}
            <main className="flex-1 md:pl-64 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {dayflowTab === 'dashboard' && (
                <DayflowDashboard
                  totalEmployees={employees.length + 1240}
                  activeCount={employees.filter((e) => e.status === 'present').length + 978}
                  pendingLeavesCount={leaveRequests.filter((l) => l.status === 'Pending').length}
                  activities={dayflowActivities}
                  onReviewLeaves={() => setIsNewLeaveOpen(true)}
                  onViewDirectory={() => setDayflowTab('directory')}
                  onViewActivityLog={() => setDayflowTab('attendance')}
                />
              )}

              {dayflowTab === 'directory' && (
                <EmployeeDirectory
                  employees={employees}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSelectEmployee={(emp) => {
                    setSelectedEmployee(emp);
                    setDayflowTab('profile_salary');
                  }}
                  onOpenNewEmployeeModal={() => setIsNewEmployeeOpen(true)}
                  onMessageEmployee={(emp) => setMessageTargetEmployee(emp)}
                />
              )}

              {(dayflowTab === 'profile_salary' || dayflowTab === 'payroll') && (
                <EmployeeProfileSalary
                  employee={selectedEmployee}
                  isAdminMode={isAdminMode}
                  onToggleAdminMode={() => {
                    const next = !isAdminMode;
                    setIsAdminMode(next);
                    addToast(next ? 'warning' : 'info', next ? 'Admin Mode Activated' : 'Exited Admin Mode');
                  }}
                  onBackToDirectory={() => setDayflowTab('directory')}
                  onSaveSalary={handleSaveSalary}
                  onUpdateEmployee={handleUpdateEmployee}
                />
              )}

              {dayflowTab === 'attendance' && (
                <AttendanceView
                  employees={employees}
                  onMarkAttendance={handleMarkAttendance}
                />
              )}

              {dayflowTab === 'leave' && (
                <div className="max-w-[1440px] mx-auto space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-[#191b22] tracking-tight">Leave Management</h1>
                      <p className="text-sm text-[#434653] mt-1">Review employee PTO balances and approve pending requests.</p>
                    </div>
                    <button
                      onClick={() => setIsNewLeaveOpen(true)}
                      className="px-4 py-2 bg-[#003c90] text-white rounded-md text-xs font-bold hover:bg-[#0f52ba]"
                    >
                      + Manage / Apply Leave
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
                      <h3 className="text-sm font-bold text-[#434653]">Pending Approvals</h3>
                      <p className="text-3xl font-bold text-[#F59E0B] mt-2">
                        {leaveRequests.filter((l) => l.status === 'Pending').length}
                      </p>
                    </div>
                    <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
                      <h3 className="text-sm font-bold text-[#434653]">Approved This Month</h3>
                      <p className="text-3xl font-bold text-[#22C55E] mt-2">
                        {leaveRequests.filter((l) => l.status === 'Approved').length + 18}
                      </p>
                    </div>
                    <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
                      <h3 className="text-sm font-bold text-[#434653]">Team Utilization</h3>
                      <p className="text-3xl font-bold text-[#003c90] mt-2">92.4%</p>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 shadow-2xs">
                    <h3 className="text-base font-bold text-[#191b22] mb-4">Pending Requests Roster</h3>
                    <div className="divide-y divide-[#E5E7EB]">
                      {leaveRequests.map((req) => (
                        <div key={req.id} className="py-3.5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <img src={req.employeeAvatar} alt={req.employeeName} className="w-10 h-10 rounded-full object-cover" />
                            <div>
                              <p className="text-sm font-bold text-[#191b22]">{req.employeeName}</p>
                              <p className="text-xs text-[#737784]">{req.leaveType} • {req.startDate} to {req.endDate} ({req.daysCount} days)</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {req.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => handleApproveLeave(req.id)}
                                  className="px-3 py-1 bg-[#22C55E] text-white text-xs font-bold rounded"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleRejectLeave(req.id)}
                                  className="px-3 py-1 bg-[#EF4444] text-white text-xs font-bold rounded"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-[#22C55E] bg-[#22C55E]/10 px-2.5 py-1 rounded">{req.status}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {dayflowTab === 'settings' && (
                <div className="max-w-[1440px] mx-auto space-y-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#191b22]">System Settings & Compliance</h1>
                    <p className="text-sm text-[#434653] mt-1">Configure payroll cycles, biometric integration, and role policies.</p>
                  </div>
                  <div className="p-6 bg-white border border-[#E5E7EB] rounded-xl space-y-4 max-w-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                      <div>
                        <p className="text-sm font-bold text-[#191b22]">Payroll Auto-Computation</p>
                        <p className="text-xs text-[#737784]">Automatically calculate statutory deductions on 1st of every month</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-[#003c90] rounded" />
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                      <div>
                        <p className="text-sm font-bold text-[#191b22]">Biometric Device Sync</p>
                        <p className="text-xs text-[#737784]">Real-time punch sync with Office HQ hardware gateways</p>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 text-[#003c90] rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-[#191b22]">Audit Trail Logging</p>
                        <p className="text-xs text-[#737784]">Log all compensation formula edits and admin actions</p>
                      </div>
                      <span className="px-2.5 py-1 bg-[#22C55E]/15 text-[#16a34a] text-xs font-bold rounded">Enforced</span>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      ) : (
        /* Mode 2: Nexus Workspace (Project Alpha) */
        <div className="flex min-h-screen bg-[#fafafa]">
          {/* Nexus Side Navigation */}
          <NexusSideNav
            currentTab={nexusTab}
            onTabChange={(tab) => setNexusTab(tab)}
            onSwitchToDayflow={() => {
              setAppMode('dayflow');
              addToast('info', 'Switched Workspace', 'Entered Dayflow HRMS.');
            }}
            onSignOut={() => setAppMode('auth')}
          />

          {/* Nexus Main Area */}
          <div className="flex-1 pl-[260px] flex flex-col min-h-screen">
            <NexusTopNav
              currentTab={nexusTab}
              onTabChange={(tab) => setNexusTab(tab)}
              onNewTaskClick={() => setIsNewTaskOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSignOut={() => setAppMode('auth')}
            />

            <main className="p-6 md:p-10 flex-1 overflow-y-auto">
              {nexusTab === 'overview' && (
                <NexusDashboard
                  activities={nexusActivities}
                  onViewProjects={() => setNexusTab('projects')}
                  onNewTask={() => setIsNewTaskOpen(true)}
                />
              )}

              {nexusTab === 'projects' && (
                <NexusProjects
                  projects={projects}
                  onOpenCreateProject={() => setIsCreateProjectOpen(true)}
                  onUpdateProjectProgress={(id, progress) => {
                    setProjects((prev) =>
                      prev.map((p) => (p.id === id ? { ...p, progress } : p))
                    );
                  }}
                />
              )}

              {nexusTab === 'tasks' && (
                <div className="max-w-[1440px] mx-auto space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1b1b]">Sprint Tasks</h1>
                      <p className="text-xs sm:text-sm text-[#4b4454] mt-1 font-mono">Active engineering roadmap tickets</p>
                    </div>
                    <button
                      onClick={() => setIsNewTaskOpen(true)}
                      className="px-4 py-2 bg-[#A259FF] text-white rounded text-xs font-mono font-bold hover:opacity-90"
                    >
                      + New Task
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                    <div className="p-4 bg-white border border-[#E5E5E5] rounded-xl space-y-3">
                      <h3 className="font-bold text-[#1b1b1b] uppercase text-[11px] border-b pb-2">To Do (4)</h3>
                      <div className="p-3 bg-[#fbfbfb] rounded border border-[#E5E5E5]">
                        <p className="font-bold text-[#1b1b1b]">Task-495: Auth token refresh race condition</p>
                        <p className="text-[#7d7386] mt-1">Assignee: Sarah Chen • High</p>
                      </div>
                      <div className="p-3 bg-[#fbfbfb] rounded border border-[#E5E5E5]">
                        <p className="font-bold text-[#1b1b1b]">Task-498: Migrate Tailwind tokens to CSS variables</p>
                        <p className="text-[#7d7386] mt-1">Assignee: Arjun Desai • Medium</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-[#E5E5E5] rounded-xl space-y-3">
                      <h3 className="font-bold text-[#7a2ad6] uppercase text-[11px] border-b pb-2">In Progress (3)</h3>
                      <div className="p-3 bg-[#fbfbfb] rounded border border-[#A259FF]">
                        <p className="font-bold text-[#1b1b1b]">Task-492: Navigation Refactor & Mobile Breakpoints</p>
                        <p className="text-[#7d7386] mt-1">Assignee: Marcus Johnson • Critical</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white border border-[#E5E5E5] rounded-xl space-y-3">
                      <h3 className="font-bold text-[#22C55E] uppercase text-[11px] border-b pb-2">Done (18)</h3>
                      <div className="p-3 bg-[#fbfbfb] rounded border border-[#E5E5E5] opacity-75">
                        <p className="font-bold text-[#1b1b1b] line-through">Task-480: Production deploy pipelines hardening</p>
                        <p className="text-[#22C55E] mt-1">Verified on production</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {nexusTab === 'calendar' && (
                <div className="max-w-[1440px] mx-auto space-y-6">
                  <h1 className="text-2xl font-bold text-[#1b1b1b]">Sprint Calendar</h1>
                  <div className="p-8 bg-white border border-[#E5E5E5] rounded-xl text-center">
                    <span className="material-symbols-outlined text-4xl text-[#A259FF] mb-2">calendar_month</span>
                    <p className="text-sm font-bold text-[#1b1b1b]">Sprint 42 Review & Retro</p>
                    <p className="text-xs font-mono text-[#4b4454] mt-1">October 27, 2023 at 14:00 UTC</p>
                  </div>
                </div>
              )}

              {nexusTab === 'documents' && (
                <div className="max-w-[1440px] mx-auto space-y-6">
                  <h1 className="text-2xl font-bold text-[#1b1b1b]">Architecture & Specs</h1>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                    <div className="p-4 bg-white border border-[#E5E5E5] rounded-xl">
                      <p className="font-bold text-[#1b1b1b]">API Spec v2.4.yaml</p>
                      <p className="text-[#7d7386] mt-1">Updated 2 hours ago by Sarah Chen</p>
                    </div>
                    <div className="p-4 bg-white border border-[#E5E5E5] rounded-xl">
                      <p className="font-bold text-[#1b1b1b]">Security Audit Checklist.pdf</p>
                      <p className="text-[#7d7386] mt-1">Uploaded yesterday by Compliance</p>
                    </div>
                  </div>
                </div>
              )}

              {nexusTab === 'settings' && (
                <div className="max-w-[1440px] mx-auto space-y-6">
                  <h1 className="text-2xl font-bold text-[#1b1b1b]">Nexus Workspace Settings</h1>
                  <div className="p-6 bg-white border border-[#E5E5E5] rounded-xl space-y-4 max-w-xl font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span>Automated CI/CD Webhooks</span>
                      <span className="text-[#22C55E] font-bold">Enabled</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Design Token Auto-Sync</span>
                      <span className="text-[#22C55E] font-bold">Connected</span>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
