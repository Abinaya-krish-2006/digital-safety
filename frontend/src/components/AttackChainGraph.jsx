import React, { useState } from 'react';
import { ArrowDown, Shield, AlertOctagon, CheckCircle2, Info } from 'lucide-react';

export default function AttackChainGraph({ chain = [], breakPoint = '', riskLevel = 'VERIFY' }) {
  const [selectedNode, setSelectedNode] = useState(null);

  if (!chain || chain.length === 0) {
    return <div style={{ color: 'var(--text-muted)' }}>No attack chain elements generated.</div>;
  }

  return (
    <div className="glass-card" style={{ padding: '2rem', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: '#0f172a' }}>
            Attack Chain: How the Scam Happens Step-by-Step
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b' }}>
            Follow the chain from the first message to the danger point. Click any step to understand how it works.
          </p>
        </div>
        <span style={{ fontSize: '0.78rem', color: '#64748b', background: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>
          💡 Click a step for details
        </span>
      </div>

      {/* Interactive Kill-Chain Flow */}
      <div className="attack-chain-flow">
        {chain.map((step, idx) => {
          const isBreakPoint = breakPoint && (
            (step.toLowerCase().includes("otp") && breakPoint.toLowerCase().includes("otp")) ||
            (step.toLowerCase().includes("payment") && breakPoint.toLowerCase().includes("pay")) ||
            (step.toLowerCase().includes("identity") && breakPoint.toLowerCase().includes("ident")) ||
            (step.toLowerCase().includes("link") && breakPoint.toLowerCase().includes("link")) ||
            idx === chain.length - 1
          );

          const isLast = idx === chain.length - 1;
          const isSelected = selectedNode === idx;

          return (
            <div key={idx} className="flow-step-wrapper">
              <div className="flow-step-indicator">
                <div 
                  className={`flow-step-dot ${isBreakPoint ? 'is-breakpoint' : ''}`}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => setSelectedNode(idx)}
                >
                  {isBreakPoint ? '🛑' : idx + 1}
                </div>
                {!isLast && <div className="flow-step-line" />}
              </div>

              <div 
                className="flow-step-content"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedNode(idx)}
              >
                <div style={{
                  background: isSelected 
                    ? '#eff6ff' 
                    : (isBreakPoint ? '#fef2f2' : '#ffffff'),
                  border: isSelected 
                    ? '2px solid #2563eb' 
                    : (isBreakPoint ? '2px solid #f87171' : '1px solid #e2e8f0'),
                  borderRadius: '12px',
                  padding: '1.1rem 1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.2s ease'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
                      <span style={{ 
                        fontWeight: 700, 
                        color: isBreakPoint ? '#991b1b' : '#0f172a',
                        fontSize: '1.05rem' 
                      }}>
                        {step}
                      </span>
                      {isBreakPoint && (
                        <span style={{
                          background: '#fee2e2',
                          color: '#dc2626',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.55rem',
                          borderRadius: '6px',
                          textTransform: 'uppercase'
                        }}>
                          Stop Here
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      Step {idx + 1} of {chain.length}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    {isBreakPoint ? (
                      <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '0.9rem' }}>
                        🛑 STOP HERE
                      </span>
                    ) : (
                      <span style={{ color: '#64748b', fontSize: '0.82rem', fontWeight: 500 }}>
                        Phase {idx + 1}
                      </span>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div style={{
                    marginTop: '0.5rem',
                    padding: '0.85rem 1.1rem',
                    background: '#f8fafc',
                    borderLeft: '4px solid #2563eb',
                    borderRadius: '0 8px 8px 0',
                    fontSize: '0.88rem',
                    color: '#334155',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}>
                    <strong style={{ color: '#0f172a' }}>What happens here: </strong>
                    In this step, the sender tries to build confidence, create panic, or prompt you to click or send money. If you stop before this point, the scam fails!
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
