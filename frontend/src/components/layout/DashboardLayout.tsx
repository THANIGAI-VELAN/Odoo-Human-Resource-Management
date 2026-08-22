'use client';

import React from 'react';
import Sidebar from './Sidebar';
import { User, Bell } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 pl-0">
        {/* Top Header */}
        <header className="h-16 border-b border-gray-250 bg-white flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Tenant ID: Default-01
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Badge */}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-600"></span>
            </button>

            {/* Profile Menu */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
              <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-750 flex items-center justify-center font-bold text-sm">
                AD
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-semibold text-gray-800">Admin User</p>
                <p className="text-[10px] text-gray-450">HR Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
