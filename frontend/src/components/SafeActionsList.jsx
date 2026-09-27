import React from 'react';
import { ShieldCheck, CheckCircle } from 'lucide-react';

export default function SafeActionsList({ actions = [] }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
        <ShieldCheck size={22} style={{ color: '#16a34a' }} />
        <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>What You Should Do Right Now</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {actions.map((act, idx) => (
          <div 
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
              padding: '1rem 1.15rem',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px'
            }}
          >
            <div style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 800,
              flexShrink: 0
            }}>
              {idx + 1}
            </div>
            <div style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: 500, paddingTop: '1px', lineHeight: 1.5 }}>
              {act}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
