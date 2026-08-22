'use client';

import React, { useState } from 'react';
import { Employee, AttendanceStatus } from '@/types/hrms';

interface EmployeeDirectoryProps {
  employees: Employee[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectEmployee: (emp: Employee) => void;
  onOpenNewEmployeeModal: () => void;
  onMessageEmployee: (emp: Employee) => void;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  employees,
  searchQuery,
  onSearchChange,
  onSelectEmployee,
  onOpenNewEmployeeModal,
  onMessageEmployee,
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const departments = ['All', 'Product Team', 'Product Development', 'Engineering', 'Design Team', 'Marketing', 'Operations', 'Quality Assurance'];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#191b22] tracking-tight">Employee Directory</h1>
          <p className="text-sm text-[#434653] mt-1">Manage and view all team members across departments.</p>
        </div>

        <div className="flex w-full sm:w-auto gap-3 items-center">
          <div className="relative flex-grow sm:flex-grow-0">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737784] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search employees..."
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-md text-sm text-[#191b22] focus:outline-none focus:ring-1 focus:ring-[#003c90] focus:border-[#003c90] transition-colors h-11"
            />
          </div>

          <button
            onClick={onOpenNewEmployeeModal}
            className="bg-[#003c90] text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-semibold hover:bg-[#0f52ba] transition-colors whitespace-nowrap h-11 shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]" data-fill="1">
              add
            </span>
            <span>NEW Employee</span>
          </button>
        </div>
      </div>

      {/* Status Legend & Quick Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white border border-[#E5E7EB] rounded-xl shadow-2xs">
        {/* Status indicator items */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <button
            onClick={() => setSelectedStatus(selectedStatus === 'present' ? 'All' : 'present')}
            className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
              selectedStatus === 'present' ? 'bg-[#22C55E]/15 text-[#16a34a]' : 'text-[#434653] hover:bg-[#F9FAFB]'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] ring-2 ring-[#22C55E]/30"></div>
            <span>Present ({employees.filter((e) => e.status === 'present').length})</span>
          </button>

          <button
            onClick={() => setSelectedStatus(selectedStatus === 'absent' ? 'All' : 'absent')}
            className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
              selectedStatus === 'absent' ? 'bg-[#EF4444]/15 text-[#dc2626]' : 'text-[#434653] hover:bg-[#F9FAFB]'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-2 ring-[#EF4444]/30"></div>
            <span>Absent ({employees.filter((e) => e.status === 'absent').length})</span>
          </button>

          <button
            onClick={() => setSelectedStatus(selectedStatus === 'late' ? 'All' : 'late')}
            className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
              selectedStatus === 'late' ? 'bg-[#F59E0B]/15 text-[#d97706]' : 'text-[#434653] hover:bg-[#F9FAFB]'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] ring-2 ring-[#F59E0B]/30"></div>
            <span>Late ({employees.filter((e) => e.status === 'late').length})</span>
          </button>

          <button
            onClick={() => setSelectedStatus(selectedStatus === 'leave' ? 'All' : 'leave')}
            className={`flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
              selectedStatus === 'leave' ? 'bg-[#3B82F6]/15 text-[#2563eb]' : 'text-[#434653] hover:bg-[#F9FAFB]'
            }`}
          >
            <span className="material-symbols-outlined text-[#3B82F6] text-[18px]">flight_takeoff</span>
            <span>On Leave ({employees.filter((e) => e.status === 'leave').length})</span>
          </button>
        </div>

        {/* Department dropdown filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#737784] font-medium">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="text-xs bg-[#F9FAFB] border border-[#E5E7EB] rounded-md px-2.5 py-1 text-[#191b22] font-semibold outline-none focus:border-[#003c90]"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredEmployees.map((emp) => {
          const isLeave = emp.status === 'leave';

          return (
            <div
              key={emp.id}
              className="bg-white border border-[#E5E7EB] rounded-xl p-6 relative group hover:border-[#003c90] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              {/* Status Badge in Top Right */}
              <div className="absolute top-4 right-4 flex items-center justify-center">
                {emp.status === 'present' && (
                  <div className="w-3.5 h-3.5 rounded-full bg-[#22C55E] ring-4 ring-[#22C55E]/20" title="Present"></div>
                )}
                {emp.status === 'late' && (
                  <div className="w-3.5 h-3.5 rounded-full bg-[#F59E0B] ring-4 ring-[#F59E0B]/20" title="Late Check-in"></div>
                )}
                {emp.status === 'absent' && (
                  <div className="w-3.5 h-3.5 rounded-full bg-[#EF4444] ring-4 ring-[#EF4444]/20" title="Absent"></div>
                )}
                {emp.status === 'leave' && (
                  <div title="On Approved Leave" className="p-0.5 rounded bg-[#3B82F6]/10">
                    <span className="material-symbols-outlined text-[#3B82F6] text-[18px]">flight_takeoff</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div
                onClick={() => onSelectEmployee(emp)}
                className={`flex flex-col items-center text-center cursor-pointer ${
                  isLeave ? 'opacity-80' : ''
                }`}
              >
                <div className="relative mb-4">
                  <img
                    alt={emp.name}
                    className={`w-20 h-20 rounded-full object-cover border-2 border-[#f3f3fc] group-hover:scale-105 transition-transform ${
                      isLeave ? 'grayscale' : ''
                    }`}
                    src={emp.avatar}
                  />
                  <span className="absolute bottom-0 right-0 text-[10px] font-mono bg-white border border-[#E5E7EB] px-1 rounded shadow-2xs">
                    {emp.locationType === 'Remote' ? 'REM' : 'HQ'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#191b22] group-hover:text-[#003c90] transition-colors line-clamp-1">
                  {emp.name}
                </h3>
                <p className="text-xs font-medium text-[#003c90] mb-1.5 line-clamp-1">{emp.role}</p>
                <span className="inline-block px-3 py-1 bg-[#f3f3fc] text-[#434653] rounded-full text-xs font-semibold border border-[#E5E7EB] line-clamp-1">
                  {emp.department}
                </span>
                <span className="text-[11px] font-mono text-[#737784] mt-1">{emp.employeeCode}</span>
              </div>

              {/* Card Action Footer */}
              <div className="mt-6 pt-4 border-t border-[#E5E7EB] flex justify-between items-center text-xs font-semibold text-[#434653]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMessageEmployee(emp);
                  }}
                  className="hover:text-[#003c90] transition-colors flex items-center gap-1.5 p-1 rounded hover:bg-[#f3f3fc]"
                >
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  <span>Message</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEmployee(emp);
                  }}
                  className="hover:text-[#003c90] transition-colors flex items-center gap-1.5 p-1 rounded hover:bg-[#f3f3fc]"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  <span>Profile</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-16 bg-white border border-[#E5E7EB] rounded-xl">
          <span className="material-symbols-outlined text-4xl text-[#737784] mb-2">person_search</span>
          <h3 className="text-base font-bold text-[#191b22]">No employees found</h3>
          <p className="text-xs text-[#434653] mt-1">Try adjusting your search terms or department filters.</p>
        </div>
      )}
    </div>
  );
};
