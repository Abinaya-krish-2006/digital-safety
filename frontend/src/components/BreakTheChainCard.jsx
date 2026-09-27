import React, { useState } from 'react';
import { AlertOctagon, Copy, Check, MessageSquareOff } from 'lucide-react';

export default function BreakTheChainCard({ breakPoint, summary }) {
  const [copied, setCopied] = useState(false);

  if (!breakPoint) return null;

  const safeReplyText = "I do not share verification codes, OTPs, or transfer money to personal accounts. I will verify this matter independently through official customer support channels.";

  const handleCopy = () => {
    navigator.clipboard.writeText(safeReplyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="break-chain-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1rem' }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#dc2626',
          flexShrink: 0
        }}>
          <AlertOctagon size={32} />
        </div>
        <div>
          <div style={{ 
            fontSize: '0.8rem', 
            fontWeight: 800, 
            letterSpacing: '0.08em', 
            color: '#dc2626', 
            textTransform: 'uppercase',
            marginBottom: '0.25rem'
          }}>
            Most Important Action
          </div>
          <h2 style={{ fontSize: '1.75rem', color: '#991b1b', lineHeight: 1.2 }}>
            🛑 BREAK THE CHAIN HERE
          </h2>
        </div>
      </div>

      <div style={{
        background: '#ffffff',
        border: '2px solid #f87171',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        margin: '1.25rem 0',
        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)'
      }}>
        <div style={{ 
          fontSize: '1.3rem', 
          fontWeight: 800, 
          color: '#b91c1c',
          fontFamily: 'var(--font-heading)'
        }}>
          👉 "{breakPoint}"
        </div>
      </div>

      <p style={{ color: '#7f1d1d', fontSize: '0.95rem', fontWeight: 500, lineHeight: 1.5, marginBottom: '1.25rem' }}>
        This is the exact moment where you can stop the attacker before losing money, sharing private OTP codes, or giving away personal account details.
      </p>

      {/* Helpful Feature for Real Users: Copy Safe Response */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid #fca5a5',
        borderRadius: '10px',
        padding: '0.9rem 1.15rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <MessageSquareOff size={18} style={{ color: '#dc2626' }} />
          <span style={{ fontSize: '0.88rem', color: '#991b1b', fontWeight: 600 }}>
            Want to reply to the sender?
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="btn"
          style={{
            background: copied ? '#dcfce7' : '#ffffff',
            color: copied ? '#15803d' : '#991b1b',
            border: copied ? '1px solid #86efac' : '1px solid #f87171',
            padding: '0.45rem 0.95rem',
            fontSize: '0.82rem',
            fontWeight: 700
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied Safe Reply!' : 'Copy Safe Reply to Clipboard'}</span>
        </button>
      </div>
    </div>
  );
}
