'use client';

import React, { useState } from 'react';
import { Employee } from '@/types/hrms';

interface AttendanceViewProps {
  employees: Employee[];
  onMarkAttendance: (empId: string, status: 'present' | 'absent' | 'late' | 'leave') => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ employees, onMarkAttendance }) => {
  const [selectedDate, setSelectedDate] = useState('2023-10-24');
  const [search, setSearch] = useState('');

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#191b22] tracking-tight">Attendance Logs & Time Tracking</h1>
          <p className="text-sm text-[#434653] mt-1">Real-time daily shift punches, punch-in timestamps, and biometric records.</p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 bg-white border border-[#E5E7EB] rounded-md text-xs font-mono font-bold text-[#191b22] shadow-2xs"
          >
          </input>
          <button
            onClick={() => alert('Attendance report exported to CSV / Excel.')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#003c90] text-white rounded-md text-xs font-semibold hover:bg-[#0f52ba] shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Stats summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl">
          <p className="text-xs font-semibold text-[#737784]">Present Today</p>
          <p className="text-2xl font-bold text-[#22C55E] mt-1">
            {employees.filter((e) => e.status === 'present').length}
          </p>
        </div>
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl">
          <p className="text-xs font-semibold text-[#737784]">Late Arrivals</p>
          <p className="text-2xl font-bold text-[#F59E0B] mt-1">
            {employees.filter((e) => e.status === 'late').length}
          </p>
        </div>
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl">
          <p className="text-xs font-semibold text-[#737784]">On Approved Leave</p>
          <p className="text-2xl font-bold text-[#3B82F6] mt-1">
            {employees.filter((e) => e.status === 'leave').length}
          </p>
        </div>
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-xl">
          <p className="text-xs font-semibold text-[#737784]">Unplanned Absences</p>
          <p className="text-2xl font-bold text-[#EF4444] mt-1">
            {employees.filter((e) => e.status === 'absent').length}
          </p>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E5E7EB] flex justify-between items-center bg-[#F9FAFB]">
          <div className="relative w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737784] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by employee name..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E5E7EB] rounded text-xs text-[#191b22]"
            />
          </div>
          <span className="text-xs font-mono text-[#737784]">Total Records: {filtered.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#f3f3fc] text-[#434653] font-bold uppercase tracking-wider border-b border-[#E5E7EB]">
              <tr>
                <th className="p-3.5">Employee</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Punch In</th>
                <th className="p-3.5">Punch Out</th>
                <th className="p-3.5">Location</th>
                <th className="p-3.5 text-right">Quick Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="p-3.5 flex items-center gap-3">
                    <img
                      src={emp.avatar}
                      alt={emp.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB]"
                    />
                    <div>
                      <p className="font-bold text-[#191b22]">{emp.name}</p>
                      <p className="text-[11px] font-mono text-[#737784]">{emp.employeeCode}</p>
                    </div>
                  </td>

                  <td className="p-3.5 font-medium text-[#434653]">{emp.department}</td>

                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold uppercase text-[10px] ${
                        emp.status === 'present'
                          ? 'bg-[#22C55E]/15 text-[#16a34a]'
                          : emp.status === 'late'
                          ? 'bg-[#F59E0B]/15 text-[#d97706]'
                          : emp.status === 'leave'
                          ? 'bg-[#3B82F6]/15 text-[#2563eb]'
                          : 'bg-[#EF4444]/15 text-[#dc2626]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {emp.status}
                    </span>
                  </td>

                  <td className="p-3.5 font-mono text-[#191b22]">{emp.checkInTime || '--:--'}</td>
                  <td className="p-3.5 font-mono text-[#737784]">
                    {emp.status === 'present' || emp.status === 'late' ? '06:00 PM (Exp)' : '--:--'}
                  </td>

                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-[#f3f3fc] border border-[#E5E7EB] font-mono text-[11px]">
                      {emp.locationType}
                    </span>
                  </td>

                  <td className="p-3.5 text-right space-x-1">
                    <button
                      onClick={() => onMarkAttendance(emp.id, 'present')}
                      title="Mark Present"
                      className="p-1 hover:bg-[#22C55E]/20 text-[#22C55E] rounded font-bold"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => onMarkAttendance(emp.id, 'late')}
                      title="Mark Late"
                      className="p-1 hover:bg-[#F59E0B]/20 text-[#F59E0B] rounded font-bold"
                    >
                      ⏱
                    </button>
                    <button
                      onClick={() => onMarkAttendance(emp.id, 'absent')}
                      title="Mark Absent"
                      className="p-1 hover:bg-[#EF4444]/20 text-[#EF4444] rounded font-bold"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
