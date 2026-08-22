'use client';

import React from 'react';
import { NexusTab } from './NexusSideNav';

interface NexusTopNavProps {
  currentTab: NexusTab;
  onTabChange: (tab: NexusTab) => void;
  onNewTaskClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSignOut: () => void;
}

export const NexusTopNav: React.FC<NexusTopNavProps> = ({
  currentTab,
  onTabChange,
  onNewTaskClick,
  searchQuery,
  onSearchChange,
  onSignOut,
}) => {
  return (
    <header className="flex justify-between items-center px-6 md:px-12 w-full bg-[#f9f9f9] h-16 sticky top-0 z-10 border-b border-[#E5E5E5]">
      {/* Brand & Search / Breadcrumb */}
      <div className="flex items-center gap-6 flex-1">
        <span className="text-xl font-bold text-[#7a2ad6] tracking-tight">Nexus Workspace</span>

        {/* Navigation Clusters */}
        <nav className="hidden lg:flex items-center gap-6 h-full pt-2">
          <button
            onClick={() => onTabChange('overview')}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              currentTab === 'overview'
                ? 'text-[#7a2ad6] font-bold border-[#7a2ad6]'
                : 'text-[#4b4454] border-transparent hover:text-[#1b1b1b]'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange('projects')}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              currentTab === 'projects'
                ? 'text-[#7a2ad6] font-bold border-[#7a2ad6]'
                : 'text-[#4b4454] border-transparent hover:text-[#1b1b1b]'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => onTabChange('tasks')}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              currentTab === 'tasks'
                ? 'text-[#7a2ad6] font-bold border-[#7a2ad6]'
                : 'text-[#4b4454] border-transparent hover:text-[#1b1b1b]'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => onTabChange('documents')}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
              currentTab === 'documents'
                ? 'text-[#7a2ad6] font-bold border-[#7a2ad6]'
                : 'text-[#4b4454] border-transparent hover:text-[#1b1b1b]'
            }`}
          >
            Analytics
          </button>
        </nav>

        {/* Search input */}
        <div className="relative w-48 lg:w-64 hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4b4454] text-[18px]">
            search
          </span>
          <input
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#E5E5E5] rounded text-xs font-mono focus:outline-none focus:border-[#A259FF] transition-colors placeholder:text-[#4b4454]"
            placeholder="Search..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Trailing Actions */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onNewTaskClick}
          className="flex items-center gap-1.5 bg-[#A259FF] text-white px-3.5 py-1.5 rounded font-mono text-[13px] font-bold hover:opacity-90 transition-opacity active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Task</span>
        </button>

        <div className="flex items-center gap-1 border-l border-[#E5E5E5] pl-3">
          <button
            onClick={() => alert('Nexus System Notifications: All pipelines green.')}
            className="p-1.5 text-[#4b4454] hover:bg-[#eeeeee] rounded-full transition-colors active:scale-95"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>

          <button
            onClick={() => onTabChange('settings')}
            className="p-1.5 text-[#4b4454] hover:bg-[#eeeeee] rounded-full transition-colors active:scale-95"
            title="Workspace Settings"
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>

          <img
            alt="User profile"
            className="w-8 h-8 rounded-full border border-[#E5E5E5] ml-1 object-cover cursor-pointer hover:ring-2 hover:ring-[#A259FF] transition-all"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOXl9xdcLyUv6mZ8_pf0Bm-C0d0BCr5dsjTM3AADI4Rzhu5e7E69bUSD1pUpV2T5OTu7gmagGzm5nLbBRHAK8w2MdpOElq367T3L6wIDPybvYRQB0MpyBgKImNzgRu6ilrHogaV4sEt_zzNb6v2ZGr88ZEKeZl_JDz6LbWVf39YRlmvoyXwTN1MoRZs-cubXHZdFyE7HDMw1NVhHJBsLBrZA_8AbaXN6_QQP8-lfhR7A6RNtHiY6mF"
            onClick={onSignOut}
            title="Click to sign out / switch"
          />
        </div>
      </div>
    </header>
  );
};
