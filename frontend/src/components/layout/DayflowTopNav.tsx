'use client';

import React, { useState } from 'react';
import { DayflowTab } from './DayflowSideNav';

interface DayflowTopNavProps {
  isCheckedIn: boolean;
  onToggleCheckIn: () => void;
  onLogout: () => void;
  currentUser: {
    name: string;
    role: string;
    avatar: string;
  };
  currentTab: DayflowTab;
  onTabChange: (tab: DayflowTab) => void;
  onSwitchUser: (userKey: string) => void;
  onOpenNotifications: () => void;
  notificationCount: number;
}

export const DayflowTopNav: React.FC<DayflowTopNavProps> = ({
  isCheckedIn,
  onToggleCheckIn,
  onLogout,
  currentUser,
  currentTab,
  onTabChange,
  onSwitchUser,
  onOpenNotifications,
  notificationCount,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 md:px-8 h-14 bg-white border-b border-[#E5E7EB]">
      {/* Left: Brand logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 rounded bg-[#714B67] flex items-center justify-center text-white font-bold text-sm">O</div>
        <span className="text-lg font-bold text-[#714B67] tracking-tight hidden sm:inline">Odoo India</span>
      </div>

      {/* Center: Menu Tabs */}
      <nav className="flex items-center gap-6 md:gap-10 h-full">
        <button
          onClick={() => onTabChange('directory')}
          className={`h-full px-1 flex items-center text-sm font-semibold transition-all border-b-2 ${
            currentTab === 'directory' || currentTab === 'profile_salary'
              ? 'text-[#714B67] border-[#714B67]'
              : 'text-[#737784] border-transparent hover:text-[#191b22]'
          }`}
        >
          Employees
        </button>
        <button
          onClick={() => onTabChange('attendance')}
          className={`h-full px-1 flex items-center text-sm font-semibold transition-all border-b-2 ${
            currentTab === 'attendance'
              ? 'text-[#714B67] border-[#714B67]'
              : 'text-[#737784] border-transparent hover:text-[#191b22]'
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => onTabChange('leave')}
          className={`h-full px-1 flex items-center text-sm font-semibold transition-all border-b-2 ${
            currentTab === 'leave'
              ? 'text-[#714B67] border-[#714B67]'
              : 'text-[#737784] border-transparent hover:text-[#191b22]'
          }`}
        >
          Time Off
        </button>
      </nav>

      {/* Right: Check-In + Avatar */}
      <div className="flex items-center gap-3">
        {/* Check-In / Check-Out */}
        <button
          onClick={onToggleCheckIn}
          className={`h-8 px-3 flex items-center gap-1.5 rounded-md font-semibold text-xs transition-all ${
            isCheckedIn
              ? 'bg-[#22C55E] text-white hover:bg-[#16a34a]'
              : 'bg-[#714B67] text-white hover:bg-[#5a3c53]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          {isCheckedIn ? 'Checked-In' : 'Check-In'}
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          title="Notifications"
          className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#f3f3fc] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px] text-[#434653]">notifications</span>
          {notificationCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#EF4444] rounded-full"></span>
          )}
        </button>

        {/* Profile Avatar with dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center focus:outline-none rounded-full transition-all"
            title={`${currentUser.name} (${currentUser.role})`}
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#E5E7EB]"
            />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-[#E5E7EB]">
                <p className="text-sm font-bold text-[#191b22]">{currentUser.name}</p>
                <p className="text-xs text-[#434653] capitalize">{currentUser.role}</p>
              </div>

              <div className="px-2 py-1">
                <p className="text-[11px] font-semibold text-[#737784] px-2 py-1 uppercase tracking-wider">Switch Persona</p>
                <button
                  onClick={() => { onSwitchUser('admin'); setProfileDropdownOpen(false); }}
                  className="w-full text-left px-2 py-1.5 text-xs text-[#191b22] hover:bg-[#f3f3fc] rounded flex items-center justify-between"
                >
                  <span>Admin View (HR Director)</span>
                  {currentUser.role.includes('admin') && (
                    <span className="material-symbols-outlined text-sm text-[#714B67]">check</span>
                  )}
                </button>
                <button
                  onClick={() => { onSwitchUser('arjun'); setProfileDropdownOpen(false); }}
                  className="w-full text-left px-2 py-1.5 text-xs text-[#191b22] hover:bg-[#f3f3fc] rounded flex items-center justify-between"
                >
                  <span>Employee View (Arjun Desai)</span>
                  {currentUser.name === 'Arjun Desai' && (
                    <span className="material-symbols-outlined text-sm text-[#714B67]">check</span>
                  )}
                </button>
              </div>

              <div className="border-t border-[#E5E7EB] pt-1 px-2">
                <button
                  onClick={() => { setProfileDropdownOpen(false); onLogout(); }}
                  className="w-full text-left px-2 py-1.5 text-xs text-[#EF4444] hover:bg-[#ffdad6] rounded font-medium flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">logout</span>
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
