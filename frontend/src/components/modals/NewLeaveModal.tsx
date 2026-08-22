'use client';

import React, { useState } from 'react';
import { LeaveRequest } from '@/types/hrms';

interface NewLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaveRequests: LeaveRequest[];
  onApplyLeave: (req: Omit<LeaveRequest, 'id' | 'status' | 'appliedTime'>) => void;
  onApproveLeave: (id: string) => void;
  onRejectLeave: (id: string) => void;
  currentUserName: string;
  currentUserAvatar: string;
}

export const NewLeaveModal: React.FC<NewLeaveModalProps> = ({
  isOpen,
  onClose,
  leaveRequests,
  onApplyLeave,
  onApproveLeave,
  onRejectLeave,
  currentUserName,
  currentUserAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<'review' | 'apply'>('review');
  const [leaveType, setLeaveType] = useState<'Sick Leave' | 'Casual Leave' | 'Annual Leave' | 'Unpaid Leave'>('Sick Leave');
  const [startDate, setStartDate] = useState('2023-10-25');
  const [endDate, setEndDate] = useState('2023-10-26');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyLeave({
      employeeId: 'current-user',
      employeeName: currentUserName,
      employeeAvatar: currentUserAvatar,
      leaveType,
      startDate,
      endDate,
      daysCount: 2,
      reason: reason || 'Personal emergency leave',
    });
    setReason('');
    setActiveTab('review');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-[#E5E7EB] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        <div className="flex justify-between items-center pb-3 border-b border-[#E5E7EB] mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#191b22]">Leave Management Portal</h3>
              <p className="text-xs text-[#434653]">Review pending requests & apply for time-off</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#737784] hover:text-[#191b22] p-1 rounded-md hover:bg-[#f3f3fc]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-[#f3f3fc] rounded-lg mb-4">
          <button
            onClick={() => setActiveTab('review')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'review' ? 'bg-white text-[#003c90] shadow-2xs' : 'text-[#434653]'
            }`}
          >
            Pending Requests ({leaveRequests.filter((l) => l.status === 'Pending').length})
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
              activeTab === 'apply' ? 'bg-white text-[#003c90] shadow-2xs' : 'text-[#434653]'
            }`}
          >
            + Apply for Leave
          </button>
        </div>

        {activeTab === 'review' ? (
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {leaveRequests.length === 0 ? (
              <p className="text-center py-8 text-xs text-[#737784]">No pending leave requests.</p>
            ) : (
              leaveRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 border border-[#E5E7EB] rounded-xl hover:border-[#003c90] transition-colors flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-[#F9FAFB]"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={req.employeeAvatar}
                      alt={req.employeeName}
                      className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-[#191b22]">{req.employeeName}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#d9e2ff] text-[#001945]">
                          {req.leaveType}
                        </span>
                      </div>
                      <p className="text-xs text-[#434653] mt-0.5">{req.reason}</p>
                      <p className="text-[11px] font-mono text-[#737784] mt-0.5">
                        {req.startDate} to {req.endDate} ({req.daysCount} days) • {req.appliedTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {req.status === 'Pending' ? (
                      <>
                        <button
                          onClick={() => onApproveLeave(req.id)}
                          className="px-2.5 py-1 bg-[#22C55E] text-white text-xs font-bold rounded hover:bg-[#16a34a] transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => onRejectLeave(req.id)}
                          className="px-2.5 py-1 bg-[#EF4444] text-white text-xs font-bold rounded hover:bg-[#dc2626] transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded ${
                          req.status === 'Approved' ? 'bg-[#22C55E]/15 text-[#16a34a]' : 'bg-[#EF4444]/15 text-[#dc2626]'
                        }`}
                      >
                        {req.status}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                Leave Type
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value as any)}
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm bg-white text-[#191b22]"
              >
                <option value="Sick Leave">Sick Leave (Remaining: 6 days)</option>
                <option value="Casual Leave">Casual Leave (Remaining: 8 days)</option>
                <option value="Annual Leave">Annual Leave (Remaining: 14 days)</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#191b22] uppercase tracking-wider mb-1">
                Reason / Remarks
              </label>
              <textarea
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please describe reason for leave..."
                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-sm outline-none focus:border-[#003c90]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#434653]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#003c90] text-white text-xs font-bold rounded-lg hover:bg-[#0f52ba]"
              >
                Submit Application
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
