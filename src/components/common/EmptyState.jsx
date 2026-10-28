import React from 'react';
import { Sparkles } from 'lucide-react';

export function EmptyState({
  icon: Icon = Sparkles,
  title = 'No items found',
  description = 'There are currently no items matching your criteria.',
  action = null,
  className = ''
}) {
  return (
    <div className={`text-center py-12 px-6 bg-white rounded-2xl border border-dashed border-slate-200 ${className}`}>
      <div className="w-14 h-14 mx-auto mb-4 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-5">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
