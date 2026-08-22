import React from 'react';
import Card from '@/components/ui/Card';
import { Calendar, ShieldAlert, Award } from 'lucide-react';

interface LeaveBalanceCardProps {
  balances: {
    annual_leave: number;
    sick_leave: number;
    casual_leave: number;
    annual_leave_taken: number;
    sick_leave_taken: number;
    casual_leave_taken: number;
  } | null;
  loading?: boolean;
}

export default function LeaveBalanceCard({ balances, loading }: LeaveBalanceCardProps) {
  if (loading || !balances) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-white border border-gray-200 rounded-xl p-6 h-32">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const items = [
    {
      title: 'Annual Leave',
      available: balances.annual_leave,
      taken: balances.annual_leave_taken,
      icon: Award,
      colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      progressColor: 'bg-indigo-600',
      total: balances.annual_leave + balances.annual_leave_taken || 18,
    },
    {
      title: 'Sick Leave',
      available: balances.sick_leave,
      taken: balances.sick_leave_taken,
      icon: ShieldAlert,
      colorClass: 'text-rose-600 bg-rose-50 border-rose-100',
      progressColor: 'bg-rose-600',
      total: balances.sick_leave + balances.sick_leave_taken || 12,
    },
    {
      title: 'Casual Leave',
      available: balances.casual_leave,
      taken: balances.casual_leave_taken,
      icon: Calendar,
      colorClass: 'text-amber-600 bg-amber-50 border-amber-100',
      progressColor: 'bg-amber-600',
      total: balances.casual_leave + balances.casual_leave_taken || 10,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item) => {
        const Icon = item.icon;
        const percent = Math.min(100, Math.round((item.taken / item.total) * 100)) || 0;

        return (
          <div
            key={item.title}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-500">{item.title}</span>
                <div className={`p-2.5 rounded-xl border ${item.colorClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                  {item.available} <span className="text-sm font-semibold text-gray-400">Available</span>
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-semibold text-gray-500">
                <span>{item.taken} Days Used</span>
                <span>{percent}% Used</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className={`${item.progressColor} h-full transition-all duration-500`}
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
