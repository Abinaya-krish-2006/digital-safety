import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle } from 'lucide-react';

export default function RiskBadge({ level, size = 'md' }) {
  if (level === 'HIGH_RISK') {
    return (
      <span className={`badge badge-high ${size === 'lg' ? 'text-base py-1 px-3' : ''}`}>
        <ShieldAlert size={size === 'lg' ? 18 : 14} />
        <span>HIGH RISK 🔴</span>
      </span>
    );
  }
  if (level === 'VERIFY') {
    return (
      <span className={`badge badge-verify ${size === 'lg' ? 'text-base py-1 px-3' : ''}`}>
        <AlertTriangle size={size === 'lg' ? 18 : 14} />
        <span>VERIFY 🟠</span>
      </span>
    );
  }
  return (
    <span className={`badge badge-low ${size === 'lg' ? 'text-base py-1 px-3' : ''}`}>
      <CheckCircle size={size === 'lg' ? 18 : 14} />
      <span>LOW CONCERN 🟢</span>
    </span>
  );
}
