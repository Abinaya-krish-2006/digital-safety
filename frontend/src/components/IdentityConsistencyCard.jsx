import React from 'react';
import { UserCheck, UserX, AlertTriangle } from 'lucide-react';

export default function IdentityConsistencyCard({ identityCheck }) {
  if (!identityCheck || !identityCheck.has_check) return null;

  const isConsistent = identityCheck.consistent;
  const entities = identityCheck.entities || {};

  return (
    <div className="glass-card" style={{ 
      padding: '2rem',
      borderLeft: isConsistent ? '5px solid #16a34a' : '5px solid #d97706'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          background: isConsistent ? '#dcfce7' : '#fef3c7',
          border: isConsistent ? '1px solid #86efac' : '1px solid #fcd34d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: isConsistent ? '#15803d' : '#b45309'
        }}>
          {isConsistent ? <UserCheck size={24} /> : <UserX size={24} />}
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.2rem', color: '#0f172a' }}>
            Store Name vs. Payment Name Check
          </h3>
          <span style={{
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: isConsistent ? '#15803d' : '#b45309'
          }}>
            {isConsistent ? '🟢 Names Match' : '🟠 Name Mismatch Detected'}
          </span>
        </div>
      </div>

      {/* Comparison Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '0.85rem',
        marginBottom: '1.25rem'
      }}>
        {Object.entries(entities).map(([key, val]) => (
          <div 
            key={key} 
            style={{ 
              background: '#f8fafc', 
              border: '1px solid #e2e8f0',
              borderRadius: '10px', 
              padding: '0.85rem 1rem' 
            }}
          >
            <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'capitalize', fontWeight: 600, marginBottom: '0.25rem' }}>
              {key.replace(/_/g, ' ')}
            </div>
            <div style={{ 
              fontWeight: 700, 
              color: key === 'payment_recipient' && !isConsistent ? '#dc2626' : '#0f172a',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.95rem'
            }}>
              {val}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        padding: '1rem 1.25rem', 
        background: isConsistent ? '#f0fdf4' : '#fffbeb',
        borderRadius: '10px',
        border: isConsistent ? '1px solid #86efac' : '1px solid #fcd34d',
        fontSize: '0.92rem',
        color: isConsistent ? '#166534' : '#92400e',
        lineHeight: 1.5
      }}>
        {identityCheck.summary || (
          isConsistent 
            ? "The seller's store name and payment recipient account match properly."
            : "The shop name and the person receiving the payment are completely different! This is common in social media shopping scams where scammers collect money through personal accounts."
        )}
      </div>
    </div>
  );
}
