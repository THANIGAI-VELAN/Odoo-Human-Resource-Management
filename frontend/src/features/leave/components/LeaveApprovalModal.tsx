import React from 'react';
import LeaveStatusBadge from './LeaveStatusBadge';

interface LeaveRequest {
  id: number;
  employee_id: string;
  employee_name: string;
  employee_avatar: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_count: number;
  reason: string;
  is_half_day: boolean;
  half_day_position?: string | null;
  status: string;
  applied_time: string;
}

interface LeaveApprovalModalProps {
  request: LeaveRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: number) => Promise<void>;
  onReject: (id: number) => Promise<void>;
  loading?: boolean;
}

export default function LeaveApprovalModal({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
  loading
}: LeaveApprovalModalProps) {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-gray-250 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <div className="flex justify-between items-center pb-3 border-b border-gray-150 mb-4">
          <h3 className="text-base font-bold text-gray-900">Review Leave Request</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-4 text-sm">
          {/* Employee profile */}
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
            <img
              src={request.employee_avatar}
              alt={request.employee_name}
              className="w-10 h-10 rounded-full border border-gray-300"
            />
            <div>
              <p className="font-bold text-gray-900">{request.employee_name}</p>
              <p className="text-xs text-gray-500">ID: {request.employee_id}</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Leave Type</span>
              <span className="font-bold text-gray-800">{request.leave_type}</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Duration</span>
              <span className="font-bold text-gray-800">{request.days_count} {request.days_count === 1 ? 'Day' : 'Days'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3">
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Start Date</span>
              <span className="font-semibold text-gray-800">{request.start_date}</span>
            </div>
            <div>
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">End Date</span>
              <span className="font-semibold text-gray-800">{request.end_date}</span>
            </div>
          </div>

          {request.is_half_day && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-2 text-xs font-bold text-indigo-750">
              Half-Day scheduled for: {request.half_day_position}
            </div>
          )}

          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Reason</span>
            <p className="text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-200 mt-1 italic">
              "{request.reason || 'No description provided'}"
            </p>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-gray-400">Applied: {request.applied_time}</span>
            <LeaveStatusBadge status={request.status} />
          </div>
        </div>

        {/* Action buttons */}
        {request.status === 'Pending' && (
          <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-gray-150">
            <button
              onClick={() => {
                onReject(request.id);
                onClose();
              }}
              disabled={loading}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Reject Request
            </button>
            <button
              onClick={() => {
                onApprove(request.id);
                onClose();
              }}
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Approve Request
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
