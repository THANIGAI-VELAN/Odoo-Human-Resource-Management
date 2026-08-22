'use client';

import React from 'react';

export type DayflowTab = 'dashboard' | 'directory' | 'profile_salary' | 'attendance' | 'leave' | 'payroll' | 'settings';

interface DayflowSideNavProps {
  currentTab: DayflowTab;
  onTabChange: (tab: DayflowTab) => void;
  onSwitchToNexus: () => void;
  unreadCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const DayflowSideNav: React.FC<DayflowSideNavProps> = ({
  currentTab,
  onTabChange,
  onSwitchToNexus,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
        />
      )}

      <nav
        className={`fixed md:sticky md:top-14 left-0 top-0 h-full md:h-[calc(100vh-3.5rem)] w-64 shrink-0 flex flex-col pt-16 md:pt-4 pb-4 px-4 z-40 bg-[#f3f3fc] border-r border-[#E5E7EB] transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6 px-3">
          <div className="w-9 h-9 rounded bg-[#003c90] flex items-center justify-center text-white shadow-sm shrink-0">
            <span className="material-symbols-outlined text-[20px]" data-fill="1">corporate_fare</span>
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h1 className="text-xl font-bold text-[#003c90] tracking-tight">Odoo</h1>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-[#d9e2ff] text-[#001945] rounded font-semibold">India</span>
            </div>
            <p className="text-[11px] font-medium text-[#434653] uppercase tracking-wider">HR Management</p>
          </div>
        </div>

      {/* Workspace Switcher Banner */}
      <div className="mb-4 px-2">
        <button
          onClick={onSwitchToNexus}
          className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-[#ededf6] border border-[#E5E7EB] rounded-lg text-xs font-semibold text-[#191b22] transition-colors group shadow-2xs"
          title="Switch to Project Alpha workspace"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="w-5 h-5 rounded bg-[#7a2ad6] text-white flex items-center justify-center text-[11px] font-bold">
              α
            </div>
            <span className="truncate">Nexus Workspace</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#737784] group-hover:text-[#7a2ad6] group-hover:translate-x-0.5 transition-all">
            swap_horiz
          </span>
        </button>
      </div>

      {/* Main Navigation List */}
      <ul className="flex flex-col gap-1.5 flex-1 overflow-y-auto">
        <li>
          <button
            onClick={() => onTabChange('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'dashboard'
                ? 'bg-[#0f52ba] text-white shadow-sm scale-[0.98]'
                : 'text-[#434653] hover:bg-[#e7e7f1] hover:text-[#191b22]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" data-fill={currentTab === 'dashboard' ? '1' : '0'}>
              dashboard
            </span>
            <span>Dashboard</span>
          </button>
        </li>

        <li>
          <button
            onClick={() => onTabChange('directory')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'directory'
                ? 'bg-[#0f52ba] text-white shadow-sm scale-[0.98]'
                : 'text-[#434653] hover:bg-[#e7e7f1] hover:text-[#191b22]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" data-fill={currentTab === 'directory' ? '1' : '0'}>
              groups
            </span>
            <span>Employee Directory</span>
          </button>
        </li>

        <li>
          <button
            onClick={() => onTabChange('attendance')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'attendance'
                ? 'bg-[#0f52ba] text-white shadow-sm scale-[0.98]'
                : 'text-[#434653] hover:bg-[#e7e7f1] hover:text-[#191b22]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" data-fill={currentTab === 'attendance' ? '1' : '0'}>
              event_available
            </span>
            <span>Attendance</span>
          </button>
        </li>

        <li>
          <button
            onClick={() => onTabChange('leave')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'leave'
                ? 'bg-[#0f52ba] text-white shadow-sm scale-[0.98]'
                : 'text-[#434653] hover:bg-[#e7e7f1] hover:text-[#191b22]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" data-fill={currentTab === 'leave' ? '1' : '0'}>
              flight_takeoff
            </span>
            <div className="flex items-center justify-between flex-1">
              <span>Leave Management</span>
              <span className="bg-[#EF4444] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">2</span>
            </div>
          </button>
        </li>

        <li>
          <button
            onClick={() => onTabChange('profile_salary')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              currentTab === 'profile_salary' || currentTab === 'payroll'
                ? 'bg-[#0f52ba] text-white shadow-sm scale-[0.98]'
                : 'text-[#434653] hover:bg-[#e7e7f1] hover:text-[#191b22]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]" data-fill={currentTab === 'profile_salary' || currentTab === 'payroll' ? '1' : '0'}>
              payments
            </span>
            <div className="flex items-center justify-between flex-1">
              <span>Payroll & Salary</span>
              <span className="text-[10px] font-mono bg-[#90efef] text-[#006e6e] px-1.5 py-0.5 rounded font-bold">Admin</span>
            </div>
          </button>
        </li>
      </ul>

      {/* Bottom Actions */}
      <div className="mt-auto border-t border-[#E5E7EB] pt-4 flex flex-col gap-1">
        <button
          onClick={() => onTabChange('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            currentTab === 'settings'
              ? 'bg-[#0f52ba] text-white'
              : 'text-[#434653] hover:bg-[#e7e7f1] hover:text-[#191b22]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span>Settings</span>
        </button>

        <a
          href="#support"
          onClick={(e) => {
            e.preventDefault();
            alert('Dayflow HRMS Support Hotline: +1 (800) 555-DAYFLOW or support@dayflow.internal');
          }}
          className="flex items-center gap-3 px-3 py-2 text-[#434653] hover:bg-[#e7e7f1] hover:text-[#191b22] transition-colors rounded-lg text-sm font-medium"
        >
          <span className="material-symbols-outlined text-[20px]">help</span>
          <span>Support</span>
        </a>
      </div>
    </nav>
  </>
);
};
