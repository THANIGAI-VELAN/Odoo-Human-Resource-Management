'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { DollarSign, CheckCircle, RefreshCw } from 'lucide-react';

export default function PayrollPage() {
  const payrolls = [
    { period: 'August 2026', totalEmployees: 142, grossAmount: '$213,000', status: 'Processed', date: '2026-08-20' },
    { period: 'July 2026', totalEmployees: 140, grossAmount: '$210,000', status: 'Released', date: '2026-07-28' },
    { period: 'June 2026', totalEmployees: 138, grossAmount: '$207,000', status: 'Released', date: '2026-06-28' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payroll runs</h1>
            <p className="text-sm text-gray-500">Review monthly calculations, salary disbursements, and compliance.</p>
          </div>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Process Payroll
          </Button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Gross Salaries (Aug)</span>
              <DollarSign className="h-5 w-5 text-indigo-500" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">$213,000</p>
            <span className="text-xs text-emerald-600 font-medium">1.4% change vs last month</span>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Avg Salary / Employee</span>
              <DollarSign className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">$1,500</p>
            <span className="text-xs text-gray-400">Calculated from active contracts</span>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Last Payroll Release</span>
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <p className="text-2xl font-semibold text-gray-900 mt-2">Aug 20, 2026</p>
            <span className="text-xs text-gray-400">All payouts finalized successfully</span>
          </Card>
        </div>

        {/* Payroll History Table */}
        <Card title="Payroll Calculation History">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total Employees
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Gross Payout
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Processed Date
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
                {payrolls.map((payroll) => (
                  <tr key={payroll.period}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {payroll.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-650">
                      {payroll.totalEmployees} employees
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {payroll.grossAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-650">
                      {payroll.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${
                        payroll.status === 'Released'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}>
                        {payroll.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-indigo-650 hover:text-indigo-900">View Details</a>
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
