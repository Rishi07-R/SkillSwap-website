import React from 'react';

export function Card({ children, className = '', hover = false, onClick = null, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm ${
        hover ? 'transition-all duration-300 hover:shadow-md hover:border-purple-200 hover:-translate-y-0.5' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between pb-4 border-b border-slate-100 ${className}`}>
      <div>
        {title && <h3 className="font-semibold text-lg text-slate-900 tracking-tight">{title}</h3>}
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
