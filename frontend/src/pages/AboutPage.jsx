import React from 'react';
import { Shield, Lock, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AboutPage() {
  const steps = [
    { title: '1. You provide the evidence', desc: 'Paste the message, upload a screenshot, enter a website link, or enter a seller\'s name and UPI account.' },
    { title: '2. We extract the warning signs', desc: 'Our engine looks for urgency, panic language, OTP requests, fake domain names, and payment identity mismatches.' },
    { title: '3. We check for identity mismatches', desc: 'If an Instagram seller called "Luxe Shoes" asks you to pay "Raj Kumar", we immediately flag that mismatch.' },
    { title: '4. We build the step-by-step Attack Chain', desc: 'We show you the sequence of how the scam is progressing from contact to the danger point.' },
    { title: '5. We tell you exactly where to stop', desc: 'You get a single, clear, highlighted intervention card showing you how to break the chain and stay safe.' }
  ];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 4rem 0', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.75rem', color: '#0f172a' }}>
          How TRUSTCHAIN Works
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
          A simple, powerful digital safety tool that connects scattered clues into an easy-to-understand attack chain so you can stop scams before they happen.
        </p>
      </div>

      {/* How it Works Flow */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Layers size={22} style={{ color: '#2563eb' }} />
          <span>The 5 Steps of Defense</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {steps.map((st, i) => (
            <div 
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1.25rem',
                padding: '1.15rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.95rem',
                flexShrink: 0
              }}>
                {i + 1}
              </div>

              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.25rem' }}>
                  {st.title}
                </div>
                <div style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.5 }}>
                  {st.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy-First Design (Section 18) */}
      <div className="glass-card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Lock size={22} style={{ color: '#16a34a' }} />
          <span>Our Privacy Commitment to You</span>
        </h2>

        <div className="grid-2">
          <div style={{ padding: '0.5rem' }}>
            <h4 style={{ color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.4rem' }}>Zero Password or Credential Storage</h4>
            <p style={{ fontSize: '0.9rem', color: '#475569' }}>
              We will never ask you for your real bank password, CVV, or confidential PIN.
            </p>
          </div>

          <div style={{ padding: '0.5rem' }}>
            <h4 style={{ color: '#0f172a', fontSize: '1.1rem', marginBottom: '0.4rem' }}>No Message Logging</h4>
            <p style={{ fontSize: '0.9rem', color: '#475569' }}>
              Your messages and screenshots are analyzed in real time and are not stored in any public database.
            </p>
          </div>
        </div>
      </div>

      {/* Official Mandatory Disclaimer (Section 32) */}
      <div style={{
        background: '#fff1f2',
        border: '1px solid #fecdd3',
        borderRadius: '14px',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
          <AlertCircle size={24} style={{ color: '#e11d48', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: '#9f1239', fontSize: '1.05rem', marginBottom: '0.35rem', fontWeight: 700 }}>
              Disclaimer (Section 32)
            </h4>
            <p style={{ color: '#881337', fontSize: '0.9rem', lineHeight: 1.6 }}>
              "TRUSTCHAIN AI provides risk indicators and safety guidance based on the evidence provided. It does not guarantee that an account, website, seller, message, or transaction is legitimate or fraudulent. Users should independently verify important information through trusted official channels."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
