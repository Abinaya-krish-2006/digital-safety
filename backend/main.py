import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("trustchain-ai")

app = FastAPI(
    title="TRUSTCHAIN AI API",
    description="Cross-context digital safety layer that connects suspicious signals into attack chains and reveals the safest intervention point.",
    version="1.0.0"
)

# Enable CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from .routes import analyze_router, demo_router

app.include_router(analyze_router)
app.include_router(demo_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "TRUSTCHAIN AI",
        "version": "1.0.0",
        "ai_enabled": bool(os.environ.get("GEMINI_API_KEY"))
    }

@app.get("/api/dashboard")
def get_dashboard_summary():
    """
    Tier 3: Dashboard data. Clearly marked as demo/sample operational data.
    """
    return {
        "is_demo_data": True,
        "note": "Operational statistics aggregated across demo evaluation runs.",
        "metrics": {
            "total_analyses": 1428,
            "high_risk_findings": 584,
            "verify_findings": 612,
            "low_concern_findings": 232,
            "chains_broken": 892
        },
        "top_signals": [
            {"type": "OTP_REQUEST", "count": 412, "label": "OTP & Passcode Demands", "severity": "HIGH"},
            {"type": "PAYMENT_RECIPIENT_MISMATCH", "count": 348, "label": "Identity Mismatch in Checkout", "severity": "HIGH"},
            {"type": "URGENCY_INDUCEMENT", "count": 296, "label": "Artificial Urgency & Panic", "severity": "MEDIUM"},
            {"type": "EXCESSIVE_DISCOUNT", "count": 215, "label": "Extreme Discounts (>70%)", "severity": "MEDIUM"},
            {"type": "DIRECT_APK_DOWNLOAD", "count": 128, "label": "Unofficial Sideload APKs", "severity": "HIGH"}
        ],
        "recent_history": [
            {
                "id": "ana_01",
                "type": "Message / OTP",
                "risk_level": "HIGH_RISK",
                "snippet": "Account suspended. Share OTP immediately...",
                "break_point": "Do not share OTP",
                "timestamp": "12 mins ago"
            },
            {
                "id": "ana_02",
                "type": "Online Shop",
                "risk_level": "VERIFY",
                "snippet": "ABC Fashion Outlet vs Raj Kumar UPI...",
                "break_point": "Verify payment recipient",
                "timestamp": "34 mins ago"
            },
            {
                "id": "ana_03",
                "type": "Website / Link",
                "risk_level": "HIGH_RISK",
                "snippet": "http://192.168.1.1/paypal-secure-login",
                "break_point": "Do not enter login credentials",
                "timestamp": "1 hour ago"
            },
            {
                "id": "ana_04",
                "type": "Profile Check",
                "risk_level": "LOW_CONCERN",
                "snippet": "@spark_tech_support verified handle",
                "break_point": "Proceed with standard caution",
                "timestamp": "2 hours ago"
            }
        ]
    }

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error occurred.",
            "message": "We couldn't complete the full analysis right now, but local safety rules can still be evaluated."
        }
    )

# Mount frontend static distribution if built
frontend_dist = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Allow API requests to route naturally
        if full_path.startswith("api/"):
            return JSONResponse(status_code=404, content={"detail": "API endpoint not found"})
        target_file = os.path.join(frontend_dist, full_path)
        if os.path.isfile(target_file):
            return FileResponse(target_file)
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)

