import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Sparkles, 
  AlertOctagon, 
  Layers, 
  ShoppingBag, 
  Lock, 
  Link, 
  MessageSquare, 
  Smartphone, 
  UserCheck, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Play,
  Zap
} from 'lucide-react';

export default function HomePage({ setActivePage, setCheckCategory }) {
  const [q1, setQ1] = useState(false);
  const [q2, setQ2] = useState(false);
  const [q3, setQ3] = useState(false);

  const selectedCount = (q1 ? 1 : 0) + (q2 ? 1 : 0) + (q3 ? 1 : 0);
  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3.5rem' }}>
      {/* Friendly Helper Banner (For beginner users) */}
      <div style={{
        margin: '1.5rem auto 0 auto',
        maxWidth: '850px',
        background: '#eff6ff',
        border: '1px solid #bfdbfe',
        borderRadius: '12px',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          background: '#2563eb',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          👋
        </div>
        <div style={{ fontSize: '0.9rem', color: '#1e40af', lineHeight: 1.45 }}>
          <strong>New here?</strong> If someone sent you a suspicious message, asked for an OTP, or you're shopping from a social media seller, this tool tells you if it's safe and shows you what to do!
        </div>
      </div>

      {/* Hero Section */}
      <section style={{ padding: '3.5rem 0 2.5rem 0', textAlign: 'center', position: 'relative' }}>
        <h1 style={{ 
          fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', 
          lineHeight: 1.18, 
          maxWidth: '850px', 
          margin: '0 auto 1.25rem auto',
          color: '#0f172a'
        }}>
          Don't just detect the scam. <br />
          <span className="text-gradient">Break the chain.</span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: '#475569',
          maxWidth: '700px',
          margin: '0 auto 2rem auto',
          lineHeight: 1.6
        }}>
          Scammers trick people in steps—starting with a message, then a fake website, an urgent alert, and finally asking for an OTP or payment. TRUSTCHAIN AI shows you the whole trick and tells you where to stop.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
          <button 
            className="btn btn-primary"
            style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}
            onClick={() => setActivePage('check')}
          >
            <span>Check Something Now</span>
            <ArrowRight size={18} />
          </button>
          <button 
            className="btn btn-secondary"
            style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}
            onClick={() => setActivePage('demo')}
          >
            <Play size={16} style={{ color: '#2563eb' }} />
            <span>Try 3 Quick Examples</span>
          </button>
        </div>

        {/* Visual Attack-Chain Illustration (Section 14) */}
        <div style={{ 
          maxWidth: '850px', 
          margin: '0 auto',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: '1.25rem' }}>
            How Scammers Work & Where You Stop Them
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            position: 'relative'
          }}>
            {[
              { label: 'Unknown Sender', icon: '👤' },
              { label: 'Panic Message', icon: '💬' },
              { label: 'Fake Link', icon: '🔗' },
              { label: 'Asks for OTP', icon: '🔑', highlight: true },
              { label: 'Stolen Money', icon: '💳' }
            ].map((node, i) => (
              <React.Fragment key={i}>
                <div style={{
                  padding: '0.85rem 1.1rem',
                  background: node.highlight ? '#fef2f2' : '#f8fafc',
                  border: node.highlight ? '2px solid #ef4444' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  position: 'relative',
                  boxShadow: node.highlight ? '0 4px 12px rgba(239, 68, 68, 0.15)' : 'none'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{node.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: node.highlight ? '#991b1b' : '#0f172a' }}>
                    {node.label}
                  </span>

                  {node.highlight && (
                    <div style={{
                      position: 'absolute',
                      top: '-28px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#dc2626',
                      color: '#ffffff',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
                    }}>
                      🛑 STOP HERE!
                    </div>
                  )}
                </div>
                {i < 4 && (
                  <span style={{ color: '#94a3b8', fontWeight: 800, fontSize: '1.2rem' }}>
                    →
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 10-Second Instant Scam Quick-Check (Huge benefit for users in a rush) */}
        <div style={{
          maxWidth: '850px',
          margin: '2.5rem auto 0 auto',
          background: selectedCount >= 2 ? '#fef2f2' : (selectedCount === 1 ? '#fffbeb' : '#ffffff'),
          border: selectedCount >= 2 ? '2px solid #f87171' : (selectedCount === 1 ? '2px solid #fcd34d' : '1px solid #e2e8f0'),
          borderRadius: '16px',
          padding: '2rem',
          textAlign: 'left',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#2563eb',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Zap size={18} />
              </div>
              <h3 style={{ fontSize: '1.3rem', color: '#0f172a' }}>
                10-Second Quick Scam Check
              </h3>
            </div>

            <div style={{
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 800,
              background: selectedCount >= 2 ? '#fee2e2' : (selectedCount === 1 ? '#fef3c7' : '#f0fdf4'),
              color: selectedCount >= 2 ? '#dc2626' : (selectedCount === 1 ? '#b45309' : '#16a34a'),
              border: selectedCount >= 2 ? '1px solid #fca5a5' : (selectedCount === 1 ? '1px solid #fcd34d' : '1px solid #86efac')
            }}>
              {selectedCount === 0 && '🟢 Status: Clean / Select flags'}
              {selectedCount === 1 && '🟠 Status: Caution Required'}
              {selectedCount >= 2 && '🔴 Status: EXTREMELY HIGH SCAM RISK'}
            </div>
          </div>

          <p style={{ fontSize: '0.92rem', color: '#475569', marginBottom: '1.25rem' }}>
            Check the boxes below that match your situation for an instant 3-second evaluation:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.85rem 1rem',
              background: q1 ? '#eff6ff' : '#f8fafc',
              border: q1 ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: '#1e293b'
            }}>
              <input
                type="checkbox"
                checked={q1}
                onChange={(e) => setQ1(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#2563eb' }}
              />
              <span>1. An unknown person, recruiter, or supposed bank agent messaged or called me out of nowhere.</span>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.85rem 1rem',
              background: q2 ? '#eff6ff' : '#f8fafc',
              border: q2 ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: '#1e293b'
            }}>
              <input
                type="checkbox"
                checked={q2}
                onChange={(e) => setQ2(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#2563eb' }}
              />
              <span>2. They are creating panic (account blocked, electricity cut, prize expiring) and demanding immediate action.</span>
            </label>

            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.85rem 1rem',
              background: q3 ? '#eff6ff' : '#f8fafc',
              border: q3 ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 500,
              color: '#1e293b'
            }}>
              <input
                type="checkbox"
                checked={q3}
                onChange={(e) => setQ3(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: '#2563eb' }}
              />
              <span>3. They are asking for a phone OTP, bank PIN, advance registration deposit, or to install an app.</span>
            </label>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '0.92rem', color: selectedCount >= 2 ? '#b91c1c' : '#475569', fontWeight: 600 }}>
              {selectedCount === 0 && 'Select any statement that applies to see guidance.'}
              {selectedCount === 1 && '⚠️ One major trigger found. Verify with official channels before complying.'}
              {selectedCount >= 2 && '🚨 DANGER: Do NOT share codes, do NOT click links, and do NOT send money!'}
            </div>

            <button
              className="btn btn-primary"
              style={{ fontSize: '0.88rem', padding: '0.6rem 1.25rem' }}
              onClick={() => setActivePage('check')}
            >
              <span>Run Detailed Analysis</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Feature Modules Grid */}
      <section style={{ marginTop: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#0f172a' }}>
            What do you want to inspect?
          </h2>
          <p style={{ color: '#64748b' }}>
            Pick whatever suspicious item you have encountered:
          </p>
        </div>

        <div className="grid-3">
          {[
            {
              id: 'message',
              title: 'Message or OTP Request',
              icon: MessageSquare,
              tag: 'Most Common',
              desc: 'Did someone text or message saying your bank account is blocked, or asking you for an OTP code?',
              color: '#2563eb'
            },
            {
              id: 'payment',
              title: 'Payment or UPI Request',
              icon: Lock,
              tag: 'Money Safety',
              desc: 'Someone asking you to send an advance fee, registration charge, or pay to a personal UPI name?',
              color: '#0284c7'
            },
            {
              id: 'url',
              title: 'Website or Link',
              icon: Link,
              tag: 'Phishing Check',
              desc: 'Check if a website link is a fake copycat designed to steal passwords or banking credentials.',
              color: '#7c3aed'
            },
            {
              id: 'shop',
              title: 'Instagram or Online Shop',
              icon: ShoppingBag,
              tag: 'Shopping Safety',
              desc: 'Found a social media shop with 90% discount? Check if their payment name matches their store name.',
              color: '#d97706'
            },
            {
              id: 'profile',
              title: 'Profile or Social Account',
              icon: UserCheck,
              tag: 'Impersonation',
              desc: 'Check if an account is a brand-new fake profile pretending to be a company or support agent.',
              color: '#16a34a'
            },
            {
              id: 'qr',
              title: 'QR Code or App File',
              icon: Smartphone,
              tag: 'Download Check',
              desc: 'Check if a QR code or link is secretly trying to install a malicious .apk app on your phone.',
              color: '#db2777'
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div 
                key={card.id}
                className="glass-card glass-card-interactive"
                style={{ padding: '1.75rem' }}
                onClick={() => {
                  setCheckCategory(card.id);
                  setActivePage('check');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${card.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: card.color
                  }}>
                    <Icon size={24} />
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#475569',
                    background: '#f1f5f9',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '6px'
                  }}>
                    {card.tag}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                  {card.desc}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: card.color, fontSize: '0.9rem', fontWeight: 700 }}>
                  <span>Open Checker</span>
                  <ArrowRight size={16} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3 Core Pillars in White Theme */}
      <section style={{ marginTop: '4.5rem' }}>
        <div style={{ 
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '20px',
          padding: '3rem 2.5rem',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: '#2563eb' }}>
              Why It Protects You
            </span>
            <h2 style={{ fontSize: '2rem', marginTop: '0.35rem', color: '#0f172a' }}>
              Simple, Safe, and Clear
            </h2>
          </div>

          <div className="grid-3">
            <div style={{ padding: '0.5rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🔗</div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: '#0f172a' }}>Connects the Clues</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Instead of just checking one link, it connects the message, the discount, and the payment recipient to see the whole picture.
              </p>
            </div>

            <div style={{ padding: '0.5rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🛑</div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: '#0f172a' }}>Tells You Where to Stop</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                Gives you one big, clear instruction (e.g. "Do not share the OTP") so you don't have to guess what to do.
              </p>
            </div>

            <div style={{ padding: '0.5rem' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🔒</div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.4rem', color: '#0f172a' }}>100% Private</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
                We never store your passwords, bank details, or private information. Your safety is completely respected.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
