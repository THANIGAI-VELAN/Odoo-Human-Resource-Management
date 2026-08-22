'use client';

import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/hrms';

interface AttendanceViewProps {
  employees: Employee[];
  onMarkAttendance?: (empId: string, status: 'present' | 'absent' | 'late' | 'leave') => void;
}

interface AttendanceRecord {
  id: number;
  employee_id: string;
  employee_name: string;
  employee_avatar: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  work_hours: string | null;
  extra_hours: string | null;
  status: string;
  source: string;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ employees }) => {
  // Determine role from local storage
  const [isAdmin, setIsAdmin] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [loading, setLoading] = useState(true);

  // Admin View State
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [adminRecords, setAdminRecords] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState('');

  // Employee View State
  const [selectedMonth, setSelectedMonth] = useState(() => {
    return new Date().getMonth() + 1; // 1-12
  });
  const [selectedYear, setSelectedYear] = useState(() => {
    return new Date().getFullYear();
  });
  const [employeeRecords, setEmployeeRecords] = useState<AttendanceRecord[]>([]);
  const [empSummary, setEmpSummary] = useState({
    days_present: 0,
    days_absent: 0,
    days_late: 0,
    days_leave: 0,
    days_holiday: 0,
    total_working_days: 0,
  });

  // Check-in status for currently logged-in user
  const [myStatus, setMyStatus] = useState({
    checked_in: false,
    checked_out: false,
    check_in_time: null as string | null,
    check_out_time: null as string | null,
  });

  const months = [
    { value: 1, label: 'Jan' },
    { value: 2, label: 'Feb' },
    { value: 3, label: 'Mar' },
    { value: 4, label: 'Apr' },
    { value: 5, label: 'May' },
    { value: 6, label: 'Jun' },
    { value: 7, label: 'Jul' },
    { value: 8, label: 'Aug' },
    { value: 9, label: 'Sep' },
    { value: 10, label: 'Oct' },
    { value: 11, label: 'Nov' },
    { value: 12, label: 'Dec' },
  ];

  const years = [2025, 2026];

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchUserRole = () => {
    const role = localStorage.getItem('auth_role');
    const empId = localStorage.getItem('auth_employee_id');
    setIsAdmin(role === 'Admin' || role === 'HR Super Admin');
    setEmployeeId(empId || '');
  };

  const fetchMyStatus = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/attendance/my-status', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setMyStatus({
          checked_in: data.checked_in,
          checked_out: data.checked_out,
          check_in_time: data.check_in_time,
          check_out_time: data.check_out_time,
        });
      }
    } catch (err) {
      console.error('Error fetching check-in status:', err);
    }
  };

  const fetchAdminDaily = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/attendance/daily?date=${selectedDate}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setAdminRecords(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeMonthly = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/attendance/monthly/${employeeId}?month=${selectedMonth}&year=${selectedYear}`,
        {
          headers: getAuthHeaders(),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setEmployeeRecords(data.records || []);
        setEmpSummary({
          days_present: data.days_present,
          days_absent: data.days_absent,
          days_late: data.days_late,
          days_leave: data.days_leave,
          days_holiday: data.days_holiday,
          total_working_days: data.total_working_days,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, []);

  useEffect(() => {
    if (employeeId) {
      fetchMyStatus();
    }
  }, [employeeId]);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminDaily();
    } else if (employeeId) {
      fetchEmployeeMonthly();
    }
  }, [isAdmin, employeeId, selectedDate, selectedMonth, selectedYear]);

  const handleCheckIn = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/attendance/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ employee_id: employeeId }),
      });
      if (res.ok) {
        alert('Checked in successfully!');
        fetchMyStatus();
        if (!isAdmin) fetchEmployeeMonthly();
        else fetchAdminDaily();
      } else {
        const err = await res.json();
        alert(err.detail || 'Failed to check in.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/attendance/check-out', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ employee_id: employeeId }),
      });
      if (res.ok) {
        alert('Checked out successfully!');
        fetchMyStatus();
        if (!isAdmin) fetchEmployeeMonthly();
        else fetchAdminDaily();
      } else {
        const err = await res.json();
        alert(err.detail || 'Failed to check out.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDay = (dateStr: string) => {
    try {
      const dt = new Date(dateStr);
      return dt.toLocaleDateString('en-US', { weekday: 'long' });
    } catch {
      return '';
    }
  };

  const navigateDate = (days: number) => {
    const dt = new Date(selectedDate);
    dt.setDate(dt.getDate() + days);
    setSelectedDate(dt.toISOString().split('T')[0]);
  };

  const filteredAdminRecords = adminRecords.filter(
    (rec) =>
      rec.employee_name?.toLowerCase().includes(search.toLowerCase()) ||
      rec.employee_id?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Header and Check In controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 border border-[#E5E7EB] rounded-xl shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-[#191b22] tracking-tight">Attendance Manager</h1>
          <p className="text-xs text-[#737784] mt-1 font-mono">
            Biometric Synchronized • Current Mode: {isAdmin ? 'Admin View (All Employees)' : 'Employee View'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!myStatus.checked_in ? (
            <button
              onClick={handleCheckIn}
              className="px-4 py-2.5 bg-[#003c90] hover:bg-[#0f52ba] text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow transition-all active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>Punch Check-In</span>
            </button>
          ) : !myStatus.checked_out ? (
            <button
              onClick={handleCheckOut}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow transition-all active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>Punch Check-Out</span>
            </button>
          ) : (
            <span className="px-4 py-2 bg-gray-100 text-gray-500 border rounded-lg text-xs font-bold font-mono">
              Shift Ended ({myStatus.check_in_time} - {myStatus.check_out_time})
            </span>
          )}

          {/* Toggle View for Admins */}
          {localStorage.getItem('auth_role')?.includes('Admin') && (
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="px-3 py-2 border rounded-md text-xs font-bold hover:bg-gray-50 transition-colors"
            >
              Switch to {isAdmin ? 'My Attendance' : 'Team Attendance'}
            </button>
          )}
        </div>
      </div>

      {/* ADMIN / DAILY ATTENDANCE VIEW */}
      {isAdmin ? (
        <div className="space-y-6">
          {/* Top Date Navigation & Search */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-[#E5E7EB] rounded-xl shadow-2xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateDate(-1)}
                className="w-9 h-9 border rounded-lg flex items-center justify-center hover:bg-gray-50 text-[#191b22]"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs font-semibold text-[#191b22] outline-none"
                />
                <span className="text-xs font-bold text-[#737784] font-mono">
                  {formatDay(selectedDate)}
                </span>
              </div>

              <button
                onClick={() => navigateDate(1)}
                className="w-9 h-9 border rounded-lg flex items-center justify-center hover:bg-gray-50 text-[#191b22]"
              >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737784] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Employee..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5E7EB] rounded text-xs text-[#191b22] outline-none"
              />
            </div>
          </div>

          {/* Records Table */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f3f3fc] text-[#434653] font-bold uppercase tracking-wider border-b border-[#E5E7EB]">
                  <tr>
                    <th className="p-3.5">Emp</th>
                    <th className="p-3.5">Check In</th>
                    <th className="p-3.5">Check Out</th>
                    <th className="p-3.5">Work Hours</th>
                    <th className="p-3.5">Extra hours</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] font-medium text-[#191b22]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#737784]">
                        Loading daily attendance logs...
                      </td>
                    </tr>
                  ) : filteredAdminRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#737784]">
                        No records logged for {selectedDate}.
                      </td>
                    </tr>
                  ) : (
                    filteredAdminRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={rec.employee_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${rec.employee_name}`}
                            alt={rec.employee_name}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                          <div>
                            <p className="font-bold text-[#191b22]">{rec.employee_name}</p>
                            <p className="text-[10px] text-gray-500 font-mono">{rec.employee_id}</p>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono">{rec.check_in || '--:--'}</td>
                        <td className="p-3.5 font-mono">{rec.check_out || '--:--'}</td>
                        <td className="p-3.5 font-mono">{rec.work_hours || '--:--'}</td>
                        <td className="p-3.5 font-mono text-[#16a34a]">{rec.extra_hours || '00:00'}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              rec.status === 'Present'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : rec.status === 'Late'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* EMPLOYEE / MONTHLY ATTENDANCE VIEW */
        <div className="space-y-6">
          {/* Monthly navigation and counters */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center bg-white p-4 border border-[#E5E7EB] rounded-xl shadow-2xs">
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-2.5 py-1.5 border rounded text-xs font-semibold outline-none"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="px-2.5 py-1.5 border rounded text-xs font-semibold outline-none"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Counters */}
            <div className="lg:col-span-3 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-[10px] uppercase tracking-wider text-[#737784] font-semibold">Days Present</p>
                <p className="text-lg font-bold text-green-600 mt-0.5">{empSummary.days_present}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-[10px] uppercase tracking-wider text-[#737784] font-semibold">Leaves Count</p>
                <p className="text-lg font-bold text-[#003c90] mt-0.5">{empSummary.days_leave}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-[10px] uppercase tracking-wider text-[#737784] font-semibold">Working Days</p>
                <p className="text-lg font-bold text-gray-700 mt-0.5">{empSummary.total_working_days}</p>
              </div>
            </div>
          </div>

          {/* Personal log records */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f3f3fc] text-[#434653] font-bold uppercase tracking-wider border-b border-[#E5E7EB]">
                  <tr>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Check In</th>
                    <th className="p-3.5">Check Out</th>
                    <th className="p-3.5">Work Hours</th>
                    <th className="p-3.5">Extra hours</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] font-medium text-[#191b22]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#737784]">
                        Loading your attendance logs...
                      </td>
                    </tr>
                  ) : employeeRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#737784]">
                        No records logged for this month.
                      </td>
                    </tr>
                  ) : (
                    employeeRecords.map((rec, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3.5 font-mono">{rec.date}</td>
                        <td className="p-3.5 font-mono">{rec.check_in || '--:--'}</td>
                        <td className="p-3.5 font-mono">{rec.check_out || '--:--'}</td>
                        <td className="p-3.5 font-mono">{rec.work_hours || '--:--'}</td>
                        <td className="p-3.5 font-mono text-[#16a34a]">{rec.extra_hours || '00:00'}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              rec.status === 'Present'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : rec.status === 'Late'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : rec.status === 'On Leave'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
