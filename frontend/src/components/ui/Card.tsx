import React from 'react';

interface CardProps {
  title?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export default function Card({ title, extra, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-250 shadow-sm ${className}`}>
      {(title || extra) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
}
