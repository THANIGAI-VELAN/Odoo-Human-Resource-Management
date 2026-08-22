'use client';

import React, { useState, useEffect } from 'react';

interface TimeOffViewProps {
  onRefreshTrigger?: () => void;
}

interface LeaveRequest {
  id: number;
  employee_id: string;
  employee_name: string;
  employee_avatar: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string;
  status: string;
  applied_time: string;
}

interface LeaveBalance {
  annual_leave: number;
  sick_leave: number;
  casual_leave: number;
  annual_leave_taken: number;
  sick_leave_taken: number;
  casual_leave_taken: number;
}

export const TimeOffView: React.FC<TimeOffViewProps> = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  
  const [activeSubTab, setActiveSubTab] = useState<'time_off' | 'allocation'>('time_off');
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [balance, setBalance] = useState<LeaveBalance>({
    annual_leave: 18,
    sick_leave: 12,
    casual_leave: 10,
    annual_leave_taken: 0,
    sick_leave_taken: 0,
    casual_leave_taken: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Request Form Fields
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [attachmentName, setAttachmentName] = useState('');

  // Indian Public Holidays (Seeded list)
  const publicHolidays = [
    { date: 'Jan 14', name: 'Makar Sankranti' },
    { date: 'Jan 26', name: 'Republic Day' },
    { date: 'Mar 14', name: 'Holi' },
    { date: 'May 01', name: 'May Day' },
    { date: 'Aug 15', name: 'Independence Day' },
    { date: 'Oct 02', name: 'Gandhi Jayanti' },
    { date: 'Nov 09', name: 'Diwali' },
    { date: 'Dec 25', name: 'Christmas Day' },
  ];

  const getAuthHeaders = (): Record<string, string> => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchUserContext = () => {
    const role = localStorage.getItem('auth_role');
    const empId = localStorage.getItem('auth_employee_id');
    const email = localStorage.getItem('auth_email') || '';
    
    setIsAdmin(role === 'Admin' || role === 'HR Super Admin');
    setEmployeeId(empId || '');
    
    // Resolve email prefix for name representation
    if (email) {
      const prefix = email.split('@')[0];
      const capitalized = prefix.split('.').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
      setEmployeeName(capitalized);
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/leaves/requests', {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBalance = async () => {
    if (!employeeId) return;
    try {
      const res = await fetch(`http://localhost:8000/api/v1/leaves/balances/${employeeId}`, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setBalance(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUserContext();
  }, []);

  useEffect(() => {
    fetchRequests();
    if (employeeId) {
      fetchBalance();
    }
  }, [employeeId]);

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/leaves/${id}/approve`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        alert('Leave request approved.');
        fetchRequests();
      } else {
        const err = await res.json();
        alert(err.detail || 'Action failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/leaves/${id}/reject`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        alert('Leave request rejected.');
        fetchRequests();
      } else {
        const err = await res.json();
        alert(err.detail || 'Action failed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateAllocation = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;

    let count = 0;
    const cur = new Date(start);
    while (cur <= end) {
      const day = cur.getDay();
      if (day !== 0 && day !== 6) {
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return count;
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        employee_id: employeeId,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason: reason,
        is_half_day: false,
      };

      const res = await fetch('http://localhost:8000/api/v1/leaves/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Leave request applied successfully!');
        setIsModalOpen(false);
        setStartDate('');
        setEndDate('');
        setReason('');
        setAttachmentName('');
        fetchRequests();
        fetchBalance();
      } else {
        const err = await res.json();
        alert(err.detail || 'Failed to submit request.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  // Render employee yearly calendar grids (January to December)
  const renderYearlyCalendar = () => {
    const monthsGrid = [];
    const year = 2026;

    // Build leave mapping for rendering
    const leaveMap: Record<string, string> = {};
    requests.forEach((req) => {
      if (req.employee_id === employeeId) {
        let cur = new Date(req.start_date);
        const end = new Date(req.end_date);
        while (cur <= end) {
          const dateStr = cur.toISOString().split('T')[0];
          leaveMap[dateStr] = req.status;
          cur.setDate(cur.getDate() + 1);
        }
      }
    });

    for (let m = 0; m < 12; m++) {
      const date = new Date(year, m, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'long' });
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      const firstDayIndex = new Date(year, m, 1).getDay();

      const daysArray = [];
      // Empty slots before first day
      for (let i = 0; i < firstDayIndex; i++) {
        daysArray.push(<div key={`empty-${i}`} className="w-6 h-6"></div>);
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const currentDateStr = `${year}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const dayOfWeek = new Date(year, m, d).getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        let statusClass = 'bg-[#F9FAFB] hover:bg-gray-150 border-[#E5E7EB] text-gray-700';
        let statusTitle = `${d} ${monthName}`;

        if (leaveMap[currentDateStr]) {
          const status = leaveMap[currentDateStr];
          if (status === 'Approved') {
            statusClass = 'bg-[#737784] text-white border-transparent';
            statusTitle += ' (Leave Approved)';
          } else if (status === 'Pending') {
            statusClass = 'bg-amber-100 text-amber-800 border-amber-300 border-dashed animate-pulse';
            statusTitle += ' (Leave Pending)';
          } else if (status === 'Rejected') {
            statusClass = 'bg-red-500 text-white border-transparent';
            statusTitle += ' (Leave Rejected)';
          }
        } else if (isWeekend) {
          statusClass = 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed';
          statusTitle += ' (Weekend)';
        }

        daysArray.push(
          <div
            key={`day-${d}`}
            title={statusTitle}
            className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold border transition-colors cursor-pointer select-none ${statusClass}`}
          >
            {d}
          </div>
        );
      }

      monthsGrid.push(
        <div key={m} className="p-4 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
          <h4 className="font-bold text-[#191b22] text-xs uppercase tracking-wider mb-2 border-b pb-1">
            {monthName}
          </h4>
          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[10px] text-gray-500 mb-1">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {daysArray}
          </div>
        </div>
      );
    }

    return <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{monthsGrid}</div>;
  };

  const filteredRequests = requests.filter((req) =>
    req.employee_name.toLowerCase().includes(search.toLowerCase()) ||
    req.leave_type.toLowerCase().includes(search.toLowerCase()) ||
    req.employee_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 border border-[#E5E7EB] rounded-xl shadow-2xs">
        <div>
          <h1 className="text-2xl font-bold text-[#191b22] tracking-tight">Time Off Portal</h1>
          <p className="text-xs text-[#737784] mt-1 font-mono">
            Annual & Sick Leaves tracking and balance roster
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-[#003c90] hover:bg-[#0f52ba] text-white text-xs font-bold rounded-lg flex items-center gap-2 shadow transition-all active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Request Time Off</span>
          </button>

          {localStorage.getItem('auth_role')?.includes('Admin') && (
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className="px-3 py-2 border rounded-md text-xs font-bold hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Switch to {isAdmin ? 'My Time Off' : 'Team Roster'}
            </button>
          )}
        </div>
      </div>

      {/* Sub tabs navigation */}
      {isAdmin && (
        <div className="flex border-b border-[#E5E7EB] font-bold text-sm gap-6">
          <button
            onClick={() => setActiveSubTab('time_off')}
            className={`pb-3 whitespace-nowrap ${
              activeSubTab === 'time_off' ? 'text-[#003c90] border-b-2 border-[#003c90]' : 'text-[#737784] hover:text-[#191b22]'
            }`}
          >
            Time Off Requests
          </button>
          <button
            onClick={() => setActiveSubTab('allocation')}
            className={`pb-3 whitespace-nowrap ${
              activeSubTab === 'allocation' ? 'text-[#003c90] border-b-2 border-[#003c90]' : 'text-[#737784] hover:text-[#191b22]'
            }`}
          >
            Allocation
          </button>
        </div>
      )}

      {/* ADMIN TIME OFF REQUESTS TABLE VIEW */}
      {isAdmin && activeSubTab === 'time_off' ? (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center bg-white p-4 border border-[#E5E7EB] rounded-xl shadow-2xs">
            <div className="relative w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737784] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search requests..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5E7EB] rounded text-xs text-[#191b22] outline-none"
              />
            </div>
            <span className="text-xs font-mono text-[#737784]">Total requests: {filteredRequests.length}</span>
          </div>

          {/* Table */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f3f3fc] text-[#434653] font-bold uppercase tracking-wider border-b border-[#E5E7EB]">
                  <tr>
                    <th className="p-3.5">Name</th>
                    <th className="p-3.5">Start Date</th>
                    <th className="p-3.5">End Date</th>
                    <th className="p-3.5">Time Off Type</th>
                    <th className="p-3.5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB] font-medium text-[#191b22]">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[#737784]">
                        Loading pending leave requests...
                      </td>
                    </tr>
                  ) : filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[#737784]">
                        No leave requests logged.
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3.5 flex items-center gap-3">
                          <img
                            src={req.employee_avatar}
                            alt={req.employee_name}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                          <div>
                            <p className="font-bold text-[#191b22]">{req.employee_name}</p>
                            <p className="text-[10px] text-gray-500 font-mono">{req.employee_id}</p>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono">{req.start_date}</td>
                        <td className="p-3.5 font-mono">{req.end_date}</td>
                        <td className="p-3.5 font-semibold text-[#003c90]">{req.leave_type}</td>
                        <td className="p-3.5 text-right space-x-1.5">
                          {req.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => handleApprove(req.id)}
                                className="px-2.5 py-1 bg-[#22C55E] hover:bg-[#16a34a] text-white text-[10px] font-bold rounded shadow-2xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(req.id)}
                                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded shadow-2xs"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                                req.status === 'Approved'
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                            >
                              {req.status}
                            </span>
                          )}
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
        /* EMPLOYEE / PERSONAL TIME OFF CALENDAR VIEW */
        <div className="space-y-6">
          {/* Leave balances */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Paid Time Off</h3>
              <p className="text-2xl font-bold text-[#191b22] mt-1">
                {balance.annual_leave} <span className="text-xs font-semibold text-gray-500">Days Available</span>
              </p>
            </div>
            <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sick Time Off</h3>
              <p className="text-2xl font-bold text-[#191b22] mt-1">
                {balance.sick_leave} <span className="text-xs font-semibold text-gray-500">Days Available</span>
              </p>
            </div>
            <div className="p-5 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs col-span-2 md:col-span-1">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Casual Leaves Taken</h3>
              <p className="text-2xl font-bold text-[#003c90] mt-1">
                {balance.casual_leave_taken} <span className="text-xs font-semibold text-gray-500">Days Logged</span>
              </p>
            </div>
          </div>

          {/* Calendar Grid Container */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left part: Calendar grid */}
            <div className="lg:col-span-9 space-y-4">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Yearly Leaves Calendar</h3>
              {renderYearlyCalendar()}
            </div>

            {/* Right part: Legend & Public holidays */}
            <div className="lg:col-span-3 space-y-6">
              {/* Legend */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-3">
                <h4 className="font-bold text-[#191b22] text-xs uppercase tracking-wider mb-2 border-b pb-1">Legend</h4>
                <div className="flex items-center gap-3 text-xs text-[#434653]">
                  <div className="w-5 h-5 rounded bg-[#737784] border"></div>
                  <span>Validated (Approved)</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#434653]">
                  <div className="w-5 h-5 rounded bg-amber-100 border border-amber-300 border-dashed animate-pulse"></div>
                  <span>To Approve (Pending)</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#434653]">
                  <div className="w-5 h-5 rounded bg-red-500 border"></div>
                  <span>Refused (Rejected)</span>
                </div>
              </div>

              {/* Public Holidays schedule list */}
              <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs space-y-4">
                <h4 className="font-bold text-[#191b22] text-xs uppercase tracking-wider border-b pb-1">
                  Public Holidays Schedule
                </h4>
                <div className="divide-y text-xs text-[#434653] max-h-80 overflow-y-auto pr-1">
                  {publicHolidays.map((holiday, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2">
                      <span className="font-semibold text-gray-700">{holiday.date}</span>
                      <span className="font-bold text-[#191b22]">{holiday.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW TIME OFF REQUEST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-[#f3f3fc] border-b border-[#E5E7EB] flex justify-between items-center">
              <h3 className="font-bold text-[#003c90] text-sm uppercase tracking-wider">New Time Off Request</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-[#191b22]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-4 text-xs font-semibold text-[#434653]">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Employee</label>
                <input
                  type="text"
                  disabled
                  value={employeeName || 'Logged In Employee'}
                  className="w-full px-3 py-2 bg-gray-100 border border-[#E5E7EB] rounded text-gray-600 font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Time Off Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded text-[#191b22] outline-none"
                >
                  <option value="Annual Leave">Paid Time Off</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#E5E7EB] rounded text-[#191b22] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-[#E5E7EB] rounded text-[#191b22] outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-[#f3f3fc] border border-[#E5E7EB] rounded">
                <span className="text-gray-600">Calculated Allocation</span>
                <span className="font-bold text-[#003c90] font-mono text-sm">
                  {calculateAllocation()} Days
                </span>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">Reason</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason for time off..."
                  className="w-full px-3 py-2 bg-white border border-[#E5E7EB] rounded text-[#191b22] outline-none"
                />
              </div>

              {leaveType === 'Sick Leave' && (
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gray-500 mb-1">
                    Attachment (Required for Sick Leave Certificate)
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-2 bg-white border border-[#E5E7EB] rounded text-gray-700 hover:bg-gray-50 cursor-pointer shadow-2xs border-dashed text-center flex-grow flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-base">cloud_upload</span>
                      <span>{attachmentName || 'Choose Certificate PDF/Image'}</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 text-gray-700 font-bold"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#003c90] hover:bg-[#0f52ba] text-white rounded-md font-bold shadow"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
