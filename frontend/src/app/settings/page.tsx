'use client';

import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-sm text-gray-500">Configure global HR rules, tenant preferences, and user roles.</p>
        </div>

        {/* Configurations */}
        <div className="max-w-2xl space-y-6">
          <Card title="Organization Details">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Organization Name
                </label>
                <input
                  type="text"
                  defaultValue="ProHRMS Corporate"
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  HR Email Address
                </label>
                <input
                  type="email"
                  defaultValue="hr@prohrms.com"
                  className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <Button>Save Settings</Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
