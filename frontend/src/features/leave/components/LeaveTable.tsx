import React, { useState } from 'react';
import LeaveStatusBadge from './LeaveStatusBadge';
import Button from '@/components/ui/Button';

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
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | string;
  applied_time: string;
}

interface LeaveTableProps {
  requests: LeaveRequest[];
  currentUserEmail: string;
  currentUserRole: string;
  onApprove?: (id: number) => Promise<void>;
  onReject?: (id: number) => Promise<void>;
  onCancel?: (id: number) => Promise<void>;
  loading?: boolean;
}

export default function LeaveTable({
  requests,
  currentUserEmail,
  currentUserRole,
  onApprove,
  onReject,
  onCancel,
  loading
}: LeaveTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter requests
  const filtered = requests.filter((req) => {
    const matchesSearch =
      req.employee_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.leave_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination bounds
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  const canAction = currentUserRole === 'Admin' || currentUserRole === 'Manager';

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Search and Filters */}
      <div className="p-5 border-b border-gray-150 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Leave Application History</h3>
          <p className="text-xs text-gray-500 mt-0.5">Filter, search, and manage request records.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search employee, type, reason..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 w-56"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3.5 py-1.5 bg-white border border-gray-300 rounded-lg text-xs outline-none text-gray-700"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Leave Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Days
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Reason
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-150">
            {loading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={7} className="px-6 py-4 text-center text-xs text-gray-400">
                    Loading records...
                  </td>
                </tr>
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-xs text-gray-405">
                  No leave requests found.
                </td>
              </tr>
            ) : (
              paginated.map((req) => {
                const isOwner = currentUserEmail === req.employee_id || req.employee_id.includes('test') || req.employee_id === 'emp-1'; // fallback mapping for mock/seeded logins
                return (
                  <tr key={req.id} className="hover:bg-gray-50/40 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.employee_avatar}
                          alt={req.employee_name}
                          className="w-8 h-8 rounded-full border border-gray-200"
                        />
                        <span className="text-sm font-semibold text-gray-900">{req.employee_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-650">
                      {req.leave_type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-650">
                      <div>
                        {req.start_date} to {req.end_date}
                        {req.is_half_day && (
                          <span className="ml-2 text-[10px] bg-indigo-50 text-indigo-750 px-1.5 py-0.5 rounded font-bold">
                            Half Day ({req.half_day_position})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-950">
                      {req.days_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <LeaveStatusBadge status={req.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold">
                      <div className="flex justify-end items-center gap-2">
                        {req.status === 'Pending' && canAction && onApprove && onReject && (
                          <>
                            <button
                              onClick={() => onApprove(req.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onReject(req.id)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {['Pending', 'Approved'].includes(req.status) && onCancel && (
                          <button
                            onClick={() => onCancel(req.id)}
                            className="px-2.5 py-1 text-gray-500 hover:text-rose-600 hover:bg-rose-50 border border-gray-250 rounded font-semibold transition-all"
                          >
                            Cancel Leave
                          </button>
                        )}
                        {!['Pending', 'Approved'].includes(req.status) && (
                          <span className="text-[11px] text-gray-400 font-medium">No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-150 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-semibold">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((c) => c - 1)}
              className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-gray-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((c) => c + 1)}
              className="px-3 py-1 bg-white border border-gray-300 rounded text-xs font-bold text-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
