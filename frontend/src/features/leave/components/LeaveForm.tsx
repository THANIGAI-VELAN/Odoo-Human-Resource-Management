import React, { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';

interface LeaveFormProps {
  employeeId: string;
  onSubmit: (payload: any) => Promise<void>;
  onCancel: () => void;
  balances: any;
}

export default function LeaveForm({ employeeId, onSubmit, onCancel, balances }: LeaveFormProps) {
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [halfDayPosition, setHalfDayPosition] = useState('Morning');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [durationPreview, setDurationPreview] = useState<number | null>(null);

  // Client side duration calculation preview excluding weekends
  useEffect(() => {
    if (!startDate || !endDate) {
      setDurationPreview(null);
      return;
    }
    if (isHalfDay) {
      setDurationPreview(0.5);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) {
      setDurationPreview(null);
      return;
    }

    let count = 0;
    const current = new Date(start);
    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) { // Exclude Sun (0) and Sat (6)
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    setDurationPreview(count);
  }, [startDate, endDate, isHalfDay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    if (!startDate || !endDate) {
      setErr('Please select both start and end dates.');
      setLoading(false);
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setErr('End date cannot be prior to start date.');
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        employee_id: employeeId,
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
        is_half_day: isHalfDay,
        half_day_position: isHalfDay ? halfDayPosition : null,
      });
      // Reset form
      setStartDate('');
      setEndDate('');
      setReason('');
      setIsHalfDay(false);
    } catch (error: any) {
      setErr(error.message || 'An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  const getRemainingBalance = () => {
    if (!balances) return 'Loading...';
    if (leaveType === 'Annual Leave') return `${balances.annual_leave} days available`;
    if (leaveType === 'Sick Leave') return `${balances.sick_leave} days available`;
    if (leaveType === 'Casual Leave') return `${balances.casual_leave} days available`;
    return 'Unlimited (unpaid)';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
      <div className="border-b border-gray-100 pb-3 mb-4">
        <h3 className="text-base font-bold text-gray-900">Apply for Time Off</h3>
        <p className="text-xs text-gray-500">Submit a new leave application to your manager.</p>
      </div>

      {err && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-xs font-semibold text-rose-700">
          {err}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Leave Type */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Leave Type
          </label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Annual Leave">Annual Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">Casual Leave</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
          </select>
          <p className="text-xs font-semibold text-indigo-600 mt-2">{getRemainingBalance()}</p>
        </div>

        {/* Half Day Checkbox */}
        <div className="flex flex-col justify-end">
          <label className="flex items-center gap-3 py-3 text-sm font-semibold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isHalfDay}
              onChange={(e) => {
                setIsHalfDay(e.target.checked);
                if (e.target.checked) {
                  // Set start and end date identical if half day
                  if (startDate) setEndDate(startDate);
                }
              }}
              className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
            />
            <span>Apply for Half-Day Leave</span>
          </label>
        </div>
      </div>

      {/* Date Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Start Date
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (isHalfDay) setEndDate(e.target.value);
            }}
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-850 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            End Date
          </label>
          <input
            type="date"
            required
            disabled={isHalfDay}
            value={isHalfDay ? startDate : endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-850 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>
      </div>

      {/* Half Day Position Selection */}
      {isHalfDay && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Half-Day Schedule
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="halfDayPos"
                checked={halfDayPosition === 'Morning'}
                onChange={() => setHalfDayPosition('Morning')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>Morning Shift</span>
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="halfDayPos"
                checked={halfDayPosition === 'Afternoon'}
                onChange={() => setHalfDayPosition('Afternoon')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>Afternoon Shift</span>
            </label>
          </div>
        </div>
      )}

      {/* Duration Preview */}
      {durationPreview !== null && (
        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-xs font-bold text-indigo-700 flex items-center justify-between">
          <span>Chargeable leave duration:</span>
          <span>{durationPreview} {durationPreview === 1 ? 'day' : 'days'} (excl. weekends)</span>
        </div>
      )}

      {/* Reason */}
      <div>
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
          Reason / Description
        </label>
        <textarea
          rows={3}
          required
          placeholder="Please describe why you are taking leave..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-850 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </div>
    </form>
  );
}
