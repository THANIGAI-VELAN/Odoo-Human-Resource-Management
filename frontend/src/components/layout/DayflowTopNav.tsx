'use client';

import React, { useState } from 'react';

interface DayflowTopNavProps {
  isCheckedIn: boolean;
  onToggleCheckIn: () => void;
  onLogout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: {
    name: string;
    role: string;
    avatar: string;
  };
  onSwitchUser: (userKey: string) => void;
  onOpenNotifications: () => void;
  notificationCount: number;
}

export const DayflowTopNav: React.FC<DayflowTopNavProps> = ({
  isCheckedIn,
  onToggleCheckIn,
  onLogout,
  searchQuery,
  onSearchChange,
  currentUser,
  onSwitchUser,
  onOpenNotifications,
  notificationCount,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('09:41 AM');

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-8 h-14 bg-white border-b border-[#E5E7EB]">
      {/* Brand logo & sidebar width spacer */}
      <div className="w-60 shrink-0 flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#003c90] flex items-center justify-center text-white font-bold">D</div>
          <span className="text-lg font-bold text-[#003c90]">Dayflow</span>
        </div>
        <div className="hidden md:flex items-center">
          <span className="text-xl font-bold text-[#003c90] tracking-tight">Dayflow</span>
        </div>
      </div>

      {/* Main Bar Center & Right */}
      <div className="flex-1 flex justify-between items-center pl-2 md:pl-6">
        {/* Search Bar */}
        <div className="relative w-48 sm:w-72 md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#737784] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-[#ffffff] border border-[#E5E7EB] rounded-md focus:outline-none focus:border-[#003c90] focus:ring-1 focus:ring-[#003c90] text-sm text-[#191b22] placeholder:text-[#737784] transition-all"
            placeholder="Search employees, reports..."
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#737784] hover:text-[#191b22]"
            >
              <span className="material-symbols-outlined text-[16px]">cancel</span>
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          {/* Icons (Timer & Notifications) */}
          <div className="flex items-center gap-2 text-[#434653]">
            <button
              onClick={() => {
                const now = new Date();
                alert(`Current System Time: ${now.toLocaleTimeString()} (Shift started: 09:00 AM)`);
              }}
              title="Work Time Tracker"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#f3f3fc] transition-colors group"
            >
              <span className="material-symbols-outlined text-[22px] group-hover:text-[#003c90] transition-colors">
                timer
              </span>
            </button>

            <button
              onClick={onOpenNotifications}
              title="Notifications"
              className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#f3f3fc] transition-colors group relative"
            >
              <span className="material-symbols-outlined text-[22px] group-hover:text-[#003c90] transition-colors">
                notifications
              </span>
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full animate-pulse"></span>
              )}
            </button>
          </div>

          {/* Check-In / Check-Out and Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onToggleCheckIn}
              className={`h-9 px-3.5 sm:px-4 flex items-center gap-1.5 justify-center rounded-md font-semibold text-xs sm:text-sm transition-all shadow-2xs ${
                isCheckedIn
                  ? 'bg-[#22C55E] text-white hover:bg-[#16a34a]'
                  : 'bg-[#003c90] text-white hover:bg-[#0f52ba]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>{isCheckedIn ? 'Checked-In' : 'Check-In'}</span>
            </button>

            <button
              onClick={onLogout}
              className="h-9 px-3 sm:px-4 flex items-center justify-center rounded-md border border-[#003c90] text-[#003c90] text-xs sm:text-sm font-semibold hover:bg-[#f3f3fc] transition-colors"
            >
              Log Out
            </button>

            {/* Profile Avatar with dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center focus:outline-none ring-2 ring-transparent hover:ring-[#0f52ba] rounded-full transition-all"
                title={`${currentUser.name} (${currentUser.role})`}
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#E5E7EB]"
                />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-[#E5E7EB] rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-4 py-2 border-b border-[#E5E7EB]">
                    <p className="text-sm font-bold text-[#191b22]">{currentUser.name}</p>
                    <p className="text-xs text-[#434653] capitalize">{currentUser.role}</p>
                  </div>

                  <div className="px-2 py-1">
                    <p className="text-[11px] font-semibold text-[#737784] px-2 py-1 uppercase tracking-wider">Switch Persona</p>
                    <button
                      onClick={() => {
                        onSwitchUser('admin');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-[#191b22] hover:bg-[#f3f3fc] rounded flex items-center justify-between"
                    >
                      <span>Admin View (HR Director)</span>
                      {currentUser.role.includes('admin') && (
                        <span className="material-symbols-outlined text-sm text-[#003c90]">check</span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        onSwitchUser('arjun');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-2 py-1.5 text-xs text-[#191b22] hover:bg-[#f3f3fc] rounded flex items-center justify-between"
                    >
                      <span>Employee View (Arjun Desai)</span>
                      {currentUser.name === 'Arjun Desai' && (
                        <span className="material-symbols-outlined text-sm text-[#003c90]">check</span>
                      )}
                    </button>
                  </div>

                  <div className="border-t border-[#E5E7EB] pt-1 px-2">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onLogout();
                      }}
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
        </div>
      </div>
    </header>
  );
};
