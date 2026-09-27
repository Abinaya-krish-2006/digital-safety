import React, { useState } from 'react';
import { 
  MessageSquare, 
  Lock, 
  Link, 
  ShoppingBag, 
  UserCheck, 
  Smartphone, 
  Upload, 
  Sparkles, 
  ArrowRight,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export default function CheckPage({ activeCategory, setActiveCategory, onAnalysisComplete }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [messageText, setMessageText] = useState('');
  const [messageSender, setMessageSender] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);

  const [recipientName, setRecipientName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentReason, setPaymentReason] = useState('');
  const [urgencyClaimed, setUrgencyClaimed] = useState(false);

  const [urlInput, setUrlInput] = useState('');

  const [shopPlatform, setShopPlatform] = useState('Instagram');
  const [shopName, setShopName] = useState('');
  const [paymentRecipient, setPaymentRecipient] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [hasReturnPolicy, setHasReturnPolicy] = useState(false);

  const [profilePlatform, setProfilePlatform] = useState('Instagram');
  const [profileUsername, setProfileUsername] = useState('');
  const [accountAgeDays, setAccountAgeDays] = useState('');
  const [claimsBrand, setClaimsBrand] = useState(false);
  const [requestsMoveOffPlatform, setRequestsMoveOffPlatform] = useState(false);

  const [qrContent, setQrContent] = useState('');
  const [appName, setAppName] = useState('');
  const [qrSource, setQrSource] = useState('Sent in chat');
  const [isDirectApk, setIsDirectApk] = useState(false);

  const categories = [
    { id: 'message', label: 'Message / OTP', icon: MessageSquare, hint: 'SMS, WhatsApp, emails' },
    { id: 'payment', label: 'Payment / UPI', icon: Lock, hint: 'Transfers & advance fees' },
    { id: 'url', label: 'Website / Link', icon: Link, hint: 'Links sent to you' },
    { id: 'shop', label: 'Online Shop', icon: ShoppingBag, hint: 'Social media sellers' },
    { id: 'profile', label: 'Profile Check', icon: UserCheck, hint: 'Fake accounts' },
    { id: 'qr', label: 'App / QR Check', icon: Smartphone, hint: 'Downloads & QR codes' },
  ];

  // Quick Loaders for each module
  const loadQuickSample = (type) => {
    setErrorMsg('');
    if (type === 'message') {
      setMessageText("URGENT: Your HDFC bank account is locked due to incomplete KYC! Please share the 6-digit OTP sent to your phone immediately to verify your identity.");
      setMessageSender("+1-800-449-KYC");
    } else if (type === 'payment') {
      setRecipientName("Raj Kumar (Personal Account)");
      setUpiId("rajkumar987@okaxis");
      setAmount("45");
      setPaymentReason("Exclusive 90% liquidation discount on luxury sneakers");
      setUrgencyClaimed(true);
    } else if (type === 'url') {
      setUrlInput("http://192.168.1.1/paypal-account-verification/login.php");
    } else if (type === 'shop') {
      setShopPlatform("Instagram");
      setShopName("Luxe Streetwear Official");
      setPaymentRecipient("Suresh Verma");
      setOriginalPrice("350");
      setProductPrice("35");
      setWebsiteUrl("https://luxestreetwear-outlet.xyz");
      setHasReturnPolicy(false);
    } else if (type === 'profile') {
      setProfilePlatform("Instagram");
      setProfileUsername("@apple_support_vip_deals");
      setAccountAgeDays("12");
      setClaimsBrand(true);
      setRequestsMoveOffPlatform(true);
    } else if (type === 'qr') {
      setQrContent("https://dl-apk-update.biz/banking_security_patch.apk");
      setAppName("Bank QuickSecurity App");
      setQrSource("Sent in chat");
      setIsDirectApk(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      let endpoint = '';
      let bodyData = null;
      let isMultipart = false;

      if (activeCategory === 'message') {
        if (screenshotFile) {
          isMultipart = true;
          const formData = new FormData();
          formData.append('file', screenshotFile);
          if (messageText) formData.append('context', messageText);
          endpoint = '/api/analyze/screenshot';
          bodyData = formData;
        } else {
          if (!messageText.trim()) {
            throw new Error("Please enter a message or upload a screenshot to analyze.");
          }
          endpoint = '/api/analyze/message';
          bodyData = JSON.stringify({
            message: messageText,
            sender: messageSender || "Unknown",
            platform: "Message / SMS"
          });
        }
      } else if (activeCategory === 'payment') {
        if (!upiId && !recipientName && !paymentReason) {
          throw new Error("Please enter at least a recipient name, UPI ID, or payment reason.");
        }
        endpoint = '/api/analyze/payment';
        bodyData = JSON.stringify({
          recipient_name: recipientName,
          upi_id_or_account: upiId,
          amount: amount ? parseFloat(amount) : null,
          reason_given: paymentReason,
          urgency_claimed: urgencyClaimed
        });
      } else if (activeCategory === 'url') {
        if (!urlInput.trim()) {
          throw new Error("Please enter a URL to inspect.");
        }
        endpoint = '/api/analyze/url';
        bodyData = JSON.stringify({ url: urlInput });
      } else if (activeCategory === 'shop') {
        if (!shopName.trim()) {
          throw new Error("Please enter the shop or seller name.");
        }
        endpoint = '/api/analyze/shop';
        bodyData = JSON.stringify({
          platform: shopPlatform,
          shop_name: shopName,
          payment_recipient: paymentRecipient,
          product_price: productPrice ? parseFloat(productPrice) : null,
          original_price: originalPrice ? parseFloat(originalPrice) : null,
          website_url: websiteUrl,
          has_return_policy: hasReturnPolicy
        });
      } else if (activeCategory === 'profile') {
        if (!profileUsername.trim()) {
          throw new Error("Please enter the username or handle.");
        }
        endpoint = '/api/analyze/profile';
        bodyData = JSON.stringify({
          platform: profilePlatform,
          username: profileUsername,
          account_age_days: accountAgeDays ? parseInt(accountAgeDays) : null,
          claims_known_brand_or_person: claimsBrand,
          requests_move_off_platform: requestsMoveOffPlatform
        });
      } else if (activeCategory === 'qr') {
        if (!qrContent.trim()) {
          throw new Error("Please enter the QR destination URL or app link.");
        }
        endpoint = '/api/analyze/qr';
        bodyData = JSON.stringify({
          qr_content_or_url: qrContent,
          app_name: appName,
          source: qrSource,
          is_direct_apk: isDirectApk,
          requested_permissions: isDirectApk ? ["SMS Read", "Accessibility Service"] : []
        });
      }

      const headers = isMultipart ? {} : { 'Content-Type': 'application/json' };
      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: bodyData
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.detail || errJson.message || `Analysis request failed with status ${res.status}`);
      }

      const result = await res.json();
      onAnalysisComplete(result);
    } catch (err) {
      setErrorMsg(err.message || "Failed to complete risk analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0 4rem 0', maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.3rem', marginBottom: '0.5rem', color: '#0f172a' }}>
          Check Something for Safety
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Select what you want to check below. Not sure what to type? Click <strong>"Fill with Example"</strong> to see how it works!
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.4rem',
        padding: '0.4rem',
        background: '#ffffff',
        borderRadius: '14px',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem',
        overflowX: 'auto',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
      }}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setErrorMsg('');
              }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                padding: '0.75rem 0.5rem',
                fontSize: '0.85rem',
                fontWeight: isSelected ? 700 : 500,
                color: isSelected ? '#2563eb' : '#64748b',
                background: isSelected ? '#eff6ff' : 'transparent',
                border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                borderRadius: '10px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Icon size={16} />
                <span>{cat.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Form Container */}
      <div className="glass-card" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a' }}>
              {categories.find(c => c.id === activeCategory)?.label}
            </h2>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Paste your information or click the button on the right to test with sample data:
            </span>
          </div>
          <button 
            type="button"
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', background: '#f8fafc', borderColor: '#2563eb', color: '#2563eb' }}
            onClick={() => loadQuickSample(activeCategory)}
          >
            <Sparkles size={15} />
            <span>Fill with Example</span>
          </button>
        </div>

        {errorMsg && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '10px',
            padding: '0.85rem 1rem',
            color: '#b91c1c',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* TAB 1: MESSAGE / OTP */}
          {activeCategory === 'message' && (
            <div>
              <div className="form-group">
                <label className="form-label">Paste Message Text</label>
                <textarea
                  className="form-textarea"
                  placeholder="Paste the SMS, WhatsApp, or email text here (e.g. 'Your bank account will be blocked! Share OTP immediately...')"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Sender Phone Number or Name (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. +1 (800) 555-0199 or Unknown"
                    value={messageSender}
                    onChange={(e) => setMessageSender(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Or Upload a Screenshot</label>
                  <input
                    type="file"
                    className="form-input"
                    accept="image/*"
                    onChange={(e) => setScreenshotFile(e.target.files[0] || null)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PAYMENT / UPI */}
          {activeCategory === 'payment' && (
            <div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Who is asking for payment? (Recipient Name)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Raj Kumar or Store Account"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">UPI ID or Account Handle</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. rajkumar987@okaxis"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Amount ($ or ₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Why are they asking for money? (Reason)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Job registration fee, laptop deposit, luxury clearance"
                    value={paymentReason}
                    onChange={(e) => setPaymentReason(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
                <input
                  type="checkbox"
                  id="urgency"
                  checked={urgencyClaimed}
                  onChange={(e) => setUrgencyClaimed(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                />
                <label htmlFor="urgency" style={{ fontSize: '0.92rem', cursor: 'pointer', color: '#334155' }}>
                  The person is pressuring me to pay right now within minutes
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: URL / LINK */}
          {activeCategory === 'url' && (
            <div>
              <div className="form-group">
                <label className="form-label">Website Link / URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. http://192.168.1.1/paypal-account-login or https://apple-support-verify.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                We will check if the link is trying to steal passwords, has a fake brand name, or lacks a secure HTTPS connection.
              </p>
            </div>
          )}

          {/* TAB 4: SHOP */}
          {activeCategory === 'shop' && (
            <div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Where did you find this shop?</label>
                  <select 
                    className="form-select"
                    value={shopPlatform}
                    onChange={(e) => setShopPlatform(e.target.value)}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Telegram">Telegram</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Shop / Profile Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Luxe Streetwear Official"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Name on the UPI or Bank account for payment</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Suresh Verma (Notice if it doesn't match the store name!)"
                    value={paymentRecipient}
                    onChange={(e) => setPaymentRecipient(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Store Website Link (If any)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. https://luxestore-outlet.xyz"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Normal Price ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="350"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Price They Offer ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="35"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="checkbox"
                  id="returns"
                  checked={hasReturnPolicy}
                  onChange={(e) => setHasReturnPolicy(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                />
                <label htmlFor="returns" style={{ fontSize: '0.92rem', cursor: 'pointer', color: '#334155' }}>
                  The seller provides a real return/refund policy
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE */}
          {activeCategory === 'profile' && (
            <div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Platform</label>
                  <select 
                    className="form-select"
                    value={profilePlatform}
                    onChange={(e) => setProfilePlatform(e.target.value)}
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="X">X (Twitter)</option>
                    <option value="Telegram">Telegram</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Username / Handle</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. @apple_support_deals"
                    value={profileUsername}
                    onChange={(e) => setProfileUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">How old is this account? (Rough days)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 15 days"
                  value={accountAgeDays}
                  onChange={(e) => setAccountAgeDays(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={claimsBrand}
                    onChange={(e) => setClaimsBrand(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                  />
                  They claim to represent a famous brand but don't have a verified badge
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.92rem', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={requestsMoveOffPlatform}
                    onChange={(e) => setRequestsMoveOffPlatform(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                  />
                  They immediately asked to move to private WhatsApp or Telegram chats
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: APP / QR */}
          {activeCategory === 'qr' && (
            <div>
              <div className="form-group">
                <label className="form-label">QR Code Link or App Download URL</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. https://dl-apk-update.biz/banking_app.apk"
                  value={qrContent}
                  onChange={(e) => setQrContent(e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">App Name (If known)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Bank Security App"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Where did you find this QR / App?</label>
                  <select 
                    className="form-select"
                    value={qrSource}
                    onChange={(e) => setQrSource(e.target.value)}
                  >
                    <option value="Sent in chat">Sent in chat / message</option>
                    <option value="Social Media Post">Social Media Post</option>
                    <option value="Poster / Physical Sticker">Poster / Physical Sticker</option>
                    <option value="Official Store">Official Storefront</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <input
                  type="checkbox"
                  id="directApk"
                  checked={isDirectApk}
                  onChange={(e) => setIsDirectApk(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#2563eb' }}
                />
                <label htmlFor="directApk" style={{ fontSize: '0.92rem', cursor: 'pointer', color: '#334155' }}>
                  Asks me to download an ".apk" file instead of Google Play or App Store
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ padding: '0.9rem 2.5rem', fontSize: '1.05rem' }}
            >
              {loading ? (
                <span>Checking Safety...</span>
              ) : (
                <>
                  <span>Check for Scam Risks</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
