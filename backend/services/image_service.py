import os
import io
from typing import Optional, Tuple, Any
from PIL import Image

try:
    import imagehash
    HAS_IMAGEHASH = True
except ImportError:
    HAS_IMAGEHASH = False

class ImageService:
    KNOWN_IMAGES_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "demo", "sample_data", "known_images")

    @classmethod
    def get_image_hash(cls, image_bytes: bytes) -> Optional[Any]:
        if not HAS_IMAGEHASH:
            return None
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            return imagehash.phash(img)
        except Exception:
            return None

    @classmethod
    def check_reuse_signal(cls, image_bytes: bytes, threshold: int = 12) -> Tuple[bool, Optional[str]]:
        """
        Demo-scope image-similarity check (compares against a small sample set, not the open web).
        Returns: (is_reused_match, details_string)
        """
        if not HAS_IMAGEHASH:
            return False, None
        
        target_hash = cls.get_image_hash(image_bytes)
        if target_hash is None:
            return False, None

        if not os.path.exists(cls.KNOWN_IMAGES_DIR):
            return False, None

        for fname in os.listdir(cls.KNOWN_IMAGES_DIR):
            if fname.lower().endswith((".png", ".jpg", ".jpeg", ".webp")):
                fpath = os.path.join(cls.KNOWN_IMAGES_DIR, fname)
                try:
                    with open(fpath, "rb") as f:
                        ref_hash = cls.get_image_hash(f.read())
                    if ref_hash is not None:
                        dist = target_hash - ref_hash
                        if dist <= threshold:
                            return True, f"Matches stock/reused asset '{fname}' (distance {dist}). Commonly reused across unrelated storefronts."
                except Exception:
                    continue

        return False, None
