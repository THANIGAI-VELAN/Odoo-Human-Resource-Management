'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Users, Calendar, Banknote, ShieldAlert, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const stats = [
    { name: 'Total Employees', value: '142', icon: Users, color: 'bg-blue-50 text-blue-600', link: '/employees' },
    { name: 'On Leave Today', value: '8', icon: Calendar, color: 'bg-amber-50 text-amber-600', link: '/leave' },
    { name: 'Payroll Run (Aug)', value: 'Processed', icon: Banknote, color: 'bg-emerald-50 text-emerald-600', link: '/payroll' },
    { name: 'Pending Approvals', value: '3 requests', icon: ShieldAlert, color: 'bg-rose-50 text-rose-600', link: '/leave' },
  ];

  const recentActivities = [
    { id: 1, type: 'leave', text: 'Jane Doe requested Annual Leave (Aug 25 - Aug 28)', time: '2 hours ago' },
    { id: 2, type: 'employee', text: 'New employee John Smith joined Engineering dept', time: '1 day ago' },
    { id: 3, type: 'payroll', text: 'Monthly payroll run completed by Admin', time: '2 days ago' },
    { id: 4, type: 'attendance', text: 'Shift assignment finalized for Morning rotation', time: '3 days ago' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to HR Portal</h1>
            <p className="text-sm text-gray-500">Here's a snapshot of your organization's activities today.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/employees">
              <Button variant="secondary" size="sm">Manage Staff</Button>
            </Link>
            <Link href="/leave">
              <Button size="sm">Approve Requests</Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">{stat.name}</span>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-2xl font-semibold text-gray-900">{stat.value}</span>
                  <Link href={stat.link} className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
                    View
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Core content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card title="Recent HR Activities">
              <div className="flow-root">
                <ul className="-mb-8">
                  {recentActivities.map((activity, activityIdx) => (
                    <li key={activity.id}>
                      <div className="relative pb-8">
                        {activityIdx !== recentActivities.length - 1 ? (
                          <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white text-gray-500">
                              ●
                            </span>
                          </div>
                          <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-800">{activity.text}</p>
                            </div>
                            <div className="text-right text-xs whitespace-nowrap text-gray-400">
                              <time>{activity.time}</time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          </div>

          {/* Quick Info / Holidays */}
          <div className="lg:col-span-1">
            <Card title="Upcoming Holidays">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Labor Day</p>
                    <p className="text-xs text-gray-400">September 7, 2026</p>
                  </div>
                  <span className="text-xs font-medium bg-gray-100 text-gray-650 px-2.5 py-1 rounded-full">
                    National
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Thanksgiving</p>
                    <p className="text-xs text-gray-400">November 26, 2026</p>
                  </div>
                  <span className="text-xs font-medium bg-gray-100 text-gray-650 px-2.5 py-1 rounded-full">
                    National
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Christmas Day</p>
                    <p className="text-xs text-gray-400">December 25, 2026</p>
                  </div>
                  <span className="text-xs font-medium bg-gray-100 text-gray-650 px-2.5 py-1 rounded-full">
                    National
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
