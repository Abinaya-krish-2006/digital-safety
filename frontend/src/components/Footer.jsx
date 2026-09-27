import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #e2e8f0',
      background: '#ffffff',
      padding: '3rem 0 2rem 0',
      marginTop: '4rem'
    }}>
      <div className="container">
        {/* Mandatory Hackathon Disclaimer (Section 32) */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start'
        }}>
          <AlertCircle size={20} style={{ color: '#2563eb', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#475569', marginBottom: '0.2rem' }}>
              Safety Disclaimer
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
              TRUSTCHAIN AI provides risk indicators and safety guidance based on the evidence provided. It does not guarantee that an account, website, seller, message, or transaction is legitimate or fraudulent. Users should independently verify important information through trusted official channels.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Shield size={18} />
            </div>
            <span style={{ fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#0f172a' }}>
              TRUSTCHAIN AI
            </span>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              — Don't just detect the threat. Break the chain.
            </span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.88rem', color: '#64748b', fontWeight: 500 }}>
            <span>Privacy-First</span>
            <span>Zero Credential Retention</span>
            <span>HackNowa 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
