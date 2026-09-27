import React, { useState } from 'react';
import { 
  ArrowLeft, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Cpu, 
  Sparkles, 
  Code2, 
  Info,
  ShieldCheck,
  Share2
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import BreakTheChainCard from '../components/BreakTheChainCard';
import AttackChainGraph from '../components/AttackChainGraph';
import TrustDriftChart from '../components/TrustDriftChart';
import IdentityConsistencyCard from '../components/IdentityConsistencyCard';
import SafeActionsList from '../components/SafeActionsList';

export default function ResultPage({ result, onBack, onReset }) {
  const [expertMode, setExpertMode] = useState(false);

  if (!result) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <h2 style={{ color: '#0f172a' }}>No analysis loaded yet.</h2>
        <button className="btn btn-primary" onClick={onReset} style={{ marginTop: '1rem' }}>
          Check Something Now
        </button>
      </div>
    );
  }

  const {
    risk_level,
    risk_score,
    summary,
    source,
    signals = [],
    attack_chain = [],
    break_point = '',
    safe_actions = [],
    trust_drift = [],
    identity_check,
    evidence = {}
  } = result;

  const isHighRisk = risk_level === 'HIGH_RISK';
  const isVerify = risk_level === 'VERIFY';

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 5rem 0', maxWidth: '950px', margin: '0 auto' }}>
      {/* Top Bar Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          className="btn btn-secondary"
          onClick={onBack}
          style={{ fontSize: '0.88rem', padding: '0.55rem 1rem' }}
        >
          <ArrowLeft size={16} />
          <span>Edit Information</span>
        </button>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => setExpertMode(!expertMode)}
            style={{ 
              fontSize: '0.85rem', 
              padding: '0.55rem 0.95rem',
              borderColor: expertMode ? '#2563eb' : '#cbd5e1',
              color: expertMode ? '#2563eb' : '#475569'
            }}
          >
            <Code2 size={16} />
            <span>{expertMode ? 'Simple View' : 'Technical Details'}</span>
          </button>

          <button 
            className="btn btn-secondary"
            onClick={onReset}
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.95rem' }}
          >
            <RotateCcw size={16} />
            <span>Check Another</span>
          </button>
        </div>
      </div>

      {/* 1. Large Risk Assessment Header (Section 16) */}
      <div className="glass-card" style={{
        padding: '2.5rem',
        marginBottom: '2rem',
        borderLeft: isHighRisk 
          ? '6px solid #dc2626' 
          : (isVerify ? '6px solid #d97706' : '6px solid #16a34a'),
        background: isHighRisk 
          ? 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)' 
          : (isVerify ? 'linear-gradient(135deg, #fffbeb 0%, #ffffff 100%)' : '#ffffff')
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
              <RiskBadge level={risk_level} size="lg" />
              
              <span className="badge badge-source">
                {source === 'ai' ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#2563eb' }}>
                    <Sparkles size={12} /> Deep Threat Analysis
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#475569' }}>
                    <Cpu size={12} /> Heuristic Pattern Check
                  </span>
                )}
              </span>
            </div>

            <h1 style={{ fontSize: '2.2rem', color: '#0f172a', lineHeight: 1.25 }}>
              {isHighRisk && 'Critical Scam Risk Detected!'}
              {isVerify && 'Caution: Verification Recommended'}
              {risk_level === 'LOW_CONCERN' && 'Looks Low Concern — Stay Cautious'}
            </h1>
          </div>

          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '1rem 1.6rem',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
              Calculated Risk Score
            </div>
            <div style={{ 
              fontSize: '2.4rem', 
              fontWeight: 800, 
              fontFamily: 'var(--font-mono)',
              color: isHighRisk ? '#dc2626' : (isVerify ? '#d97706' : '#16a34a')
            }}>
              {risk_score}<span style={{ fontSize: '1.1rem', color: '#94a3b8' }}>/100</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: '1.1rem', color: '#334155', lineHeight: 1.6, maxWidth: '820px' }}>
          {summary}
        </p>
      </div>

      {/* 2. Signature Intervention Point: BREAK THE CHAIN (Section 10 & 16) */}
      <div style={{ marginBottom: '2rem' }}>
        <BreakTheChainCard breakPoint={break_point} summary={summary} />
      </div>

      {/* 3. Cross-Platform Identity Consistency Card (Section 21) */}
      {identity_check && identity_check.has_check && (
        <div style={{ marginBottom: '2rem' }}>
          <IdentityConsistencyCard identityCheck={identity_check} />
        </div>
      )}

      {/* 4. Why This Was Flagged — Signal Cards (Section 16) */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem', color: '#0f172a' }}>
          Why Was This Flagged? ({signals.length} Warning Signals Detected)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {signals.map((sig, idx) => (
            <div 
              key={idx}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.15rem',
                borderLeft: sig.severity === 'HIGH' 
                  ? '5px solid #dc2626' 
                  : (sig.severity === 'MEDIUM' ? '5px solid #d97706' : '5px solid #16a34a')
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                <span style={{ 
                  fontWeight: 700, 
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-heading)',
                  color: sig.severity === 'HIGH' ? '#991b1b' : '#0f172a'
                }}>
                  {sig.type.replace(/_/g, ' ')}
                </span>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 800, 
                  padding: '0.2rem 0.55rem', 
                  borderRadius: '6px',
                  background: sig.severity === 'HIGH' ? '#fee2e2' : '#fef3c7',
                  color: sig.severity === 'HIGH' ? '#dc2626' : '#d97706',
                  textTransform: 'uppercase'
                }}>
                  {sig.severity}
                </span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.5 }}>
                {sig.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Attack Chain Interactive Visualization (Section 7 & 16) */}
      <div style={{ marginBottom: '2rem' }}>
        <AttackChainGraph chain={attack_chain} breakPoint={break_point} riskLevel={risk_level} />
      </div>

      {/* 6. Trust Drift Progression (Section 11) */}
      {trust_drift && trust_drift.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <TrustDriftChart drift={trust_drift} />
        </div>
      )}

      {/* 7. What Should You Do? Safe Actions (Section 16) */}
      <div style={{ marginBottom: '2rem' }}>
        <SafeActionsList actions={safe_actions} />
      </div>

      {/* Emergency Immediate Recovery Steps (Crucial for real users who already sent money) */}
      {isHighRisk && (
        <div className="glass-card" style={{ 
          padding: '1.75rem', 
          marginBottom: '2rem', 
          borderLeft: '5px solid #dc2626',
          background: '#fff1f2'
        }}>
          <h3 style={{ fontSize: '1.25rem', color: '#9f1239', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🚨 Did you already send money or share an OTP?</span>
          </h3>
          <p style={{ fontSize: '0.92rem', color: '#881337', marginBottom: '1rem', lineHeight: 1.5 }}>
            Do not panic. Act within the first 1–2 hours (the "Golden Hour") to maximize fund recovery:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
            <div style={{ background: '#ffffff', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #fecdd3' }}>
              <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                1. Call Your Bank Immediately
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                Call the 24/7 fraud helpline on the back of your card. Request an immediate freeze on the recipient's transaction.
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #fecdd3' }}>
              <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                2. Dial Cybercrime Helpline 1930
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                Dial 1930 (Citizen Financial Cyber Fraud Reporting System) or file a report at cybercrime.gov.in.
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #fecdd3' }}>
              <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                3. Reset Passwords & 2FA
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                Change your net banking and email passwords, and sign out of all active web and mobile sessions.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. Evidence & Optional Expert View (Section 16 & 17) */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={20} style={{ color: '#2563eb' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>Information Analyzed</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Real data provided by user
          </span>
        </div>

        <div style={{
          background: '#f8fafc',
          borderRadius: '10px',
          padding: '1.25rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.85rem',
          color: '#334155',
          overflowX: 'auto',
          border: '1px solid #e2e8f0'
        }}>
          {expertMode ? (
            <pre>{JSON.stringify(result, null, 2)}</pre>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              {Object.entries(evidence).map(([k, v]) => (
                <div key={k}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>{k}: </span>
                  <span style={{ color: '#0f172a', fontWeight: 600 }}>{String(v)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
