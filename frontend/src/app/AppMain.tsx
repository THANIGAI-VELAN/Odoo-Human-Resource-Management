'use client';

import React, { useState, useEffect } from 'react';
import { DayflowSideNav, DayflowTab } from '@/components/layout/DayflowSideNav';
import { DayflowTopNav } from '@/components/layout/DayflowTopNav';
import { NexusSideNav, NexusTab } from '@/components/layout/NexusSideNav';
import { NexusTopNav } from '@/components/layout/NexusTopNav';

import { DayflowDashboard } from '@/components/dashboard/DayflowDashboard';
import { EmployeeDirectory } from '@/components/employees/EmployeeDirectory';
import { EmployeeProfileSalary } from '@/components/employees/EmployeeProfileSalary';
import { AttendanceView } from '@/components/attendance/AttendanceView';
import { TimeOffView } from '@/components/leave/TimeOffView';

import { NexusDashboard } from '@/components/workspace/NexusDashboard';
import { NexusProjects } from '@/components/workspace/NexusProjects';
import { SignInView } from '@/components/auth/SignInView';

import { NewEmployeeModal } from '@/components/modals/NewEmployeeModal';
import { NewLeaveModal } from '@/components/modals/NewLeaveModal';
import { NewTaskModal } from '@/components/modals/NewTaskModal';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';
import { MessageModal } from '@/components/modals/MessageModal';
import { ToastContainer, ToastMessage } from '@/components/common/Toast';

import {
  INITIAL_EMPLOYEES,
  INITIAL_DAYFLOW_ACTIVITIES,
  INITIAL_NEXUS_ACTIVITIES,
  INITIAL_PROJECTS,
  INITIAL_LEAVE_REQUESTS,
} from '@/data/mockData';
import { Employee, ProjectItem, ActivityItem, LeaveRequest } from '@/types/hrms';

export default function App() {
  // App Mode: 'dayflow' | 'nexus' | 'auth'
  const [appMode, setAppMode] = useState<'dayflow' | 'nexus' | 'auth'>('dayflow');
  const [dayflowTab, setDayflowTab] = useState<DayflowTab>('directory');
  const [nexusTab, setNexusTab] = useState<NexusTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
  const handleSwitchUser = async (userKey: string) => {
    const email = userKey === 'admin' ? 'sarah.jenkins@odoo.internal' : 'arjun.desai@odoo.internal';
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', 'password123');

      const res = await fetch('http://localhost:8000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('auth_token', data.access_token);
        localStorage.setItem('auth_email', email);
        localStorage.setItem('auth_role', data.role);
        localStorage.setItem('auth_employee_id', data.employee_id);
      }
    } catch (err) {
      console.error(err);
    }

    if (userKey === 'admin') {
      setCurrentUser({
        name: 'Sarah Jenkins',
        role: 'HR Director (Admin)',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSczSVfxDdBfTHgoprUThz6wpjH1wjUV3-vDp2Ap9TdCeXCqoNtPzwCfJ3wj1bJ7xQbFSRcITH4nmeu6e-9YSneuY7JAkGbF2RDKgNjzBtoCyHfuUb_J1JHOeadz5IKzwWWhSWsIW63nlbQOA0CmlUANB2GqS1TxxWOkcDQPIT4xmAnUZjZWzqb2VeFWAgm0YJhx_TqwLzPGOX5pf4LSG3BMpwG_AV-kHaH8c_3ob24IAddmWDbQHJ',
      });
      setIsAdminMode(true);
      setDayflowTab('directory');
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
      setDayflowTab('profile_salary');
      addToast('info', 'Switched Persona', 'Switched to Arjun Desai (Senior Software Engineer).');
    }

    fetchLeaves();
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

  const getAuthHeaders = (extra: Record<string, string> = {}) => {
    const headers: Record<string, string> = { ...extra };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  };

  const fetchLeaves = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/leaves/requests', {
        headers: getAuthHeaders()
      });
      if (res.ok) {
        const data = await res.json();
        setLeaveRequests(data);
      }
    } catch (err) {
      console.error('Error fetching leaves:', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_email');
    localStorage.removeItem('auth_role');
    localStorage.removeItem('auth_employee_id');
    setAppMode('auth');
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setAppMode('auth');
    } else {
      fetchLeaves();
    }
  }, []);

  // Leave Management
  const handleApplyLeave = async (reqData: any) => {
    try {
      const employeeId = currentUser.name === 'Arjun Desai' ? 'OIARDE20220001' : 'OISAJE20210001';
      const payload = {
        employee_id: employeeId,
        leave_type: reqData.leaveType,
        start_date: reqData.startDate,
        end_date: reqData.endDate,
        reason: reqData.reason || 'Personal leave'
      };

      const res = await fetch('http://localhost:8000/api/v1/leaves/apply', {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        fetchLeaves();
        addToast('info', 'Leave Application Submitted', 'Your request has been routed to reporting manager.');
      } else {
        const err = await res.json();
        const msg = err.detail || 'Could not submit leave request.';
        addToast('error', 'Application Failed', msg);
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Network Error', 'Could not connect to the server.');
    }
  };

  const handleApproveLeave = async (id: string | number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/leaves/${id}/approve`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchLeaves();
        addToast('success', 'Leave Approved', 'The leave request status is now marked Approved.');
      } else {
        addToast('error', 'Action Failed', 'Could not approve leave request.');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Network Error', 'Could not connect to the server.');
    }
  };

  const handleRejectLeave = async (id: string | number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/leaves/${id}/reject`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        fetchLeaves();
        addToast('warning', 'Leave Rejected', 'The leave request has been declined.');
      } else {
        addToast('error', 'Action Failed', 'Could not reject leave request.');
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Network Error', 'Could not connect to the server.');
    }
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
          onSignInSuccess={(role, userKey, loginId, email) => {
            const isAdmin = role === 'super_admin' || role === 'hr_admin';
            setIsAdminMode(isAdmin);

            if (loginId) {
              const matchedEmp = employees.find(e => e.id === loginId || e.email === email);
              if (matchedEmp) {
                setCurrentUser({
                  name: matchedEmp.name,
                  role: isAdmin ? 'HR Director (Admin)' : matchedEmp.role,
                  avatar: matchedEmp.avatar,
                });
                setSelectedEmployee(matchedEmp);
              }
            } else {
              handleSwitchUser(userKey);
            }

            // Admin → Employee Directory, Employee → My Profile
            setDayflowTab(isAdmin ? 'directory' : 'profile_salary');
            setAppMode('dayflow');
            addToast('success', 'Welcome Back', 'Successfully signed in.');
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
            onLogout={handleLogout}
            currentUser={currentUser}
            currentTab={dayflowTab}
            onTabChange={setDayflowTab}
            isAdmin={isAdminMode}
            onSwitchUser={handleSwitchUser}
            onOpenNotifications={() => setIsNewLeaveOpen(true)}
            notificationCount={leaveRequests.filter((l) => l.status === 'Pending').length}
          />

          {/* Main Content Area — no sidebar */}
          <main className="flex-1 pt-14 px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto">
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
              <TimeOffView />
            )}
          </main>
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
            onSignOut={handleLogout}
          />

          {/* Nexus Main Area */}
          <div className="flex-1 pl-[260px] flex flex-col min-h-screen">
            <NexusTopNav
              currentTab={nexusTab}
              onTabChange={(tab) => setNexusTab(tab)}
              onNewTaskClick={() => setIsNewTaskOpen(true)}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSignOut={handleLogout}
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
