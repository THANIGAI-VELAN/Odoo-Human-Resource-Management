'use client';

import React from 'react';

export type NexusTab = 'overview' | 'projects' | 'tasks' | 'calendar' | 'documents' | 'settings';

interface NexusSideNavProps {
  currentTab: NexusTab;
  onTabChange: (tab: NexusTab) => void;
  onSwitchToDayflow: () => void;
  onSignOut: () => void;
}

export const NexusSideNav: React.FC<NexusSideNavProps> = ({
  currentTab,
  onTabChange,
  onSwitchToDayflow,
  onSignOut,
}) => {
  return (
    <nav className="fixed left-0 top-0 h-full w-[260px] flex flex-col p-4 bg-[#f9f9f9] border-r border-[#E5E5E5] z-20">
      {/* Header with Project Alpha Logo */}
      <div className="flex items-center gap-3 mb-6">
        <img
          alt="Organization Logo"
          className="w-10 h-10 rounded-lg object-cover bg-[#e2e2e2] border border-[#E5E5E5] shadow-2xs shrink-0"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNJue8gqg0F63Bd3gwYCV8qc3M6rw87xV5Z_L3NOsGFjBlW2ibQf8OtIOHSiAGIHuoauBf1x_G88gGnjW48nzIGR6upIDwCbcNm3l3tlNABbwRVo3elDITiooo0xaE2nR5DVFm27rXyhubICE3-pSvH31le41lYhUvl99EEhOC3A0XmjNSMRBO0mBcycnCfe5qhUr7KXHq5eTu97GThVomuecAF8bWGLXfndO2221_EakomNGf7zLi"
        />
        <div className="flex flex-col overflow-hidden">
          <span className="text-base font-bold text-[#1b1b1b] leading-tight truncate">Project Alpha</span>
          <span className="text-xs font-mono text-[#4b4454] truncate">Main Workspace</span>
        </div>
      </div>

      {/* Switch to Dayflow HRMS */}
      <div className="mb-4">
        <button
          onClick={onSwitchToDayflow}
          className="w-full flex items-center justify-between px-3 py-2 bg-white hover:bg-[#eeeeee] border border-[#E5E5E5] rounded-md text-xs font-semibold text-[#1b1b1b] transition-colors group shadow-2xs"
          title="Switch to Dayflow HRMS"
        >
          <div className="flex items-center gap-2 truncate">
            <div className="w-5 h-5 rounded bg-[#003c90] text-white flex items-center justify-center text-[10px] font-bold">
              D
            </div>
            <span className="truncate">Dayflow HRMS</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-[#7d7386] group-hover:text-[#003c90] group-hover:translate-x-0.5 transition-all">
            swap_horiz
          </span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1 flex-grow">
        {/* Overview */}
        <button
          onClick={() => onTabChange('overview')}
          className={`flex items-center gap-3 p-3 rounded-lg font-mono text-[13px] font-semibold transition-all text-left ${
            currentTab === 'overview'
              ? 'bg-[#944af1] text-white shadow-sm'
              : 'text-[#4b4454] hover:bg-[#f3f3f3] hover:text-[#1b1b1b]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" data-fill={currentTab === 'overview' ? '1' : '0'}>
            dashboard
          </span>
          <span>Overview</span>
        </button>

        {/* Projects */}
        <button
          onClick={() => onTabChange('projects')}
          className={`flex items-center gap-3 p-3 rounded-lg font-mono text-[13px] font-semibold transition-all text-left ${
            currentTab === 'projects'
              ? 'bg-[#944af1] text-white shadow-sm'
              : 'text-[#4b4454] hover:bg-[#f3f3f3] hover:text-[#1b1b1b]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" data-fill={currentTab === 'projects' ? '1' : '0'}>
            view_kanban
          </span>
          <span>Projects</span>
        </button>

        {/* Tasks */}
        <button
          onClick={() => onTabChange('tasks')}
          className={`flex items-center gap-3 p-3 rounded-lg font-mono text-[13px] font-semibold transition-all text-left ${
            currentTab === 'tasks'
              ? 'bg-[#944af1] text-white shadow-sm'
              : 'text-[#4b4454] hover:bg-[#f3f3f3] hover:text-[#1b1b1b]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">assignment</span>
          <span>Tasks</span>
        </button>

        {/* Calendar */}
        <button
          onClick={() => onTabChange('calendar')}
          className={`flex items-center gap-3 p-3 rounded-lg font-mono text-[13px] font-semibold transition-all text-left ${
            currentTab === 'calendar'
              ? 'bg-[#944af1] text-white shadow-sm'
              : 'text-[#4b4454] hover:bg-[#f3f3f3] hover:text-[#1b1b1b]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          <span>Calendar</span>
        </button>

        {/* Documents */}
        <button
          onClick={() => onTabChange('documents')}
          className={`flex items-center gap-3 p-3 rounded-lg font-mono text-[13px] font-semibold transition-all text-left ${
            currentTab === 'documents'
              ? 'bg-[#944af1] text-white shadow-sm'
              : 'text-[#4b4454] hover:bg-[#f3f3f3] hover:text-[#1b1b1b]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">description</span>
          <span>Documents</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => onTabChange('settings')}
          className={`flex items-center gap-3 p-3 rounded-lg font-mono text-[13px] font-semibold transition-all text-left ${
            currentTab === 'settings'
              ? 'bg-[#944af1] text-white shadow-sm'
              : 'text-[#4b4454] hover:bg-[#f3f3f3] hover:text-[#1b1b1b]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span>Settings</span>
        </button>
      </div>

      {/* CTA & Footer */}
      <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-[#E5E5E5]">
        <button
          onClick={() => alert('Nexus Workspace Pro Tier: All advanced team collaboration & AI velocity tools unlocked!')}
          className="w-full py-2 px-4 bg-[#A259FF] text-white font-mono text-[13px] font-bold rounded hover:opacity-90 transition-opacity active:scale-95 shadow-sm"
        >
          Upgrade Plan
        </button>

        <div className="flex flex-col gap-1">
          <a
            href="#support"
            onClick={(e) => {
              e.preventDefault();
              alert('Nexus Workspace Support: docs.nexus.internal');
            }}
            className="flex items-center gap-3 p-2 text-[#4b4454] hover:bg-[#f3f3f3] font-mono text-[13px] rounded-lg transition-all"
          >
            <span className="material-symbols-outlined text-lg">help</span>
            Support
          </a>
          <button
            onClick={onSignOut}
            className="flex items-center gap-3 p-2 text-[#4b4454] hover:bg-[#ffdad6] hover:text-[#ba1a1a] font-mono text-[13px] rounded-lg transition-all text-left"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};
