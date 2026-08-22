import React, { useState } from 'react';
import Card from '@/components/ui/Card';

interface CalendarEvent {
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
}

interface LeaveCalendarProps {
  events: CalendarEvent[];
  loading?: boolean;
}

export default function LeaveCalendar({ events, loading }: LeaveCalendarProps) {
  // Current month views (defaults to August 2026 to align with mock/seeded dates)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(7); // 0-indexed, so 7 = August

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentMonth((m) => {
      if (m === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((m) => {
      if (m === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  };

  // Helper to generate calendar days grid
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // Sunday = 0, Monday = 1...
  };

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const startDayOffset = getFirstDayOfMonth(currentYear, currentMonth);

  const daysGrid = [];
  // Fill offset days from previous month
  for (let i = 0; i < startDayOffset; i++) {
    daysGrid.push(null);
  }
  // Fill current month days
  for (let d = 1; d <= totalDays; d++) {
    daysGrid.push(d);
  }

  // Find events on a specific day
  const getEventsForDay = (day: number) => {
    if (!day) return [];
    
    // Construct date string formatted as YYYY-MM-DD
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    return events.filter((evt) => {
      return evt.start_date <= dateStr && dateStr <= evt.end_date;
    });
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-gray-150 mb-5">
        <div>
          <h3 className="text-base font-bold text-gray-900">Leave Calendar</h3>
          <p className="text-xs text-gray-500 mt-0.5">Track out-of-office times for all staff.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
          <span className="text-sm font-bold text-gray-800">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-gray-400">Loading calendar events...</div>
      ) : (
        <div className="space-y-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-gray-400">
            {weekdays.map((w) => (
              <div key={w} className="py-1">{w}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {daysGrid.map((day, idx) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              const isToday = day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

              return (
                <div
                  key={idx}
                  className={`min-h-[75px] p-2 rounded-xl border flex flex-col justify-between ${
                    day
                      ? isToday
                        ? 'border-indigo-650 bg-indigo-50/10'
                        : 'border-gray-150 hover:border-gray-300 bg-white'
                      : 'border-transparent bg-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-xs font-bold ${
                        day
                          ? isToday
                            ? 'text-indigo-600 bg-indigo-50 h-5 w-5 flex items-center justify-center rounded-full'
                            : 'text-gray-800'
                          : 'text-transparent'
                      }`}
                    >
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="h-1.5 w-1.5 bg-rose-500 rounded-full"></span>
                    )}
                  </div>

                  {/* Day Events stack */}
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((evt) => (
                      <div
                        key={evt.id}
                        className="text-[9px] font-semibold bg-rose-50 text-rose-700 px-1 rounded truncate border border-rose-100"
                        title={`${evt.employee_name} on ${evt.leave_type}`}
                      >
                        {evt.employee_name.split(' ')[0]}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[8px] text-gray-400 font-bold pl-1">
                        +{dayEvents.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}
