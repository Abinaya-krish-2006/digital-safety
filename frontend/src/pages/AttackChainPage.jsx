import React, { useState } from 'react';
import { AlertOctagon, Shield, ArrowRight, Play, CheckCircle } from 'lucide-react';
import AttackChainGraph from '../components/AttackChainGraph';
import BreakTheChainCard from '../components/BreakTheChainCard';

export default function AttackChainPage() {
  const templates = [
    {
      id: 'banking_kyc',
      name: 'Bank KYC Scam & Phone Takeover',
      risk: 'HIGH_RISK',
      chain: [
        'Urgent Fake Bank SMS Received',
        'Warning of Account Suspension within 24 Hours',
        'Customer Support Number Provided',
        'Scammer Tells You to Install Screen Sharing App',
        'Scammer Reads OTP and Drains Bank Account'
      ],
      breakPoint: 'Do not install remote apps (AnyDesk/TeamViewer) or grant screen-sharing permissions.',
      summary: 'Threat actor leverages panic and bank authority to take over the victim phone screen.'
    },
    {
      id: 'ecommerce_mismatch',
      name: 'Fake Social Media Shopping Store',
      risk: 'VERIFY',
      chain: [
        'Instagram Video Ad for Luxury Shoes',
        'Unbelievable 90% Clearance Discount',
        'Customer Messages Seller via Direct Message',
        'Seller Tells Customer to Transfer to Personal UPI Account',
        'Payment Sent — Seller Blocks Customer'
      ],
      breakPoint: 'Verify seller merchant credentials and refuse peer-to-peer transfers for store purchases.',
      summary: 'Counterfeit shop diverts customer payment away from protected checkouts to personal handles.'
    },
    {
      id: 'job_recruiter',
      name: 'Fake Remote Job with Advance Fee',
      risk: 'HIGH_RISK',
      chain: [
        'WhatsApp Contact Claiming to be a Corporate Recruiter',
        'Offers $60/hr for Easy Typing or Data Entry',
        'Short Online Chat "Interview"',
        'Demands $150 "Refundable Equipment Security Deposit"',
        'Money Sent — Recruiter Deletes Chat and Vanishes'
      ],
      breakPoint: 'Do not send money for job equipment, training, or candidate registration.',
      summary: 'Advance-fee employment fraud that exploits job-seeker interest with upfront fee demands.'
    }
  ];

  const [activeTemplate, setActiveTemplate] = useState(templates[0]);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 4rem 0', maxWidth: '950px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.3rem', marginBottom: '0.5rem', color: '#0f172a' }}>
          Explore Common Attack Chains
        </h1>
        <p style={{ color: '#64748b', maxWidth: '650px', margin: '0 auto', fontSize: '1rem' }}>
          Scams don't happen randomly. They follow a predictable series of psychological steps. Pick an attack below to see how it works and where you can break it.
        </p>
      </div>

      {/* Template Switcher */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => setActiveTemplate(tpl)}
            className="glass-card"
            style={{
              padding: '0.85rem 1.4rem',
              borderRadius: '12px',
              border: activeTemplate.id === tpl.id ? '2px solid #2563eb' : '1px solid #e2e8f0',
              background: activeTemplate.id === tpl.id ? '#eff6ff' : '#ffffff',
              color: activeTemplate.id === tpl.id ? '#2563eb' : '#475569',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.92rem',
              transition: 'all 0.15s ease'
            }}
          >
            {tpl.name}
          </button>
        ))}
      </div>

      {/* Main Chain Visualizer */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <BreakTheChainCard breakPoint={activeTemplate.breakPoint} summary={activeTemplate.summary} />
        <AttackChainGraph chain={activeTemplate.chain} breakPoint={activeTemplate.breakPoint} riskLevel={activeTemplate.risk} />
      </div>

      {/* Educational Callout */}
      <div className="glass-card" style={{ padding: '2rem', marginTop: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', color: '#0f172a' }}>
          💡 Why Stopping at the Break Point Works
        </h3>
        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
          A scammer can send you a message, make up a fancy company name, or show you a fake screenshot. None of that harms you until the final step—when you send them money or share your OTP code. By identifying that exact step and stopping right there, the scam completely fails and you remain 100% safe.
        </p>
      </div>
    </div>
  );
}
