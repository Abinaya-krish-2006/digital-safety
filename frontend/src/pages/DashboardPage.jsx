import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  History, 
  Activity,
  Layers
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0' }}>
        <p style={{ color: '#64748b' }}>Loading dashboard data...</p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    total_analyses: 1428,
    high_risk_findings: 584,
    verify_findings: 612,
    low_concern_findings: 232,
    chains_broken: 892
  };

  const topSignals = data?.top_signals || [];
  const recentHistory = data?.recent_history || [];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 4rem 0', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <h1 style={{ fontSize: '2.2rem', color: '#0f172a' }}>Platform Overview</h1>
            <span style={{
              background: '#fef3c7',
              color: '#92400e',
              border: '1px solid #fcd34d',
              fontSize: '0.75rem',
              fontWeight: 800,
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              textTransform: 'uppercase'
            }}>
              Demo Sample Data
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Overview of scam types detected and chains broken during testing.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 700 }}>
            Total Inquiries Checked
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0f172a' }}>
            {metrics.total_analyses}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#2563eb', marginTop: '0.4rem', fontWeight: 600 }}>
            Messages, links, and stores
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '5px solid #dc2626' }}>
          <div style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 700 }}>
            Scams Intercepted (Broken)
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#dc2626' }}>
            {metrics.chains_broken}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#b91c1c', marginTop: '0.4rem', fontWeight: 600 }}>
            Stopped before money was sent
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem', borderLeft: '5px solid #d97706' }}>
          <div style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 700 }}>
            Identity Warnings Issued
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#d97706' }}>
            {metrics.verify_findings}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#92400e', marginTop: '0.4rem', fontWeight: 600 }}>
            Name mismatches & fake discounts
          </div>
        </div>
      </div>

      {/* Grid: Most Frequent Risk Signals & Recent History */}
      <div className="grid-2" style={{ gap: '2rem' }}>
        {/* Most Common Risk Signals */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Activity size={20} style={{ color: '#2563eb' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Top Scam Signs Detected</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {topSignals.map((sig, i) => (
              <div 
                key={i}
                style={{
                  padding: '0.9rem 1.1rem',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{sig.label}</div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {sig.type}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontWeight: 800, 
                    fontFamily: 'var(--font-mono)',
                    color: sig.severity === 'HIGH' ? '#dc2626' : '#d97706',
                    fontSize: '1.1rem'
                  }}>
                    {sig.count}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>cases</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Analysis Stream */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <History size={20} style={{ color: '#2563eb' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#0f172a' }}>Recent Checks</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {recentHistory.map((item) => (
              <div 
                key={item.id}
                style={{
                  padding: '0.9rem 1.1rem',
                  background: '#f8fafc',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700 }}>
                    {item.type}
                  </span>
                  <RiskBadge level={item.risk_level} size="sm" />
                </div>
                <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600, marginBottom: '0.35rem' }}>
                  {item.snippet}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b' }}>
                  <span>Safe Step: <strong style={{ color: '#2563eb' }}>{item.break_point}</strong></span>
                  <span>{item.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
