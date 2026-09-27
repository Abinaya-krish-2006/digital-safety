from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from ..models.schemas import (
    AnalysisResponse,
    MessageAnalysisRequest,
    ShopAnalysisRequest,
    UrlAnalysisRequest,
    PaymentAnalysisRequest,
    ProfileAnalysisRequest,
    QrAnalysisRequest,
    Signal,
    SignalSeverity,
    RiskLevel,
    TrustDriftPoint
)
from ..services.rule_engine import RuleEngine
from ..services.ai_service import AiService
from ..services.ocr_service import OcrService
from ..services.image_service import ImageService

router = APIRouter(prefix="/api/analyze", tags=["Analyze"])

@router.post("/message", response_model=AnalysisResponse)
async def analyze_message_endpoint(req: MessageAnalysisRequest):
    base_res = RuleEngine.analyze_message(req)
    final_res = await AiService.enhance_with_ai(base_res, req.dict())
    return final_res

@router.post("/shop", response_model=AnalysisResponse)
async def analyze_shop_endpoint(req: ShopAnalysisRequest):
    base_res = RuleEngine.analyze_shop(req)
    final_res = await AiService.enhance_with_ai(base_res, req.dict())
    return final_res

@router.post("/url", response_model=AnalysisResponse)
async def analyze_url_endpoint(req: UrlAnalysisRequest):
    base_res = RuleEngine.analyze_url(req)
    final_res = await AiService.enhance_with_ai(base_res, req.dict())
    return final_res

@router.post("/payment", response_model=AnalysisResponse)
async def analyze_payment_endpoint(req: PaymentAnalysisRequest):
    base_res = RuleEngine.analyze_payment(req)
    final_res = await AiService.enhance_with_ai(base_res, req.dict())
    return final_res

@router.post("/profile", response_model=AnalysisResponse)
async def analyze_profile_endpoint(req: ProfileAnalysisRequest):
    base_res = RuleEngine.analyze_profile(req)
    final_res = await AiService.enhance_with_ai(base_res, req.dict())
    return final_res

@router.post("/qr", response_model=AnalysisResponse)
async def analyze_qr_endpoint(req: QrAnalysisRequest):
    base_res = RuleEngine.analyze_qr(req)
    final_res = await AiService.enhance_with_ai(base_res, req.dict())
    return final_res

@router.post("/screenshot", response_model=AnalysisResponse)
async def analyze_screenshot_endpoint(
    file: UploadFile = File(...),
    context: Optional[str] = Form(None)
):
    try:
        content = await file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Could not read uploaded screenshot file.")

    # 1. OCR analysis
    ocr_success, extracted_text_or_err = OcrService.extract_text_from_bytes(content)

    # 2. Image reuse check
    is_reused, reuse_details = ImageService.check_reuse_signal(content)

    if ocr_success and extracted_text_or_err.strip():
        req = MessageAnalysisRequest(
            message=extracted_text_or_err,
            platform="Screenshot OCR",
            context=context or "Analyzed from uploaded screenshot"
        )
        base_res = RuleEngine.analyze_message(req)
        
        # If image reuse detected, inject signal
        if is_reused and reuse_details:
            base_res.signals.append(Signal(
                type="PRODUCT_IMAGE_REUSE",
                severity=SignalSeverity.MEDIUM,
                explanation=reuse_details
            ))
            base_res.risk_score = min(base_res.risk_score + 15, 95)
            base_res.attack_chain.insert(0, "Stock / Reused Imagery")
        
        base_res.evidence["extracted_text"] = extracted_text_or_err
        base_res.evidence["filename"] = file.filename
        
        final_res = await AiService.enhance_with_ai(base_res, {
            "extracted_text": extracted_text_or_err,
            "filename": file.filename,
            "image_reuse": reuse_details
        })
        return final_res
    else:
        # OCR could not extract text, but image reuse might still register
        signals = []
        attack_chain = ["Screenshot Uploaded"]
        score = 20
        level = RiskLevel.LOW_CONCERN
        break_point = "Review the screenshot text and paste it manually into the text checker."

        if is_reused and reuse_details:
            signals.append(Signal(
                type="PRODUCT_IMAGE_REUSE",
                severity=SignalSeverity.MEDIUM,
                explanation=reuse_details
            ))
            score = 55
            level = RiskLevel.VERIFY
            attack_chain.append("Stock Image Reused Across Shops")
            break_point = "Verify seller product authenticity before purchasing."

        signals.append(Signal(
            type="OCR_UNAVAILABLE_OR_EMPTY",
            severity=SignalSeverity.LOW,
            explanation=extracted_text_or_err
        ))

        return AnalysisResponse(
            risk_level=level,
            risk_score=score,
            summary=f"Screenshot received. {extracted_text_or_err}",
            source="rule_based_fallback",
            signals=signals,
            attack_chain=attack_chain,
            break_point=break_point,
            safe_actions=[
                "If the image contains text, copy or type key lines into the Message / OTP checker.",
                "Ensure image is clear, sharp, and high contrast for automated recognition."
            ],
            trust_drift=[
                TrustDriftPoint(step="Image Upload", percentage=30, note="Screenshot inspected for visual patterns"),
                TrustDriftPoint(step="Content Extraction", percentage=60, note="Text and hash analysis performed")
            ],
            evidence={
                "filename": file.filename,
                "file_size_bytes": len(content),
                "ocr_status": extracted_text_or_err
            }
        )
