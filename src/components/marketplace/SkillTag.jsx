import React from 'react';
import { Badge } from '../common/Badge';

export function SkillTag({ skillName, category, proficiency = 'Intermediate', type = 'offered', showProficiency = true }) {
  const isOffered = type === 'offered';

  return (
    <div
      className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-medium border transition-all ${
        isOffered
          ? 'bg-purple-50/70 border-purple-200/80 text-purple-900 hover:bg-purple-100/70'
          : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900 hover:bg-emerald-100/70'
      }`}
    >
      <span className="font-semibold">{skillName}</span>
      {showProficiency && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-md ${
            proficiency === 'Expert' ? 'bg-purple-200 text-purple-800 font-bold' :
            proficiency === 'Advanced' ? 'bg-purple-100 text-purple-700 font-medium' :
            'bg-slate-200 text-slate-700'
          }`}
        >
          {proficiency}
        </span>
      )}
    </div>
  );
}
