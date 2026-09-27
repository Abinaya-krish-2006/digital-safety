from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class RiskLevel(str, Enum):
    LOW_CONCERN = "LOW_CONCERN"
    VERIFY = "VERIFY"
    HIGH_RISK = "HIGH_RISK"

class SignalSeverity(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"

class Signal(BaseModel):
    type: str
    severity: SignalSeverity
    explanation: str

class TrustDriftPoint(BaseModel):
    step: str
    percentage: int
    note: str

class IdentityCheckDetail(BaseModel):
    has_check: bool = False
    consistent: bool = True
    summary: str = ""
    entities: Dict[str, str] = Field(default_factory=dict)

class AnalysisResponse(BaseModel):
    risk_level: RiskLevel
    risk_score: int = Field(ge=0, le=100)
    summary: str
    source: str = "rule_based_fallback"  # "ai" or "rule_based_fallback"
    signals: List[Signal] = Field(default_factory=list)
    attack_chain: List[str] = Field(default_factory=list)
    break_point: str
    safe_actions: List[str] = Field(default_factory=list)
    trust_drift: List[TrustDriftPoint] = Field(default_factory=list)
    identity_check: Optional[IdentityCheckDetail] = None
    evidence: Dict[str, Any] = Field(default_factory=dict)

# Input Schemas
class MessageAnalysisRequest(BaseModel):
    message: str
    sender: Optional[str] = None
    platform: Optional[str] = "SMS / Chat"
    context: Optional[str] = None

class ShopAnalysisRequest(BaseModel):
    platform: str = "Instagram"
    shop_name: str
    profile_url: Optional[str] = None
    website_url: Optional[str] = None
    product_price: Optional[float] = None
    original_price: Optional[float] = None
    payment_recipient: Optional[str] = None
    contact_info: Optional[str] = None
    has_return_policy: Optional[bool] = False
    notes: Optional[str] = None

class UrlAnalysisRequest(BaseModel):
    url: str
    context: Optional[str] = None

class PaymentAnalysisRequest(BaseModel):
    recipient_name: Optional[str] = None
    upi_id_or_account: Optional[str] = None
    amount: Optional[float] = None
    reason_given: Optional[str] = None
    platform: Optional[str] = "UPI / Payment App"
    urgency_claimed: Optional[bool] = False
    message_text: Optional[str] = None

class ProfileAnalysisRequest(BaseModel):
    platform: str = "Instagram"
    username: str
    display_name: Optional[str] = None
    account_age_days: Optional[int] = None
    follower_count: Optional[int] = None
    following_count: Optional[int] = None
    claims_known_brand_or_person: bool = False
    has_verified_badge: bool = False
    has_profile_pic: bool = True
    bio_text: Optional[str] = None
    requests_move_off_platform: bool = False

class QrAnalysisRequest(BaseModel):
    qr_content_or_url: str
    app_name: Optional[str] = None
    publisher_name: Optional[str] = None
    source: str = "Sent in chat"  # e.g., "Official App Store", "Sent in chat", "Scanned in store"
    is_direct_apk: Optional[bool] = False
    requested_permissions: List[str] = Field(default_factory=list)
