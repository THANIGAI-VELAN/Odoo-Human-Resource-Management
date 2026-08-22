'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useLeaves } from '@/features/leave/hooks/useLeaves';
import LeaveBalanceCard from '@/features/leave/components/LeaveBalanceCard';
import LeaveTable from '@/features/leave/components/LeaveTable';
import LeaveCalendar from '@/features/leave/components/LeaveCalendar';
import LeaveForm from '@/features/leave/components/LeaveForm';
import LeaveApprovalModal from '@/features/leave/components/LeaveApprovalModal';

export default function LeavePage() {
  const {
    requests,
    balances,
    calendarEvents,
    loading,
    error,
    fetchRequests,
    fetchBalances,
    fetchCalendar,
    applyLeave,
    approveLeave,
    rejectLeave,
    cancelLeave
  } = useLeaves();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [employeeId, setEmployeeId] = useState<string>('emp-1'); // default fallback (Arjun Desai)
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    // 1. Fetch current user from /me
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const res = await fetch('http://localhost:8000/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const user = await res.json();
          setCurrentUser(user);

          // Map logged in email to employee ID
          if (user.email.includes('arjun')) {
            setEmployeeId('emp-1');
            fetchBalances('emp-1');
            fetchRequests({ employee_id: 'emp-1' });
          } else {
            // Admin or manager
            setEmployeeId('emp-2'); // Sarah Jenkins (Admin)
            fetchBalances('emp-2');
            fetchRequests(); // Fetch all for admin
          }
        } else {
          window.location.href = '/login';
        }
      } catch (err) {
        console.error(err);
        window.location.href = '/login';
      }
    };

    loadProfile();
    fetchCalendar();
  }, [fetchCalendar, fetchRequests, fetchBalances]);

  const handleApply = async (payload: any) => {
    try {
      await applyLeave(payload);
      showToast('success', 'Leave request submitted successfully.');
      setIsApplyOpen(false);
      fetchCalendar(); // refresh calendar
    } catch (err: any) {
      showToast('error', err.message || 'Failed to submit request.');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveLeave(id);
      showToast('success', 'Leave request approved successfully.');
      fetchCalendar(); // refresh calendar
    } catch (err: any) {
      showToast('error', err.message || 'Failed to approve request.');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectLeave(id);
      showToast('success', 'Leave request rejected.');
    } catch (err: any) {
      showToast('error', err.message || 'Failed to reject request.');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelLeave(id);
      showToast('success', 'Leave request cancelled.');
      fetchCalendar(); // refresh calendar
    } catch (err: any) {
      showToast('error', err.message || 'Failed to cancel request.');
    }
  };

  if (!currentUser) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Leave Management</h1>
            <p className="text-sm text-gray-500">Track and review employee vacation, casual, and sick time requests.</p>
          </div>
          <Button onClick={() => setIsApplyOpen(true)}>New Request</Button>
        </div>

        {/* Feedback Toast */}
        {toast && (
          <div className={`p-4 rounded-xl border text-sm font-semibold transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
              : 'bg-rose-50 text-rose-800 border-rose-100'
          }`}>
            {toast.message}
          </div>
        )}

        {/* Balances */}
        <LeaveBalanceCard balances={balances} loading={loading} />

        {/* Form Modal */}
        {isApplyOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="max-w-xl w-full">
              <LeaveForm
                employeeId={employeeId}
                onSubmit={handleApply}
                onCancel={() => setIsApplyOpen(false)}
                balances={balances}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Table */}
          <div className="lg:col-span-2">
            <LeaveTable
              requests={requests}
              currentUserEmail={employeeId}
              currentUserRole={currentUser.role}
              onApprove={handleApprove}
              onReject={handleReject}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>

          {/* Calendar */}
          <div className="lg:col-span-1">
            <LeaveCalendar events={calendarEvents} loading={loading} />
          </div>
        </div>

        {/* Detail/Approval Modal */}
        <LeaveApprovalModal
          request={selectedRequest}
          isOpen={!!selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          loading={loading}
        />
      </div>
    </DashboardLayout>
  );
}
