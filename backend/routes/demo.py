from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from ..models.schemas import (
    AnalysisResponse,
    RiskLevel,
    SignalSeverity,
    Signal,
    TrustDriftPoint,
    IdentityCheckDetail
)

router = APIRouter(prefix="/api/demo", tags=["Demo"])

DEMO_SCENARIOS: Dict[str, Dict[str, Any]] = {
    "fake_instagram_shop": {
        "title": "Fake Instagram Shop",
        "description": "A social-media shop offers a luxury product at an unusually large discount and asks the user to pay to a different person's personal UPI account.",
        "input_sample": {
            "platform": "Instagram",
            "shop_name": "ABC Fashion Outlet",
            "profile_url": "https://instagram.com/abcfashion_deals_official",
            "website_url": "https://abcfashion-store.xyz",
            "product_price": 45.0,
            "original_price": 450.0,
            "payment_recipient": "Raj Kumar",
            "contact_info": "+91 98765 43210 (WhatsApp only)",
            "has_return_policy": False
        },
        "response": AnalysisResponse(
            risk_level=RiskLevel.VERIFY,
            risk_score=68,
            summary="A social-media shop offers a product at a 90% discount and instructs payment to an unrelated personal account ('Raj Kumar') rather than a registered merchant.",
            source="rule_based_fallback",
            signals=[
                Signal(
                    type="PAYMENT_RECIPIENT_MISMATCH",
                    severity=SignalSeverity.HIGH,
                    explanation="Shop identity ('ABC Fashion Outlet') and payment recipient name ('Raj Kumar') do not clearly match."
                ),
                Signal(
                    type="EXCESSIVE_DISCOUNT",
                    severity=SignalSeverity.MEDIUM,
                    explanation="A 90% discount ($45 vs $450) is characteristic of counterfeit liquidation or non-delivery bait."
                ),
                Signal(
                    type="SUSPICIOUS_DOMAIN_EXTENSION",
                    severity=SignalSeverity.MEDIUM,
                    explanation="The storefront is hosted on an ephemeral '.xyz' top-level domain."
                ),
                Signal(
                    type="MISSING_RETURN_POLICY",
                    severity=SignalSeverity.LOW,
                    explanation="No formal return, refund, or registered legal entity information disclosed."
                )
            ],
            attack_chain=[
                "Instagram Sponsored Reel / Ad",
                "Luxury Sneaker at 90% Discount ($45)",
                "Urgent Limited-Stock Pressure in DM",
                "Direct Payment Request to 'Raj Kumar'",
                "Goods Withheld / Ghosted"
            ],
            break_point="Verify seller identity and do not pay to unrelated personal accounts.",
            safe_actions=[
                "Ask the seller for an official verified merchant invoice with buyer protection.",
                "Search independent consumer forums and Google for past complaints about this store handle.",
                "Never send peer-to-peer transfers (UPI/Venmo) to personal names for commercial goods."
            ],
            trust_drift=[
                TrustDriftPoint(step="Initial Ad Discovery", percentage=25, note="Glossy Instagram feed presentation"),
                TrustDriftPoint(step="Attractive Deal", percentage=55, note="Deep price markdown creates urgency"),
                TrustDriftPoint(step="Friendly DM Contact", percentage=80, note="Seller promises same-day dispatch"),
                TrustDriftPoint(step="Personal Account Transfer", percentage=95, note="Diverts money to personal UPI 'Raj Kumar'")
            ],
            identity_check=IdentityCheckDetail(
                has_check=True,
                consistent=False,
                summary="Payment recipient 'Raj Kumar' does not match shop name 'ABC Fashion Outlet'.",
                entities={
                    "platform": "Instagram",
                    "shop_name": "ABC Fashion Outlet",
                    "payment_recipient": "Raj Kumar",
                    "website": "abcfashion-store.xyz"
                }
            ),
            evidence={
                "shop_name": "ABC Fashion Outlet",
                "payment_recipient": "Raj Kumar",
                "original_price": 450.0,
                "product_price": 45.0,
                "platform": "Instagram",
                "domain": "abcfashion-store.xyz"
            }
        )
    },
    "otp_scam": {
        "title": "Bank Account Suspension & OTP Fraud",
        "description": "An urgent message claims the user's primary bank account is suspended and demands immediate OTP submission to avoid cancellation.",
        "input_sample": {
            "message": "URGENT NOTICE: Your bank account ending in 4092 is suspended due to pending KYC verification. Share the 6-digit OTP sent to your mobile immediately or click https://bit.ly/bank-kyc-update to prevent permanent account closure.",
            "sender": "+1 (800) 555-0199 / Unknown SMS Header",
            "platform": "SMS"
        },
        "response": AnalysisResponse(
            risk_level=RiskLevel.HIGH_RISK,
            risk_score=94,
            summary="An unknown sender is threatening immediate bank account suspension while demanding an OTP and embedding a shortened link.",
            source="rule_based_fallback",
            signals=[
                Signal(
                    type="OTP_REQUEST",
                    severity=SignalSeverity.HIGH,
                    explanation="The sender is requesting a one-time password (OTP) which can grant full account access."
                ),
                Signal(
                    type="ACCOUNT_THREAT",
                    severity=SignalSeverity.HIGH,
                    explanation="Claims of imminent account suspension or penalty to trigger fear and bypass caution."
                ),
                Signal(
                    type="URGENCY_INDUCEMENT",
                    severity=SignalSeverity.MEDIUM,
                    explanation="Demands immediate action without time to independently verify."
                ),
                Signal(
                    type="SHORTENED_URL_OBSCURED",
                    severity=SignalSeverity.MEDIUM,
                    explanation="Contains obscured URL (bit.ly/bank-kyc-update) masking actual destination domain."
                )
            ],
            attack_chain=[
                "Unknown / Spoofed SMS Header",
                "Urgent KYC Account Suspension Threat",
                "Panic-Driven Link Click",
                "Spoofed Bank Verification Page",
                "OTP Exfiltration & Account Drain"
            ],
            break_point="Do not share the OTP under any circumstance.",
            safe_actions=[
                "Never share your OTP, PIN, or banking passwords with anyone—even someone claiming to be bank security.",
                "Do not click the shortened link in the message.",
                "Call the customer service phone number printed on the back of your official bank debit card.",
                "Report and block the sender number in your messaging app."
            ],
            trust_drift=[
                TrustDriftPoint(step="Urgent Delivery", percentage=30, note="Unsolicited alert claiming official status"),
                TrustDriftPoint(step="Fear Inducement", percentage=65, note="Threatens loss of banking privileges"),
                TrustDriftPoint(step="Fake Solution", percentage=85, note="Offers immediate fix via link / code share"),
                TrustDriftPoint(step="2FA Bypass", percentage=100, note="Steals OTP to authorize fraudulent transfer")
            ],
            identity_check=IdentityCheckDetail(
                has_check=False,
                consistent=True,
                summary="Message analysis does not contain storefront identity check."
            ),
            evidence={
                "message": "URGENT NOTICE: Your bank account ending in 4092 is suspended...",
                "sender": "+1 (800) 555-0199",
                "detected_otp_trigger": True,
                "detected_shortener": "bit.ly"
            }
        )
    },
    "fake_job_offer": {
        "title": "Fake Job Offer & Advance Registration Fee",
        "description": "An unsolicited recruiter message promises a high-paying remote job but demands an upfront registration/equipment fee.",
        "input_sample": {
            "message": "Congratulations! You have been shortlisted for our Remote Global Operations Specialist role ($70/hr). To confirm your interview slot and receive your company MacBook, please transfer the refundable security deposit of $150 to hr-deposit@okaxis immediately.",
            "sender": "Recruiter via WhatsApp / Telegram",
            "platform": "WhatsApp"
        },
        "response": AnalysisResponse(
            risk_level=RiskLevel.HIGH_RISK,
            risk_score=88,
            summary="A remote job recruiter demands an advance 'refundable' fee before an interview can take place.",
            source="rule_based_fallback",
            signals=[
                Signal(
                    type="UPFRONT_PAYMENT_REQUEST",
                    severity=SignalSeverity.HIGH,
                    explanation="Demanding upfront payment for interview slots or work equipment is a definitive hallmark of employment scams."
                ),
                Signal(
                    type="UNVERIFIED_RECRUITER",
                    severity=SignalSeverity.MEDIUM,
                    explanation="Unsolicited outreach on personal chat platforms without a formal corporate email address."
                ),
                Signal(
                    type="EXCESSIVE_COMPENSATION_PROMISE",
                    severity=SignalSeverity.MEDIUM,
                    explanation="Unrealistically high hourly rate for entry-level remote work used as psychological bait."
                ),
                Signal(
                    type="URGENCY_INDUCEMENT",
                    severity=SignalSeverity.MEDIUM,
                    explanation="Creates artificial time limit on slot reservation to prevent due diligence."
                )
            ],
            attack_chain=[
                "Unsolicited Job Offer on WhatsApp",
                "High Salary Promise ($70/hr)",
                "Fake Company Equipment Benefit",
                "Refundable Security Fee Demand ($150)",
                "Contact Cut & Disappearance"
            ],
            break_point="Do not pay any fee before independently verifying the employer.",
            safe_actions=[
                "Legitimate employers NEVER ask candidates to pay for interviews, background checks, or equipment.",
                "Check the official corporate careers page or contact HR through their official website domain.",
                "Never send money via peer-to-peer apps like UPI, Cash App, or Zelle for employment."
            ],
            trust_drift=[
                TrustDriftPoint(step="Congratulatory Contact", percentage=35, note="Claims you were shortlisted from resume database"),
                TrustDriftPoint(step="Lucrative Incentive", percentage=60, note="High salary and free MacBook promised"),
                TrustDriftPoint(step="Interview Precondition", percentage=85, note="Requires payment under guise of 'refundable deposit'"),
                TrustDriftPoint(step="Fund Theft", percentage=100, note="Recipient vanishes once funds are wired")
            ],
            identity_check=IdentityCheckDetail(
                has_check=False,
                consistent=True,
                summary="Employment scam pretext."
            ),
            evidence={
                "stated_compensation": "$70/hr",
                "requested_deposit": "$150",
                "payment_destination": "hr-deposit@okaxis",
                "platform": "WhatsApp"
            }
        )
    }
}

@router.get("")
@router.get("/")
def list_demo_scenarios():
    return [
        {
            "id": k,
            "title": v["title"],
            "description": v["description"],
            "risk_level": v["response"].risk_level.value,
            "risk_score": v["response"].risk_score,
            "break_point": v["response"].break_point
        }
        for k, v in DEMO_SCENARIOS.items()
    ]

@router.get("/{scenario}")
def get_demo_scenario(scenario: str):
    clean_key = scenario.lower().replace("-", "_")
    if clean_key in DEMO_SCENARIOS:
        return DEMO_SCENARIOS[clean_key]
    
    # Fuzzy match
    for k in DEMO_SCENARIOS:
        if k in clean_key or clean_key in k:
            return DEMO_SCENARIOS[k]

    raise HTTPException(
        status_code=404,
        detail=f"Scenario '{scenario}' not found. Available: {list(DEMO_SCENARIOS.keys())}"
    )
