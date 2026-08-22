'use client';

import React, { useState } from 'react';
import { ActivityItem } from '@/types/hrms';

interface DayflowDashboardProps {
  totalEmployees: number;
  activeCount: number;
  pendingLeavesCount: number;
  activities: ActivityItem[];
  onReviewLeaves: () => void;
  onViewDirectory: () => void;
  onViewActivityLog: () => void;
}

export const DayflowDashboard: React.FC<DayflowDashboardProps> = ({
  totalEmployees,
  activeCount,
  pendingLeavesCount,
  activities,
  onReviewLeaves,
  onViewDirectory,
  onViewActivityLog,
}) => {
  const [timeFilter, setTimeFilter] = useState<'Today' | 'This Week'>('Today');

  // Chart values based on current counts
  const presentCount = activeCount;
  const absentCount = Math.max(0, Math.round((totalEmployees - activeCount) * 0.42));
  const leaveCount = Math.max(0, totalEmployees - presentCount - absentCount);

  const presentPct = Math.round((presentCount / totalEmployees) * 100);
  const absentPct = Math.round((absentCount / totalEmployees) * 100);
  const leavePct = 100 - presentPct - absentPct;

  return (
    <div className="max-w-[1440px] mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#191b22] tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-[#434653] mt-1">Today's attendance and workforce status at a glance.</p>
        </div>
        <div className="text-sm text-[#434653] bg-white border border-[#E5E7EB] px-3.5 py-1.5 rounded-md font-mono flex items-center gap-2 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
          <span>Oct 24, 2023 - 09:41 AM</span>
        </div>
      </div>

      {/* Hero Metrics (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Employees Card */}
        <div
          onClick={onViewDirectory}
          className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col justify-between h-36 hover:border-[#003c90] transition-colors cursor-pointer group shadow-2xs"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-[#434653] group-hover:text-[#003c90] transition-colors">
              Total Employees
            </h3>
            <div className="w-8 h-8 rounded bg-[#f3f3fc] flex items-center justify-center text-[#003c90]">
              <span className="material-symbols-outlined text-[20px]">group</span>
            </div>
          </div>
          <div>
            <span className="text-3xl font-bold text-[#191b22]">{totalEmployees.toLocaleString()}</span>
            <span className="text-xs font-semibold text-[#22C55E] ml-2">+12 this month</span>
          </div>
        </div>

        {/* Active Presence Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col justify-between h-36 relative overflow-hidden shadow-2xs">
          <div className="flex justify-between items-start z-10">
            <h3 className="text-sm font-semibold text-[#434653]">Active Presence</h3>
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#22C55E]/10 text-[#22C55E]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></div>
              <span className="text-[11px] font-bold">Live</span>
            </div>
          </div>
          <div className="z-10">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-[#191b22]">{presentCount.toLocaleString()}</span>
              <span className="text-sm text-[#434653]">/ {totalEmployees.toLocaleString()}</span>
            </div>
            <div className="w-full bg-[#e7e7f1] h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-[#22C55E] h-full rounded-full transition-all duration-500"
                style={{ width: `${presentPct}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pending Leave Requests Card */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 flex flex-col justify-between h-36 shadow-2xs">
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-semibold text-[#434653]">Pending Leave Requests</h3>
            <div className="w-8 h-8 rounded bg-[#f3f3fc] flex items-center justify-center text-[#F59E0B]">
              <span className="material-symbols-outlined text-[20px]">flight_takeoff</span>
            </div>
          </div>
          <div className="flex items-end justify-between w-full">
            <span className="text-3xl font-bold text-[#191b22]">{pendingLeavesCount}</span>
            <button
              onClick={onReviewLeaves}
              className="text-xs font-semibold text-[#003c90] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>Review All</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lower Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* At a Glance: Attendance Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E5E7EB] rounded-xl flex flex-col shadow-2xs">
          <div className="p-6 border-b border-[#E5E7EB] flex justify-between items-center bg-[#F9FAFB] rounded-t-xl">
            <h3 className="text-lg font-semibold text-[#191b22]">Attendance Distribution</h3>
            <div className="flex items-center gap-2">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as any)}
                className="h-8 pl-3 pr-7 py-0 bg-white border border-[#E5E7EB] rounded text-sm text-[#191b22] focus:border-[#003c90] focus:ring-0 outline-none cursor-pointer font-medium"
              >
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
              </select>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[300px] relative">
            {/* Chart Area */}
            <div className="flex items-end space-x-8 h-48 w-full max-w-lg px-4 border-b border-[#E5E7EB] relative">
              {/* Grid Lines */}
              <div className="absolute left-0 top-0 bottom-0 w-full flex flex-col justify-between pointer-events-none z-0">
                <div className="w-full border-t border-dashed border-[#E5E7EB]"></div>
                <div className="w-full border-t border-dashed border-[#E5E7EB]"></div>
                <div className="w-full border-t border-dashed border-[#E5E7EB]"></div>
              </div>

              {/* Bars */}
              <div className="w-full flex justify-around items-end h-full z-10 pb-[1px]">
                {/* Present Bar */}
                <div className="flex flex-col items-center group w-1/4">
                  <div
                    className="w-full bg-[#22C55E] rounded-t transition-all duration-300 group-hover:opacity-90 relative cursor-pointer"
                    style={{ height: `${timeFilter === 'Today' ? 85 : 88}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-[#191b22] text-xs font-mono font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-[#E5E7EB] shadow-md whitespace-nowrap">
                      {presentCount} Present
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#737784] mt-2">Present</span>
                </div>

                {/* Absent Bar */}
                <div className="flex flex-col items-center group w-1/4">
                  <div
                    className="w-full bg-[#EF4444] rounded-t transition-all duration-300 group-hover:opacity-90 relative cursor-pointer"
                    style={{ height: `${timeFilter === 'Today' ? 12 : 9}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-[#191b22] text-xs font-mono font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-[#E5E7EB] shadow-md whitespace-nowrap">
                      {absentCount} Absent
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#737784] mt-2">Absent</span>
                </div>

                {/* On Leave Bar */}
                <div className="flex flex-col items-center group w-1/4">
                  <div
                    className="w-full bg-[#3B82F6] rounded-t transition-all duration-300 group-hover:opacity-90 relative cursor-pointer"
                    style={{ height: `${timeFilter === 'Today' ? 16 : 14}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-[#191b22] text-xs font-mono font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity border border-[#E5E7EB] shadow-md whitespace-nowrap">
                      {leaveCount} On Leave
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#737784] mt-2">On Leave</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-6 mt-6 pt-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#22C55E]"></div>
                <span className="text-xs sm:text-sm font-medium text-[#434653]">Present ({presentPct}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                <span className="text-xs sm:text-sm font-medium text-[#434653]">Absent ({absentPct}%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
                <span className="text-xs sm:text-sm font-medium text-[#434653]">On Leave ({leavePct}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Feed (1 col) */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl flex flex-col h-[400px] shadow-2xs">
          <div className="p-6 border-b border-[#E5E7EB] bg-[#F9FAFB] rounded-t-xl flex justify-between items-center">
            <h3 className="text-lg font-semibold text-[#191b22]">Recent Activity</h3>
            <span className="text-xs font-mono text-[#22C55E] flex items-center gap-1 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
              Live Feed
            </span>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-1 divide-y divide-[#F3F4F6]">
            {activities.map((act) => {
              let dotColor = 'bg-[#22C55E]';
              if (act.badgeStatus === 'late') dotColor = 'bg-[#F59E0B]';
              if (act.badgeStatus === 'leave') dotColor = 'bg-[#3B82F6]';
              if (act.badgeStatus === 'absent') dotColor = 'bg-[#EF4444]';

              return (
                <div
                  key={act.id}
                  className="flex items-start space-x-3 p-2.5 hover:bg-[#F9FAFB] rounded transition-colors cursor-pointer"
                >
                  <div className="relative shrink-0">
                    {act.userAvatar ? (
                      <img
                        alt={act.userName}
                        className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]"
                        src={act.userAvatar}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#e1e2eb] flex items-center justify-center text-[#434653] font-bold text-xs border border-[#E5E7EB]">
                        {act.userName.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${dotColor} border-2 border-white`}></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#191b22] truncate">
                      <span className="font-semibold">{act.userName}</span> {act.description}
                    </p>
                    <p className="text-xs text-[#737784] font-mono mt-0.5">
                      {act.timestamp} {act.target && `• ${act.target}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-[#E5E7EB] text-center bg-[#F9FAFB] rounded-b-xl">
            <button
              onClick={onViewActivityLog}
              className="text-xs font-semibold text-[#003c90] hover:underline"
            >
              View Full Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
