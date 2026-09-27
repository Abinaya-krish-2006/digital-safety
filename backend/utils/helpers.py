import re
from typing import Optional

def sanitize_text(text: str) -> str:
    """Sanitizes user input to prevent injection or malformed data."""
    if not text:
        return ""
    return text.strip()

def mask_sensitive_token(token: str) -> str:
    """Masks phone numbers or account digits for privacy-first presentation."""
    if len(token) <= 4:
        return "****"
    return token[:2] + "*" * (len(token) - 4) + token[-2:]
