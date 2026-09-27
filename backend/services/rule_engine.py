import re
from typing import List, Dict, Any, Tuple
from urllib.parse import urlparse
from ..models.schemas import (
    RiskLevel,
    SignalSeverity,
    Signal,
    TrustDriftPoint,
    IdentityCheckDetail,
    AnalysisResponse,
    MessageAnalysisRequest,
    ShopAnalysisRequest,
    UrlAnalysisRequest,
    PaymentAnalysisRequest,
    ProfileAnalysisRequest,
    QrAnalysisRequest,
)

class RuleEngine:
    @staticmethod
    def analyze_message(req: MessageAnalysisRequest) -> AnalysisResponse:
        text = req.message.lower()
        signals: List[Signal] = []
        score = 10
        attack_chain = ["Initial Contact"]

        # Signal 1: OTP Request
        if any(w in text for w in ["otp", "one time password", "verification code", "security code", "passcode"]):
            signals.append(Signal(
                type="OTP_REQUEST",
                severity=SignalSeverity.HIGH,
                explanation="The interaction explicitly requests a one-time password or verification code."
            ))
            score += 45
            attack_chain.append("OTP Verification Request")

        # Signal 2: Urgency / Panic inducing
        if any(w in text for w in ["urgent", "immediately", "within 24 hours", "account suspended", "blocked", "penalty", "expire", "action required"]):
            signals.append(Signal(
                type="URGENCY_INDUCEMENT",
                severity=SignalSeverity.MEDIUM,
                explanation="The message creates artificial pressure or panic to prompt immediate action."
            ))
            score += 25
            attack_chain.append("Urgency & Pressure")

        # Signal 3: Account Threat / Block
        if any(w in text for w in ["blocked", "suspended", "frozen", "deactivated", "kyc pending", "legal notice", "arrest"]):
            signals.append(Signal(
                type="ACCOUNT_THREAT",
                severity=SignalSeverity.HIGH,
                explanation="Threats of account suspension or penalties are used to bypass critical thinking."
            ))
            score += 30
            attack_chain.append("Account Threat / Penalty Warning")

        # Signal 4: Remote Access
        if any(w in text for w in ["anydesk", "teamviewer", "quicksupport", "rustdesk", "screen share"]):
            signals.append(Signal(
                type="REMOTE_ACCESS_REQUEST",
                severity=SignalSeverity.HIGH,
                explanation="Requesting installation of remote desktop software enables full device compromise."
            ))
            score += 50
            attack_chain.append("Remote Device Access Request")

        # Signal 5: Payment / Advance Fee
        if any(w in text for w in ["pay upfront", "registration fee", "security deposit", "send money", "refundable fee", "processing charge"]):
            signals.append(Signal(
                type="UPFRONT_PAYMENT_REQUEST",
                severity=SignalSeverity.HIGH,
                explanation="Demanding upfront payment before services or jobs are delivered is a key scam hallmark."
            ))
            score += 35
            attack_chain.append("Advance Payment Demand")

        # Signal 6: Links detected
        found_urls = re.findall(r"https?://\S+|bit\.ly/\S+|tinyurl\.com/\S+", req.message)
        if found_urls:
            signals.append(Signal(
                type="EMBEDDED_LINK",
                severity=SignalSeverity.MEDIUM,
                explanation=f"Contains external link ({found_urls[0][:30]}...) that may lead to phishing or spoofed forms."
            ))
            score += 20
            attack_chain.append("External Link Redirect")

        # Determine Break Point & Actions
        if any(s.type == "OTP_REQUEST" for s in signals):
            break_point = "Do not share the OTP under any circumstance."
            safe_actions = [
                "Never share your OTP, PIN, or password with anyone—including bank representatives.",
                "Banks and legitimate services will never ask you to disclose an OTP to prevent suspension.",
                "Contact the official customer support number printed on the back of your debit/credit card."
            ]
        elif any(s.type == "REMOTE_ACCESS_REQUEST" for s in signals):
            break_point = "Do not install AnyDesk, TeamViewer, or grant screen sharing."
            safe_actions = [
                "Decline remote access requests immediately.",
                "Uninstall any remote viewing apps if recently installed.",
                "Disconnect your device from Wi-Fi/Mobile data and scan for unauthorized access."
            ]
        elif any(s.type == "UPFRONT_PAYMENT_REQUEST" for s in signals):
            break_point = "Do not transfer money for registration or equipment fees."
            safe_actions = [
                "Legitimate employers or recruiters never charge candidate registration fees.",
                "Verify company credentials via an official portal or LinkedIn.",
                "Do not pay using personal UPI IDs or wire transfers."
            ]
        else:
            break_point = "Pause and verify through an independent channel before taking action."
            safe_actions = [
                "Do not click links inside unsolicited messages.",
                "Verify the claim via the company's official website or app.",
                "Report suspicious messages to your telecom provider or platform."
            ]

        # Calculate canonical RiskLevel
        score = min(max(score, 5), 98)
        if score > 70 or any(s.severity == SignalSeverity.HIGH for s in signals):
            level = RiskLevel.HIGH_RISK
            score = max(score, 78)
        elif score >= 35 or len(signals) > 0:
            level = RiskLevel.VERIFY
        else:
            level = RiskLevel.LOW_CONCERN
            break_point = "Continue normal interactions with basic caution."
            safe_actions = [
                "Always check sender authenticity for sensitive matters.",
                "Keep software and security protections updated."
            ]

        if not signals:
            signals.append(Signal(
                type="NO_OBVIOUS_THREAT",
                severity=SignalSeverity.LOW,
                explanation="No recognized scam patterns or sensitive requests detected in the message text."
            ))

        # Trust drift
        trust_drift = [
            TrustDriftPoint(step="Initial Contact", percentage=20, note="Unsolicited or incoming message received"),
            TrustDriftPoint(step="Rapport / Context", percentage=45, note="Sender claims official identity or urgent situation"),
            TrustDriftPoint(step="Escalation / Urgency", percentage=75, note="Pressure applied to force hasty decision"),
            TrustDriftPoint(step="Action Trigger", percentage=95, note="Demands sensitive credentials, OTP, or money")
        ]

        summary = (
            f"Analysis of this message revealed {len(signals)} risk indicator(s). "
            + ("High risk markers like OTP or credential harvesting were detected." if level == RiskLevel.HIGH_RISK else "Caution is advised before complying.")
        )

        return AnalysisResponse(
            risk_level=level,
            risk_score=score,
            summary=summary,
            source="rule_based_fallback",
            signals=signals,
            attack_chain=attack_chain,
            break_point=break_point,
            safe_actions=safe_actions,
            trust_drift=trust_drift,
            evidence={
                "message_length": len(req.message),
                "sender": req.sender or "Unknown",
                "platform": req.platform,
                "detected_urls": found_urls
            }
        )

    @staticmethod
    def analyze_shop(req: ShopAnalysisRequest) -> AnalysisResponse:
        signals: List[Signal] = []
        score = 15
        attack_chain = [f"{req.platform} Shop Listing"]

        # Check identity consistency
        entities = {
            "platform": req.platform,
            "shop_name": req.shop_name,
            "payment_recipient": req.payment_recipient or "Not specified",
            "website": req.website_url or "None"
        }
        
        identity_mismatch = False
        mismatch_summary = "Store identity appears consistent."

        if req.payment_recipient and req.shop_name:
            norm_shop = re.sub(r"[^a-z0-9]", "", req.shop_name.lower())
            norm_recip = re.sub(r"[^a-z0-9]", "", req.payment_recipient.lower())
            
            # Check if one is a substring of another or common match
            if norm_shop not in norm_recip and norm_recip not in norm_shop:
                identity_mismatch = True
                mismatch_summary = f"Shop name ('{req.shop_name}') and payment recipient name ('{req.payment_recipient}') do not match."
                signals.append(Signal(
                    type="PAYMENT_RECIPIENT_MISMATCH",
                    severity=SignalSeverity.HIGH,
                    explanation=f"Payment is directed to individual '{req.payment_recipient}' rather than a verified business account for '{req.shop_name}'."
                ))
                score += 35
                attack_chain.append("Payment Identity Mismatch")

        # Check discount
        if req.original_price and req.product_price and req.original_price > 0:
            discount_pct = ((req.original_price - req.product_price) / req.original_price) * 100
            if discount_pct >= 70:
                signals.append(Signal(
                    type="EXCESSIVE_DISCOUNT",
                    severity=SignalSeverity.MEDIUM,
                    explanation=f"A discount of {discount_pct:.0f}% is extraordinarily high, a tactic frequently used by counterfeit or ghost stores."
                ))
                score += 25
                attack_chain.append(f"Unrealistic Discount ({discount_pct:.0f}%)")

        # Check return policy
        if not req.has_return_policy:
            signals.append(Signal(
                type="MISSING_RETURN_POLICY",
                severity=SignalSeverity.LOW,
                explanation="No clear return or refund policy provided, making dispute resolution difficult."
            ))
            score += 15

        # Check website
        if req.website_url:
            domain = urlparse(req.website_url).netloc.lower()
            if any(free_tld in domain for free_tld in [".xyz", ".top", ".tk", ".cf", ".buzz"]):
                signals.append(Signal(
                    type="SUSPICIOUS_DOMAIN_EXTENSION",
                    severity=SignalSeverity.MEDIUM,
                    explanation=f"The domain uses an extension ({domain}) commonly associated with disposable or short-lived storefronts."
                ))
                score += 20
                attack_chain.append("Low-Trust Domain")

        attack_chain.append("Direct Peer-to-Peer Transfer Request")

        if identity_mismatch:
            break_point = "Verify seller identity and do not pay to unrelated personal accounts."
            safe_actions = [
                "Ask the seller for an official invoice and merchant payment link (Razorpay, Stripe, Shopify).",
                "Search the shop name on consumer complaint forums and Reddit for scam reports.",
                "Avoid direct UPI or wire transfers to personal names when buying from commercial stores."
            ]
        elif score > 60:
            break_point = "Pause transaction and demand verified business credentials."
            safe_actions = [
                "Use a credit card with fraud protection instead of direct bank transfer.",
                "Confirm physical business address and contact phone number.",
                "Check for tagged customer reviews, not just screenshot testimonials."
            ]
        else:
            break_point = "Proceed with standard e-commerce safety precautions."
            safe_actions = [
                "Keep transaction records and conversation screenshots.",
                "Ensure buyer protection is available on the payment method."
            ]

        score = min(max(score, 10), 95)
        if score > 70:
            level = RiskLevel.HIGH_RISK
        elif score >= 35 or identity_mismatch or len(signals) >= 2:
            level = RiskLevel.VERIFY
        else:
            level = RiskLevel.LOW_CONCERN

        trust_drift = [
            TrustDriftPoint(step="Social Discovery", percentage=25, note="Found via sponsored ad or social feed"),
            TrustDriftPoint(step="Attractive Offer", percentage=55, note="Luxury item listed with deep price reduction"),
            TrustDriftPoint(step="DM Engagement", percentage=80, note="Seller creates friendly rapport and claims limited stock"),
            TrustDriftPoint(step="Payment Redirect", percentage=95, note="Diverts payment to personal UPI / unverified account")
        ]

        return AnalysisResponse(
            risk_level=level,
            risk_score=score,
            summary=f"Shop analysis completed with {len(signals)} safety observation(s). " + ("Payment recipient mismatch detected." if identity_mismatch else "Review seller credentials."),
            source="rule_based_fallback",
            signals=signals,
            attack_chain=attack_chain,
            break_point=break_point,
            safe_actions=safe_actions,
            trust_drift=trust_drift,
            identity_check=IdentityCheckDetail(
                has_check=True,
                consistent=not identity_mismatch,
                summary=mismatch_summary,
                entities=entities
            ),
            evidence={
                "shop_name": req.shop_name,
                "platform": req.platform,
                "payment_recipient": req.payment_recipient,
                "product_price": req.product_price,
                "original_price": req.original_price,
                "website_url": req.website_url
            }
        )

    @staticmethod
    def analyze_url(req: UrlAnalysisRequest) -> AnalysisResponse:
        raw_url = req.url.strip()
        if not raw_url.startswith(("http://", "https://")):
            raw_url = "https://" + raw_url
            
        parsed = urlparse(raw_url)
        domain = parsed.netloc.lower()
        path = parsed.path.lower()

        signals: List[Signal] = []
        score = 10
        attack_chain = ["URL Distribution via Link / Message"]

        # 1. IP address host
        if re.match(r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}(:\d+)?$", domain):
            signals.append(Signal(
                type="IP_ADDRESS_HOST",
                severity=SignalSeverity.HIGH,
                explanation="The URL uses a raw IP address instead of a domain name, commonly used by rogue command & control or phishing sites."
            ))
            score += 45
            attack_chain.append("Raw IP Phishing Host")

        # 2. Insecure HTTP
        if parsed.scheme == "http":
            signals.append(Signal(
                type="INSECURE_HTTP_PROTOCOL",
                severity=SignalSeverity.MEDIUM,
                explanation="The site does not use HTTPS encryption; traffic and credentials can be intercepted."
            ))
            score += 25
            attack_chain.append("Unencrypted Connection")

        # 3. Lookalike / typosquatting brand names
        brands = ["paypal", "netflix", "apple", "google", "microsoft", "amazon", "hdfc", "sbi", "icici", "chase", "wellsfargo", "bankofamerica"]
        for b in brands:
            if b in domain and not domain.endswith(f".{b}.com") and domain != f"{b}.com" and not domain.endswith(f".{b}.co.in"):
                signals.append(Signal(
                    type="BRAND_IMPERSONATION_DOMAIN",
                    severity=SignalSeverity.HIGH,
                    explanation=f"The domain contains the brand name '{b}' within an unauthorized domain structure ({domain})."
                ))
                score += 45
                attack_chain.append(f"Brand Impersonation ({b})")
                break

        # 4. Suspicious keywords in URL
        phish_words = ["login", "verify", "secure", "update", "banking", "wallet", "account-recovery", "support", "kyc"]
        found_words = [w for w in phish_words if w in domain or w in path]
        if found_words:
            signals.append(Signal(
                type="CREDENTIAL_HARVESTING_KEYWORDS",
                severity=SignalSeverity.MEDIUM,
                explanation=f"URL contains sensitive security keywords: {', '.join(found_words)}."
            ))
            score += 20
            attack_chain.append("Credential Gathering Page")

        # 5. Excessive subdomains or hyphens
        if domain.count(".") > 3 or domain.count("-") > 2:
            signals.append(Signal(
                type="SUSPICIOUS_DOMAIN_STRUCTURE",
                severity=SignalSeverity.MEDIUM,
                explanation="The domain exhibits unusual complexity or excessive hyphens designed to mislead mobile browsers."
            ))
            score += 20

        # Break point
        if score > 60:
            break_point = "Do not enter passwords, OTPs, or payment information on this page."
            safe_actions = [
                "Close the browser tab immediately.",
                "Navigate directly to the official service website by typing the canonical address.",
                "Check the SSL certificate details by clicking the browser padlock icon."
            ]
        elif score >= 35:
            break_point = "Verify URL authenticity with the official provider before proceeding."
            safe_actions = [
                "Inspect the root domain carefully before typing login credentials.",
                "Ensure your browser's phishing protection is active."
            ]
        else:
            break_point = "Proceed normally while verifying SSL security."
            safe_actions = [
                "Always check for a secure HTTPS padlock icon.",
                "Never reuse master passwords across secondary websites."
            ]

        score = min(max(score, 10), 98)
        if score > 70 or any(s.severity == SignalSeverity.HIGH for s in signals):
            level = RiskLevel.HIGH_RISK
        elif score >= 35:
            level = RiskLevel.VERIFY
        else:
            level = RiskLevel.LOW_CONCERN

        if not signals:
            signals.append(Signal(
                type="CLEAN_STRUCTURE",
                severity=SignalSeverity.LOW,
                explanation="Standard domain format, valid protocol, and no obvious spoofing signals detected."
            ))

        attack_chain.append("User Enters Credentials")

        trust_drift = [
            TrustDriftPoint(step="Link Delivery", percentage=20, note="Sent via email, SMS, or direct chat"),
            TrustDriftPoint(step="Familiar Brand Look", percentage=50, note="Visual styling mimics trusted platform"),
            TrustDriftPoint(step="Form Prompt", percentage=80, note="Urgent request to log in or confirm details"),
            TrustDriftPoint(step="Credential Exfiltration", percentage=100, note="Data transmitted to attacker server")
        ]

        return AnalysisResponse(
            risk_level=level,
            risk_score=score,
            summary=f"URL inspection identified {len(signals)} indicator(s). " + ("Corroborating phishing markers present." if level == RiskLevel.HIGH_RISK else "Standard precautions apply."),
            source="rule_based_fallback",
            signals=signals,
            attack_chain=attack_chain,
            break_point=break_point,
            safe_actions=safe_actions,
            trust_drift=trust_drift,
            evidence={
                "analyzed_url": raw_url,
                "domain": domain,
                "scheme": parsed.scheme,
                "path": parsed.path
            }
        )

    @staticmethod
    def analyze_payment(req: PaymentAnalysisRequest) -> AnalysisResponse:
        signals: List[Signal] = []
        score = 15
        attack_chain = ["Transaction Request Initiated"]

        if req.urgency_claimed:
            signals.append(Signal(
                type="PAYMENT_URGENCY",
                severity=SignalSeverity.HIGH,
                explanation="Pressure to complete the transfer immediately without verifying transaction details."
            ))
            score += 30
            attack_chain.append("High Urgency Pressure")

        # Personal vs Business UPI / Account
        if req.upi_id_or_account:
            upi = req.upi_id_or_account.lower()
            if any(p in upi for p in ["@okaxis", "@oksbi", "@okhdfcbank", "@paytm", "@ybl", "@ibl"]):
                signals.append(Signal(
                    type="PERSONAL_UPI_HANDLE",
                    severity=SignalSeverity.MEDIUM,
                    explanation=f"Recipient handle '{req.upi_id_or_account}' is an individual consumer VPA rather than a verified merchant."
                ))
                score += 25
                attack_chain.append("Personal Account Routing")

        # Suspicious reasons
        if req.reason_given:
            r = req.reason_given.lower()
            if any(w in r for w in ["registration", "processing fee", "refundable deposit", "lottery tax", "customs clearance", "release package"]):
                signals.append(Signal(
                    type="SUSPICIOUS_PAYMENT_REASON",
                    severity=SignalSeverity.HIGH,
                    explanation=f"Payment pretext ('{req.reason_given}') matches common advance-fee scam narratives."
                ))
                score += 35
                attack_chain.append(f"Pretext: {req.reason_given}")

        if req.message_text:
            sub_res = RuleEngine.analyze_message(MessageAnalysisRequest(message=req.message_text))
            for s in sub_res.signals:
                if s.type not in [sig.type for sig in signals]:
                    signals.append(s)
            score = max(score, sub_res.risk_score)

        score = min(max(score, 15), 95)
        if score > 70:
            level = RiskLevel.HIGH_RISK
            break_point = "Do not authorize the transfer or enter your UPI PIN."
            safe_actions = [
                "Remember: Entering your UPI PIN always DEBITS money from your account, never receives money.",
                "Verify the recipient's phone number independently before sending any funds.",
                "If pressured by a supposed official or seller, halt immediately."
            ]
        elif score >= 35:
            level = RiskLevel.VERIFY
            break_point = "Confirm recipient identity through an alternative communication channel."
            safe_actions = [
                "Send a nominal test transfer ($1 or ₹1) if you must proceed.",
                "Check the name displayed by your banking app during the confirmation step."
            ]
        else:
            level = RiskLevel.LOW_CONCERN
            break_point = "Proceed with routine payment verification."
            safe_actions = ["Double-check recipient account number and amount."]

        attack_chain.append("Fund Transfer Finalization")

        trust_drift = [
            TrustDriftPoint(step="Initial Engagement", percentage=20, note="Service, trade, or contest discussed"),
            TrustDriftPoint(step="Pretext Presentation", percentage=50, note="Reason provided for payment request"),
            TrustDriftPoint(step="Payment Demand", percentage=85, note="Specific handle or link shared with urgency"),
            TrustDriftPoint(step="Irreversible Transfer", percentage=100, note="Direct peer-to-peer settlement")
        ]

        return AnalysisResponse(
            risk_level=level,
            risk_score=score,
            summary=f"Payment evaluation identified {len(signals)} flag(s). " + ("Advance fee or personal account diversion observed." if level != RiskLevel.LOW_CONCERN else "Standard payment parameters."),
            source="rule_based_fallback",
            signals=signals,
            attack_chain=attack_chain,
            break_point=break_point,
            safe_actions=safe_actions,
            trust_drift=trust_drift,
            evidence={
                "recipient": req.recipient_name or "Unknown",
                "handle": req.upi_id_or_account,
                "amount": req.amount,
                "reason": req.reason_given
            }
        )

    @staticmethod
    def analyze_profile(req: ProfileAnalysisRequest) -> AnalysisResponse:
        signals: List[Signal] = []
        score = 15
        attack_chain = [f"Profile Created on {req.platform}"]

        if req.account_age_days is not None and req.account_age_days < 30:
            signals.append(Signal(
                type="NEW_ACCOUNT_AGE",
                severity=SignalSeverity.MEDIUM,
                explanation=f"Account is only {req.account_age_days} days old, a frequent pattern among disposable scam profiles."
            ))
            score += 25
            attack_chain.append("New Disposable Account")

        if not req.has_profile_pic:
            signals.append(Signal(
                type="NO_PROFILE_PICTURE",
                severity=SignalSeverity.LOW,
                explanation="No profile picture or avatar set."
            ))
            score += 15

        if req.claims_known_brand_or_person and not req.has_verified_badge:
            signals.append(Signal(
                type="UNVERIFIED_BRAND_IMPERSONATION",
                severity=SignalSeverity.HIGH,
                explanation="Profile claims to represent an established brand or celebrity without platform verification."
            ))
            score += 40
            attack_chain.append("Unverified Impersonation")

        if req.requests_move_off_platform:
            signals.append(Signal(
                type="OFF_PLATFORM_REDIRECTION",
                severity=SignalSeverity.HIGH,
                explanation="Profile prompts to move conversations to Telegram or WhatsApp where platform moderation is bypassed."
            ))
            score += 35
            attack_chain.append("Off-Platform Redirection (WhatsApp/Telegram)")

        if req.following_count and req.follower_count is not None:
            if req.following_count > 500 and req.follower_count < 20:
                signals.append(Signal(
                    type="FOLLOWER_IMBALANCE",
                    severity=SignalSeverity.MEDIUM,
                    explanation="High following count with virtually zero organic followers indicates mass-following or automated behavior."
                ))
                score += 20

        score = min(max(score, 10), 95)
        if score > 65:
            level = RiskLevel.HIGH_RISK
            break_point = "Do not share personal contact details or engage in private off-platform chats."
            safe_actions = [
                "Refuse requests to switch to private messaging apps like Telegram or WhatsApp.",
                "Report the profile to the platform for impersonation.",
                "Do not send money or click links sent from this account."
            ]
        elif score >= 35:
            level = RiskLevel.VERIFY
            break_point = "Verify identity through third-party public records before sharing information."
            safe_actions = [
                "Cross-check official social handles on the company's verified website.",
                "Look for consistency across post dates and engagement history."
            ]
        else:
            level = RiskLevel.LOW_CONCERN
            break_point = "Standard social caution."
            safe_actions = ["Maintain standard privacy boundaries with online contacts."]

        attack_chain.append("Conversation / Solicitation")

        trust_drift = [
            TrustDriftPoint(step="Account Discovery", percentage=20, note="Profile appears in follow requests or comments"),
            TrustDriftPoint(step="Persona Setup", percentage=45, note="Mimics reputable agency or influencer"),
            TrustDriftPoint(step="Channel Switch", percentage=75, note="Pushes contact to unmoderated messaging apps"),
            TrustDriftPoint(step="Target Solicitation", percentage=95, note="Presents financial scheme or credential request")
        ]

        return AnalysisResponse(
            risk_level=level,
            risk_score=score,
            summary=f"Profile check completed with {len(signals)} signal(s). Note: Profile assessment relies on user-provided details.",
            source="rule_based_fallback",
            signals=signals,
            attack_chain=attack_chain,
            break_point=break_point,
            safe_actions=safe_actions,
            trust_drift=trust_drift,
            evidence={
                "username": req.username,
                "platform": req.platform,
                "account_age_days": req.account_age_days,
                "claims_brand": req.claims_known_brand_or_person
            }
        )

    @staticmethod
    def analyze_qr(req: QrAnalysisRequest) -> AnalysisResponse:
        content = req.qr_content_or_url.strip()
        signals: List[Signal] = []
        score = 15
        attack_chain = [f"QR Code Scanned ({req.source})"]

        # APK or direct executable check
        if content.lower().endswith(".apk") or req.is_direct_apk:
            signals.append(Signal(
                type="DIRECT_APK_DOWNLOAD",
                severity=SignalSeverity.HIGH,
                explanation="QR code triggers a direct .apk package download, bypassing Google Play Protect / App Store vetting."
            ))
            score += 50
            attack_chain.append("Direct APK Sideload")

        # Non-store link
        if content.startswith(("http://", "https://")):
            parsed = urlparse(content)
            domain = parsed.netloc.lower()
            if not any(store in domain for store in ["play.google.com", "apps.apple.com"]):
                signals.append(Signal(
                    type="UNOFFICIAL_APP_SOURCE",
                    severity=SignalSeverity.MEDIUM,
                    explanation=f"URL directs to an unofficial destination ({domain}) outside authorized app marketplaces."
                ))
                score += 25
                attack_chain.append(f"Redirect to {domain}")

        # Risky permissions requested
        risky_perms = ["accessibility", "sms", "contacts", "camera", "overlay", "device_admin", "screen_capture"]
        found_perms = [p for p in req.requested_permissions if any(rp in p.lower() for rp in risky_perms)]
        if found_perms:
            signals.append(Signal(
                type="EXCESSIVE_PERMISSIONS_REQUESTED",
                severity=SignalSeverity.HIGH,
                explanation=f"App demands high-risk device privileges: {', '.join(found_perms)}."
            ))
            score += 35
            attack_chain.append("High-Privilege Permission Grant")

        score = min(max(score, 10), 98)
        if score > 65:
            level = RiskLevel.HIGH_RISK
            break_point = "Do NOT install this application or grant device permissions."
            safe_actions = [
                "Never install .apk files provided via chat, SMS, or stickers.",
                "Only install apps directly through Google Play or Apple App Store.",
                "Never grant Accessibility or SMS permissions to unfamiliar utilities."
            ]
        elif score >= 35:
            level = RiskLevel.VERIFY
            break_point = "Verify developer identity in official store listings before scanning or installing."
            safe_actions = [
                "Inspect the destination URL before confirming any download prompt.",
                "Verify publisher authenticity on official developer websites."
            ]
        else:
            level = RiskLevel.LOW_CONCERN
            break_point = "Proceed with standard mobile application hygiene."
            safe_actions = ["Review permissions periodically in device settings."]

        attack_chain.append("App Execution / Device Access")

        trust_drift = [
            TrustDriftPoint(step="QR Presentation", percentage=25, note=f"Encountered via {req.source}"),
            TrustDriftPoint(step="Utility Claim", percentage=55, note="Promised exclusive feature, discount, or payment utility"),
            TrustDriftPoint(step="Sideload Prompt", percentage=85, note="Instructs user to bypass operating system security warnings"),
            TrustDriftPoint(step="Permission Seizure", percentage=100, note="Requests SMS / Accessibility rights to intercept 2FA")
        ]

        return AnalysisResponse(
            risk_level=level,
            risk_score=score,
            summary=f"QR & App inspection detected {len(signals)} indicator(s). Sideload and permission risks highlighted.",
            source="rule_based_fallback",
            signals=signals,
            attack_chain=attack_chain,
            break_point=break_point,
            safe_actions=safe_actions,
            trust_drift=trust_drift,
            evidence={
                "content": content,
                "app_name": req.app_name,
                "publisher": req.publisher_name,
                "source": req.source
            }
        )
