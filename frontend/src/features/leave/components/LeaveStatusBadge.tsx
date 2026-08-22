import React from 'react';

interface LeaveStatusBadgeProps {
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | string;
}

export default function LeaveStatusBadge({ status }: LeaveStatusBadgeProps) {
  const styles = {
    Pending: 'bg-amber-50 text-amber-700 border-amber-100',
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-100',
    Cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const currentStyle = styles[status as keyof typeof styles] || 'bg-gray-50 text-gray-600 border-gray-150';

  return (
    <span className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full border ${currentStyle}`}>
      {status}
    </span>
  );
}
