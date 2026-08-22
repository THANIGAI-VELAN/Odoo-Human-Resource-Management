'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, Search } from 'lucide-react';

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const employees = [
    { id: 'EMP-001', name: 'Alice Johnson', email: 'alice@prohrms.com', department: 'Engineering', role: 'Frontend Lead', status: 'Active' },
    { id: 'EMP-002', name: 'Bob Smith', email: 'bob@prohrms.com', department: 'Product', role: 'Product Manager', status: 'Active' },
    { id: 'EMP-003', name: 'Charlie Brown', email: 'charlie@prohrms.com', department: 'Design', role: 'UI Designer', status: 'On Leave' },
    { id: 'EMP-004', name: 'Diana Prince', email: 'diana@prohrms.com', department: 'HR', role: 'Recruiter', status: 'Active' },
    { id: 'EMP-005', name: 'Ethan Hunt', email: 'ethan@prohrms.com', department: 'Operations', role: 'Security Ops', status: 'Inactive' },
  ];

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employees Directory</h1>
            <p className="text-sm text-gray-500">Manage, search, and view profiles of all company staff.</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {/* Filters Card */}
        <Card>
          <div className="flex items-center gap-3 max-w-md bg-white border border-gray-300 rounded px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Employee ID, Name or Department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
        </Card>

        {/* Employees Table Card */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-150">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {emp.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                      <div className="text-xs text-gray-450">{emp.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-650">
                      {emp.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-650">
                      {emp.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${
                        emp.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : emp.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-indigo-650 hover:text-indigo-900">Edit</a>
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                      No employees match your search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
