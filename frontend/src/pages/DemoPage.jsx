import React, { useState } from 'react';
import { Play, Sparkles, ArrowRight, Clock } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';

export default function DemoPage({ onSelectDemoScenario }) {
  const [loadingId, setLoadingId] = useState(null);

  const demoScenarios = [
    {
      id: 'fake_instagram_shop',
      title: 'Example 1: Fake Instagram Clothing Shop with Mismatched Name',
      tag: 'Shopping Scam',
      badge: 'VERIFY',
      description: 'An Instagram clothing shop offers a $450 luxury item for only $45 (90% off), but tells the customer to pay via UPI to a completely different personal name ("Raj Kumar").',
      signals: ['Unrealistic 90% Discount', 'Payment Name Mismatch', 'Disposable .xyz Website'],
      breakPoint: 'Verify seller identity and do not pay to unrelated personal accounts.',
      expected: 'VERIFY 🟠'
    },
    {
      id: 'otp_scam',
      title: 'Example 2: Urgent Bank Account Suspension & OTP Stealing',
      tag: 'Banking Fraud',
      badge: 'HIGH_RISK',
      description: 'An urgent SMS says your bank account has been frozen due to pending KYC and panics you into immediately sharing the 6-digit OTP code sent to your phone.',
      signals: ['Demands One-Time Password (OTP)', 'Threatens Account Suspension', 'Extreme Urgency & Panic'],
      breakPoint: 'Do not share the OTP under any circumstance.',
      expected: 'HIGH RISK 🔴'
    },
    {
      id: 'fake_job_offer',
      title: 'Example 3: Remote Job Offer Demanding "Refundable Registration Fee"',
      tag: 'Job Scam',
      badge: 'HIGH_RISK',
      description: 'A stranger on WhatsApp offers an easy work-from-home job paying $70/hr, but demands that you wire a $150 "refundable security deposit" before giving you an interview.',
      signals: ['Demands Upfront Money for a Job', 'Unverified Recruiter on Chat', 'Unrealistically High Pay Rate'],
      breakPoint: 'Do not pay any fee before independently verifying the employer.',
      expected: 'HIGH RISK 🔴'
    }
  ];

  const handleLaunchDemo = async (scenarioId) => {
    setLoadingId(scenarioId);
    try {
      const res = await fetch(`/api/demo/${scenarioId}`);
      if (!res.ok) throw new Error("Failed to load scenario data");
      const data = await res.json();
      onSelectDemoScenario(data.response);
    } catch (e) {
      console.error(e);
      alert("Failed to load demo scenario. Please check that the server is running.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 4rem 0', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.3rem', marginBottom: '0.5rem', color: '#0f172a' }}>
          Test with Real-Life Examples
        </h1>
        <p style={{ color: '#64748b', maxWidth: '650px', margin: '0 auto', fontSize: '1rem' }}>
          Don't have a suspicious message on hand? Click any of the 3 common examples below to see how TRUSTCHAIN analyzes them and guides you to safety!
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {demoScenarios.map((demo) => {
          const isLoading = loadingId === demo.id;
          return (
            <div 
              key={demo.id} 
              className="glass-card" 
              style={{ 
                padding: '2rem',
                borderLeft: demo.badge === 'HIGH_RISK' ? '5px solid #dc2626' : '5px solid #d97706'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                    <RiskBadge level={demo.badge} />
                    <span style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      {demo.tag}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', color: '#0f172a' }}>{demo.title}</h3>
                </div>

                <button 
                  className="btn btn-primary"
                  disabled={isLoading}
                  onClick={() => handleLaunchDemo(demo.id)}
                  style={{ padding: '0.65rem 1.4rem', fontSize: '0.95rem' }}
                >
                  <Play size={16} />
                  <span>{isLoading ? 'Checking...' : 'Test This Scam'}</span>
                </button>
              </div>

              <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.25rem', lineHeight: 1.55 }}>
                {demo.description}
              </p>

              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
                  Detected Warning Signs:
                </span>
                {demo.signals.map((s, idx) => (
                  <span 
                    key={idx}
                    style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      border: '1px solid #bfdbfe',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px'
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b' }}>
                <span>Intervention Point: <strong style={{ color: '#0f172a' }}>"{demo.breakPoint}"</strong></span>
                <span>Expected Result: <strong style={{ color: demo.badge === 'HIGH_RISK' ? '#dc2626' : '#d97706' }}>{demo.expected}</strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
