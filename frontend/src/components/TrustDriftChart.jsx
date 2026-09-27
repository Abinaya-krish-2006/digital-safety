import React from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';

export default function TrustDriftChart({ drift = [] }) {
  if (!drift || drift.length === 0) return null;

  const maxPercentage = Math.max(...drift.map(d => d.percentage), 50);

  return (
    <div className="glass-card" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <TrendingUp size={20} style={{ color: '#2563eb' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>How the Scam Builds Trust Before Striking</h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Scammers rarely ask for money or passwords right away. Here is how they gradually build pressure:
          </p>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="drift-bar-container">
        <div className="drift-fill" style={{ width: `${maxPercentage}%` }} />
      </div>

      {/* Individual Progression Steps */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${drift.length}, 1fr)`, gap: '0.75rem' }}>
        {drift.map((item, idx) => (
          <div 
            key={idx}
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                  Phase {idx + 1}
                </span>
                <span style={{ 
                  fontSize: '0.9rem', 
                  fontFamily: 'var(--font-mono)', 
                  fontWeight: 800,
                  color: item.percentage > 70 ? '#dc2626' : (item.percentage > 40 ? '#d97706' : '#16a34a')
                }}>
                  {item.percentage}%
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a', marginBottom: '0.35rem' }}>
                {item.step}
              </div>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4 }}>
              {item.note}
            </div>
          </div>
        ))}
      </div>

      {/* Required Canonical Spec Disclaimer */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        marginTop: '1.25rem', 
        paddingTop: '0.85rem', 
        borderTop: '1px solid #e2e8f0',
        fontSize: '0.78rem', 
        color: '#64748b' 
      }}>
        <AlertCircle size={15} style={{ color: '#2563eb' }} />
        <span>Illustrative trust progression based on detected conversation signals.</span>
      </div>
    </div>
  );
}
