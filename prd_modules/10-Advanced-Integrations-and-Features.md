## 10. Advanced Integrations & Features

### 10.1 OCR — Smart Letter Registration

- **Library/Service:** Tesseract (on-premises) with optional fallback to Google Vision API for higher accuracy.
- **Trigger:** User captures image via in-app camera or uploads a scanned file.
- **Processing:** Image is submitted as a background job (Laravel Queue). Result is returned via WebSocket or polling.
- **Fields Extracted:** Letter Number (`No. Surat`), Letter Date (`Tanggal Surat`), Letter Subject (`Perihal`), Sender (`Pengirim`).
- **Confidence Handling:** Each extracted field has a confidence score (0–100%). Fields below 70% confidence are highlighted in amber for user review.

### 10.2 WhatsApp API Integration (External Notification)

- **Provider:** WhatsApp Business API (via official partner: Twilio / Wati.io / local Indonesian provider).
- **Trigger Events:** New letter assigned, disposition received, signature requested, letter completed.
- **Message Template (approved by Meta):**
  ```
  📬 *Surat Baru — ScribeGov*
  Dari: {sender_name}
  Perihal: {subject_summary}
  Status: {urgency_level}
  
  Klik untuk buka surat:
  {magic_link}
  
  _(Link aktif selama 72 jam)_
  ```
- **Magic Link:** Tokenized deep-link → `/letter/{letter_id}?token={jwt_token}`. JWT expires in 72 hours. Clicking opens the app and authenticates the user if the session is valid.
- **Fallback:** If WhatsApp delivery fails (invalid number, API error), the system immediately falls back to email notification within 60 seconds.

### 10.3 BSrE API Integration — Electronic Signature (TTE)

- **Provider:** BSSN (Badan Siber dan Sandi Negara) — BSrE (Balai Sertifikasi Elektronik).
- **Authentication:** Each user's BSrE certificate is linked to their ScribeGov account via their registered NIK/NIP.
- **Single Sign Flow:**
  1. User clicks "TTE" → enters passphrase.
  2. Backend sends document + passphrase to BSrE API endpoint.
  3. BSrE returns signed document with embedded digital certificate.
  4. Signed PDF is stored; a QR code verification stamp is rendered on the final page.
- **Batch Sign Flow:**
  1. User selects multiple documents → clicks "TTE Massal".
  2. Enters passphrase once.
  3. Backend iterates through documents, sending each to BSrE API sequentially.
  4. Progress tracked and displayed in real-time.
- **Verification:** Any citizen/official can verify the signature by scanning the QR code on the document, which points to BSrE's public verification portal.

---
