'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function LeavePage() {
  const [requests, setRequests] = useState([
    { id: 'LR-101', name: 'Alice Johnson', type: 'Annual Leave', start: '2026-08-25', end: '2026-08-28', days: 4, reason: 'Family trip', status: 'Pending' },
    { id: 'LR-102', name: 'Charlie Brown', type: 'Sick Leave', start: '2026-08-22', end: '2026-08-23', days: 2, reason: 'Doctor checkup', status: 'Approved' },
    { id: 'LR-103', name: 'Bob Smith', type: 'Casual Leave', start: '2026-09-02', end: '2026-09-03', days: 1, reason: 'Personal work', status: 'Rejected' },
  ]);

  const handleAction = (id: string, newStatus: 'Approved' | 'Rejected') => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
            <p className="text-sm text-gray-500">Track and review employee vacation and sick time requests.</p>
          </div>
          <Button>New Request</Button>
        </div>

        {/* Allocations Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <p className="text-sm font-medium text-gray-500">Sick Leave Allocation</p>
            <p className="text-3xl font-bold text-blue-650 mt-2">12 Days</p>
            <p className="text-xs text-gray-400 mt-1">Average usage: 3.4 days/year</p>
          </Card>
          <Card>
            <p className="text-sm font-medium text-gray-500">Annual Leave Allocation</p>
            <p className="text-3xl font-bold text-indigo-650 mt-2">20 Days</p>
            <p className="text-xs text-gray-400 mt-1">Average usage: 14.2 days/year</p>
          </Card>
          <Card>
            <p className="text-sm font-medium text-gray-500">Casual Leave Allocation</p>
            <p className="text-3xl font-bold text-amber-650 mt-2">10 Days</p>
            <p className="text-xs text-gray-400 mt-1">Average usage: 6.1 days/year</p>
          </Card>
        </div>

        {/* Requests Table */}
        <Card title="Recent Leave Applications">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Leave Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Days
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-150">
                {requests.map((req) => (
                  <tr key={req.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {req.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-650">
                      {req.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-650">
                      {req.start} to {req.end}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-650">
                      {req.days}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-450">
                      {req.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${
                        req.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700'
                          : req.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {req.status === 'Pending' ? (
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" size="sm" onClick={() => handleAction(req.id, 'Rejected')}>
                            Reject
                          </Button>
                          <Button size="sm" onClick={() => handleAction(req.id, 'Approved')}>
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
