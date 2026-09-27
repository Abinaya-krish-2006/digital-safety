# TRUSTCHAIN AI

> **"Don't just detect the threat. Break the chain."**

*Digital Safety & Cybersecurity MVP — Built for HackNowa Hackathon*

---

## 📌 Problem Overview
Modern cyber threats and social-engineering scams rarely happen in a single, isolated step. Instead, attackers construct multi-stage kill chains:
1. **Initial contact** via an unverified social profile or spoofed sender.
2. **Trust building & urgency** using realistic pretexts (e.g. KYC suspensions, job interviews, or clearance sales).
3. **Escalation** through malicious links, screen sharing, or counterfeit payment checkouts.
4. **Final exploit** via OTP theft, personal account money transfers, or sideloaded APK installations.

Most existing security tools check only a single item at a time (e.g. scanning a domain or blocking a keyword). **TRUSTCHAIN AI** connects multiple pieces of user evidence into a structured **Attack Chain graph**, explains the threat in plain language, and highlights the **Break the Chain** intervention point before irreversible damage occurs.

---

## 🚀 Key Features

### 1. Multi-Vector Digital Checkers
- **💬 Message / OTP Safety (Module B — Tier 1):** Scans messages and screenshots for 2FA/OTP harvesting, account suspension threats, urgency patterns, and remote-access requests.
- **💳 Payment / UPI Guard (Tier 1):** Detects personal VPA/UPI routing, advance registration fees, and pretext patterns.
- **🔗 Website / Link Guard (Module C — Tier 1):** Inspects raw IP hosting, protocol security, brand lookalike typosquatting, and phishing path structures.
- **🛍️ Online Shop Checker & Identity Consistency (Module A & Section 21 — Tier 2):** Flags mismatched payment recipients (e.g. shop claims to be *"ABC Fashion"* but payment routes to an unrelated individual *"Raj Kumar"*), extreme discounts (>70%), and disposable domains.
- **👤 Profile Checker (Module E — Tier 3):** Flags new disposable accounts, brand impersonations, and off-platform redirection to Telegram/WhatsApp.
- **📱 App / QR Checker (Module F — Tier 3):** Identifies unauthorized `.apk` sideload downloads, chat QR codes, and invasive system permissions.

### 2. Signature Attack Chain Visualization (Module D)
An interactive visual flow connecting each phase of the attack—from initial engagement to the exploit payload—with contextual explanations for every node.

### 3. 🛑 Break The Chain (Signature Intervention Card)
Pinpoints the exact, highest-leverage decision point where the user can stop the attack (e.g. *"Do not share the OTP under any circumstance"* or *"Do not transfer money to personal accounts"*).

### 4. Trust Drift Progression (Section 11)
A behavioral progression chart showing how attackers cultivate perceived trust (20% → 45% → 75% → 95%) before escalating to sensitive demands.

### 5. Deterministic + AI Hybrid Architecture (Section 12 & 28)
- **100% Offline Rule Engine:** Deterministic rule engine detects critical indicators locally with zero API latency and zero cost.
- **AI Reasoning Integration:** Contextual AI enhancement via Gemini API when `GEMINI_API_KEY` is configured.
- **Fail-Safe Fallback:** If the AI API is unreachable or omitted, the application runs on the rule engine with zero crashes.

### 6. Privacy-First & Zero-Credential Retention (Section 18)
- Never asks for, collects, or stores passwords, CVVs, PINs, or sensitive banking credentials.
- Ephemeral in-memory image analysis.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Vanilla CSS Design System with glassmorphism, Lucide Icons
- **Backend:** Python 3, FastAPI, Uvicorn, Pydantic, Httpx
- **OCR Engine:** Tesseract OCR (via `pytesseract`) with graceful non-crashing fallback
- **Image Hashing:** Lightweight perceptual hash (`imagehash` + Pillow) for demo image reuse detection
- **AI Enhancement:** Google Gemini REST API (with offline rule-engine fallback)

---

## 💻 Installation & Quickstart

### Prerequisites
1. **Python 3.10+** (tested on Python 3.10 – 3.14)
2. **Node.js 18+** & **npm** (for building the frontend)
3. *(Optional)* **Tesseract OCR:**
   - **Ubuntu/Debian:** `sudo apt-get install tesseract-ocr`
   - **macOS:** `brew install tesseract`
   - **Windows:** Download from [UB-Mannheim Tesseract](https://github.com/UB-Mannheim/tesseract/wiki).
   > *Note:* If Tesseract is not installed on the system, the application continues to run normally and prompts the user to paste message text directly.

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/trustchain-ai.git
cd trustchain-ai
```

### Step 2: Set Up Backend
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# (Optional) Configure Gemini API Key
cp backend/.env.example backend/.env
# Edit backend/.env and insert your GEMINI_API_KEY (or leave blank for offline rule mode)
```

### Step 3: Run the Full-Stack Application
You can run the application with a single command:
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
Open **[http://127.0.0.1:8000](http://127.0.0.1:8000)** in your browser!

---

### Alternative: Running with Frontend Hot-Reloading (For Development)
If you want to edit React components live:

**Terminal 1 (Backend):**
```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173** (API calls will be proxied automatically to port 8000).

---

## 🧪 Demo Scenarios (For Hackathon Judges)

Open **[http://127.0.0.1:8000](http://127.0.0.1:8000)** and click **"Demo Mode"** in the top navigation:
1. **Demo 1 — Fake Instagram Shop & Identity Mismatch:**
   - 90% luxury discount ($45 vs $450).
   - Identity Check: Storefront `"ABC Fashion Outlet"` vs Payment Recipient `"Raj Kumar"`.
   - Expected Result: `VERIFY 🟠`
2. **Demo 2 — Bank Account Freeze & OTP Theft:**
   - Urgent message threatening account suspension unless a 6-digit OTP is shared.
   - Expected Result: `HIGH RISK 🔴` (Break the chain: *"Do not share the OTP"*).
3. **Demo 3 — Fake Job Offer & Upfront Registration Fee:**
   - Unverified recruiter on WhatsApp offering $70/hr remote job but requiring a $150 deposit.
   - Expected Result: `HIGH RISK 🔴` (Break the chain: *"Do not pay upfront fees"*).

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status and engine capabilities |
| `POST` | `/api/analyze/message` | Evaluates message text, urgency, and OTP signals |
| `POST` | `/api/analyze/shop` | Analyzes online store parameters & identity alignment |
| `POST` | `/api/analyze/url` | Evaluates link structure, IP hosting, and typosquatting |
| `POST` | `/api/analyze/payment` | Inspects UPI/VPA handles and transfer pretexts |
| `POST` | `/api/analyze/screenshot` | OCR text extraction + perceptual image hash check |
| `POST` | `/api/analyze/profile` | Checks profile handle, age, and impersonation flags |
| `POST` | `/api/analyze/qr` | Inspects QR destination links and sideloaded APK risks |
| `GET` | `/api/demo/{scenario}` | Fetches pre-configured evaluation scenarios |
| `GET` | `/api/dashboard` | Returns operational aggregate threat intelligence |

---

## 🛡️ Privacy & Compliance Disclaimer

> **Official Disclaimer (Section 32):**
> *"TRUSTCHAIN AI provides risk indicators and safety guidance based on the evidence provided. It does not guarantee that an account, website, seller, message, or transaction is legitimate or fraudulent. Users should independently verify important information through trusted official channels."*

---

## 📄 License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
