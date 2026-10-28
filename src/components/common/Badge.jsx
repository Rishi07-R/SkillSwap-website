import React from 'react';

export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  };

  const variantClasses = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    accent: 'bg-pink-50 text-pink-700 border border-pink-200/60',
    reciprocal: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm',
    info: 'bg-blue-50 text-blue-700 border border-blue-200/60',
  };

  return (
    <span className={`inline-flex items-center rounded-full tracking-wide transition-all ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
}

export function ProficiencyBadge({ level = 'Intermediate' }) {
  const configs = {
    Beginner: { variant: 'info', dot: 'bg-blue-500' },
    Intermediate: { variant: 'primary', dot: 'bg-purple-500' },
    Advanced: { variant: 'accent', dot: 'bg-pink-500' },
    Expert: { variant: 'success', dot: 'bg-emerald-500' },
  };

  const config = configs[level] || configs.Intermediate;

  return (
    <Badge variant={config.variant} size="sm" className="space-x-1.5">
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{level}</span>
    </Badge>
  );
}

export function StatusBadge({ status = 'pending' }) {
  const configs = {
    pending: { label: 'Pending', variant: 'warning' },
    accepted: { label: 'Accepted', variant: 'success' },
    active: { label: 'Active Exchange', variant: 'primary' },
    completed: { label: 'Completed', variant: 'success' },
    rejected: { label: 'Declined', variant: 'danger' },
    cancelled: { label: 'Cancelled', variant: 'default' },
  };

  const config = configs[status] || { label: status, variant: 'default' };

  return <Badge variant={config.variant} size="md">{config.label}</Badge>;
}
