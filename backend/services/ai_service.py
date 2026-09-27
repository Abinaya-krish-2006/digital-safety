import os
import json
import logging
from typing import Optional, Dict, Any
import httpx
from ..models.schemas import AnalysisResponse, RiskLevel, SignalSeverity, Signal, TrustDriftPoint
from .rule_engine import RuleEngine

logger = logging.getLogger(__name__)

class AiService:
    @staticmethod
    def get_api_key() -> Optional[str]:
        return os.environ.get("GEMINI_API_KEY", "").strip() or None

    @classmethod
    async def enhance_with_ai(cls, base_response: AnalysisResponse, raw_context: Dict[str, Any]) -> AnalysisResponse:
        """
        Takes the rule-based response and tries to enhance explanations, summary, and attack chain with Gemini AI.
        If Gemini API key is missing or fails, returns base_response (source='rule_based_fallback').
        """
        api_key = cls.get_api_key()
        if not api_key:
            logger.info("No GEMINI_API_KEY configured. Using deterministic rule-based analysis.")
            return base_response

        prompt = f"""
You are the AI Risk & Context Analyst for TRUSTCHAIN AI (Tagline: "Don't just detect the threat. Break the chain.").
You evaluate suspicious messages, links, profiles, online shops, and payment requests to construct an attack chain and identify where the user can intervene.

STRICT CONSTRAINTS:
1. Canonical Risk Levels: LOW_CONCERN, VERIFY, HIGH_RISK.
2. NEVER claim something is "definitely fake" or "definitely a scam". Frame as risk assessment based on available evidence.
3. Keep language clear and accessible to non-technical users. Avoid excessive cybersecurity jargon.
4. Output STRICT JSON conforming to the requested schema.

EVIDENCE ANALYZED:
{json.dumps(raw_context, indent=2)}

PRELIMINARY DETERMINISTIC SIGNALS:
Risk Level: {base_response.risk_level.value}
Preliminary Score: {base_response.risk_score}
Signals: {[s.dict() for s in base_response.signals]}

Respond ONLY with a JSON object in this EXACT shape:
{{
  "risk_level": "{base_response.risk_level.value}",
  "risk_score": {base_response.risk_score},
  "summary": "2-3 sentence clear, objective risk summary without claiming certainty.",
  "signals": [
    {{
      "type": "SIGNAL_KEYWORD",
      "severity": "HIGH|MEDIUM|LOW",
      "explanation": "Clear explanation of why this was flagged."
    }}
  ],
  "attack_chain": [
    "Step 1",
    "Step 2",
    "Step 3",
    "Step 4"
  ],
  "break_point": "Clear, direct imperative stating exactly what action the user must avoid doing (e.g. Do not share the OTP).",
  "safe_actions": [
    "Safe action 1",
    "Safe action 2",
    "Safe action 3"
  ]
}}
"""
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
        payload = {
            "contents": [
                {
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": {
                "temperature": 0.2,
                "responseMimeType": "application/json"
            }
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    raw_text = data["candidates"][0]["content"]["parts"][0]["text"]
                    parsed = json.loads(raw_text)

                    # Validate risk_level
                    risk_lvl_str = parsed.get("risk_level", base_response.risk_level.value)
                    if risk_lvl_str not in [RiskLevel.LOW_CONCERN.value, RiskLevel.VERIFY.value, RiskLevel.HIGH_RISK.value]:
                        risk_lvl = base_response.risk_level
                    else:
                        risk_lvl = RiskLevel(risk_lvl_str)

                    # Convert signals
                    new_signals = []
                    for s in parsed.get("signals", []):
                        sev_str = s.get("severity", "MEDIUM").upper()
                        sev = SignalSeverity.HIGH if sev_str == "HIGH" else (SignalSeverity.LOW if sev_str == "LOW" else SignalSeverity.MEDIUM)
                        new_signals.append(Signal(
                            type=s.get("type", "SUSPICIOUS_INDICATOR"),
                            severity=sev,
                            explanation=s.get("explanation", "")
                        ))

                    return AnalysisResponse(
                        risk_level=risk_lvl,
                        risk_score=int(parsed.get("risk_score", base_response.risk_score)),
                        summary=parsed.get("summary", base_response.summary),
                        source="ai",
                        signals=new_signals if new_signals else base_response.signals,
                        attack_chain=parsed.get("attack_chain", base_response.attack_chain),
                        break_point=parsed.get("break_point", base_response.break_point),
                        safe_actions=parsed.get("safe_actions", base_response.safe_actions),
                        trust_drift=base_response.trust_drift,
                        identity_check=base_response.identity_check,
                        evidence=base_response.evidence
                    )
                else:
                    logger.warning(f"Gemini API returned status {res.status_code}. Using fallback rule engine.")
                    return base_response
        except Exception as e:
            logger.warning(f"AI enhancement failed: {e}. Falling back to rule engine.")
            return base_response
