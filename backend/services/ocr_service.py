import io
from typing import Tuple, Optional
from PIL import Image

try:
    import pytesseract
    HAS_PYTESSERACT = True
except ImportError:
    HAS_PYTESSERACT = False

class OcrService:
    @staticmethod
    def extract_text_from_bytes(image_bytes: bytes) -> Tuple[bool, str]:
        """
        Attempts to extract text using Tesseract OCR.
        Fails gracefully if Tesseract binary or library is unavailable.
        Returns: (success: bool, extracted_text_or_error_message: str)
        """
        if not HAS_PYTESSERACT:
            return (
                False,
                "OCR library is not configured in this environment. You can paste the message text directly into the text box instead."
            )

        try:
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            text = pytesseract.image_to_string(img).strip()
            if not text:
                return (
                    False,
                    "No legible text could be recognized in the uploaded screenshot. You can paste the message text directly instead."
                )
            return True, text
        except pytesseract.TesseractNotFoundError:
            return (
                False,
                "Tesseract OCR binary is not installed on this system host. You can paste the message text directly instead."
            )
        except Exception as e:
            return (
                False,
                f"Text extraction failed ({str(e)}). You can paste the message text directly instead."
            )
