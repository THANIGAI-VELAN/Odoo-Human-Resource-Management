'use client';

import React from 'react';
import { ActivityItem } from '@/types/hrms';

interface NexusDashboardProps {
  activities: ActivityItem[];
  onViewProjects: () => void;
  onNewTask: () => void;
}

export const NexusDashboard: React.FC<NexusDashboardProps> = ({
  activities,
  onViewProjects,
  onNewTask,
}) => {
  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Top Banner / Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1b1b1b] tracking-tight">Overview</h1>
          <p className="text-xs sm:text-sm text-[#4b4454] mt-1 font-mono">
            Welcome back, Sarah. Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onViewProjects}
            className="px-3.5 py-1.5 bg-white border border-[#E5E5E5] text-[#1b1b1b] rounded text-xs font-mono font-semibold hover:bg-[#f3f3f3] transition-colors shadow-2xs"
          >
            View All Projects
          </button>
          <button
            onClick={onNewTask}
            className="px-3.5 py-1.5 bg-[#A259FF] text-white rounded text-xs font-mono font-bold hover:opacity-90 transition-opacity active:scale-95 shadow-2xs"
          >
            + Create Sprint Task
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Active Tasks */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 flex flex-col justify-between h-36 shadow-2xs">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-mono text-[#4b4454] uppercase tracking-wider">Active Tasks</h3>
            <span className="material-symbols-outlined text-[#7a2ad6] text-[20px]">assignment</span>
          </div>
          <div>
            <span className="text-3xl font-bold font-mono text-[#1b1b1b]">124</span>
            <span className="text-xs font-mono text-[#22C55E] ml-2 font-semibold">+12% from last week</span>
          </div>
        </div>

        {/* Project Velocity */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 flex flex-col justify-between h-36 shadow-2xs">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-mono text-[#4b4454] uppercase tracking-wider">Project Velocity</h3>
            <span className="material-symbols-outlined text-[#7a2ad6] text-[20px]">speed</span>
          </div>
          <div>
            <span className="text-3xl font-bold font-mono text-[#1b1b1b]">8.4</span>
            <span className="text-xs font-mono text-[#4b4454] ml-2">Steady sprint pace</span>
          </div>
        </div>

        {/* Pending Reviews */}
        <div className="bg-white border border-[#E5E5E5] rounded-xl p-6 flex flex-col justify-between h-36 shadow-2xs">
          <div className="flex justify-between items-start">
            <h3 className="text-xs font-mono text-[#4b4454] uppercase tracking-wider">Pending Reviews</h3>
            <span className="material-symbols-outlined text-[#F24E1E] text-[20px]">rate_review</span>
          </div>
          <div>
            <span className="text-3xl font-bold font-mono text-[#1b1b1b]">14</span>
            <span className="text-xs font-mono text-[#F24E1E] ml-2 font-semibold">Action required</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Activity Feed & Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E5E5E5] rounded-xl p-6 shadow-2xs">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#E5E5E5]">
            <h3 className="text-base font-bold text-[#1b1b1b]">Recent Activity</h3>
            <span className="text-xs font-mono text-[#7d7386]">Live Project Stream</span>
          </div>

          <div className="space-y-4 divide-y divide-[#f3f3f3]">
            {activities.map((act) => (
              <div key={act.id} className="pt-3 first:pt-0 flex items-start gap-3.5">
                {act.userAvatar ? (
                  <img
                    alt={act.userName}
                    className="w-9 h-9 rounded-full object-cover border border-[#E5E5E5] shrink-0 mt-0.5"
                    src={act.userAvatar}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#f1ebfc] text-[#7a2ad6] flex items-center justify-center font-bold text-xs shrink-0 border border-[#E5E5E5]">
                    <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <p className="text-xs sm:text-sm text-[#1b1b1b]">
                      <span className="font-bold">{act.userName}</span> {act.description}{' '}
                      {act.target && (
                        <span className="font-mono text-[#7a2ad6] font-semibold bg-[#f9f5ff] px-1.5 py-0.5 rounded border border-[#e8d7ff]">
                          {act.target}
                        </span>
                      )}
                    </p>
                    <span className="text-[11px] font-mono text-[#7d7386]">{act.timestamp}</span>
                  </div>

                  {act.commentQuote && (
                    <div className="mt-2.5 p-3 bg-[#fbfbfb] border-l-2 border-[#A259FF] text-xs text-[#4b4454] rounded-r font-mono italic leading-relaxed">
                      {act.commentQuote}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status & Workload (1 col) */}
        <div className="space-y-6">
          {/* System Status */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-[#1b1b1b] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#22C55E]">dns</span>
              <span>System Status</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#4b4454]">API Endpoint</span>
                <span className="flex items-center gap-1.5 text-[#22C55E] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#4b4454]">Database Cluster</span>
                <span className="flex items-center gap-1.5 text-[#22C55E] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                  Operational
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#4b4454]">Background Workers</span>
                <span className="flex items-center gap-1.5 text-[#22C55E] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
                  Operational
                </span>
              </div>
            </div>
          </div>

          {/* Team Workload */}
          <div className="bg-white border border-[#E5E5E5] rounded-xl p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-[#1b1b1b] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-[#7a2ad6]">monitoring</span>
              <span>Team Workload</span>
            </h3>

            <div className="space-y-3.5 font-mono text-xs">
              <div>
                <div className="flex justify-between text-[#4b4454] mb-1">
                  <span>Frontend Team</span>
                  <span className="font-bold text-[#1b1b1b]">85%</span>
                </div>
                <div className="w-full bg-[#f3f3f3] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#A259FF] h-full rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#4b4454] mb-1">
                  <span>Backend Team</span>
                  <span className="font-bold text-[#1b1b1b]">60%</span>
                </div>
                <div className="w-full bg-[#f3f3f3] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#A259FF] h-full rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[#4b4454] mb-1">
                  <span>Design Team</span>
                  <span className="font-bold text-[#F24E1E]">95% (High)</span>
                </div>
                <div className="w-full bg-[#f3f3f3] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#F24E1E] h-full rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
