## 5. User Stories & Acceptance Criteria

### Epic 1: Unified Inbox

#### US-001 — View Inbox
- **As a** civil servant (ASN),
- **I want to** see a clean, prioritized list of my incoming letters,
- **So that** I can immediately identify what requires my attention today.

**Acceptance Criteria:**
- [ ] Inbox loads within 1.5 seconds on a standard 4G connection.
- [ ] Each inbox item shows: **Letter Title, Sender Name, Date Received, Urgency Badge** (Normal / Important / Confidential).
- [ ] Urgency badges use distinct color coding: green (Normal), amber (Important), red (Confidential/Urgent).
- [ ] Inbox supports **infinite scroll** or pagination (max 20 items per load).
- [ ] Unread letters are visually distinct from read letters.
- [ ] A search bar is persistent at the top of the inbox with real-time filtering.

#### US-002 — Read a Letter with PDF Viewer
- **As a** civil servant,
- **I want to** open and read a letter's PDF directly in the app,
- **So that** I don't need to download the file or switch to a different application.

**Acceptance Criteria:**
- [ ] PDF opens within the app via an embedded viewer in under 2 seconds for files ≤ 5MB.
- [ ] PDF viewer supports pinch-to-zoom on mobile.
- [ ] Viewer displays page count and current page number.
- [ ] A "Disposition" CTA button is always visible while reading (sticky footer).
- [ ] Letter metadata (number, date, subject, sender) is collapsible above the PDF viewer.

---

### Epic 2: Disposition Workflow

#### US-003 — Swipe-to-Disposition (Mobile)
- **As a** Head of Division using a mobile phone,
- **I want to** swipe right on a letter in my inbox to initiate a quick disposition,
- **So that** I can process routine letters without opening each one fully.

**Acceptance Criteria:**
- [ ] Swipe right on an inbox item reveals a "Quick Disposition" action panel.
- [ ] The panel displays 3–5 pre-configured instruction templates (e.g., "Tindak Lanjuti / Follow Up", "Perhatikan / Note", "Selesaikan / Complete").
- [ ] Tapping a template pre-fills the disposition note field.
- [ ] The user can optionally edit the note before confirming.
- [ ] Disposition is confirmed with a single tap on "Kirim / Send".
- [ ] A success toast notification appears within 500ms of confirmation.
- [ ] The letter moves out of the active inbox immediately upon successful disposition.

#### US-004 — 1-Click Disposition (Full Flow)
- **As a** civil servant,
- **I want to** disposition a letter to one or more recipients with a short note in a single flow,
- **So that** I spend less time on administrative navigation.

**Acceptance Criteria:**
- [ ] From the letter detail view, a "Disposition" button opens a modal/sheet.
- [ ] The recipient field uses **auto-complete search** from the organizational directory.
- [ ] The system **suggests the next recipient** based on the Dijkstra routing algorithm for the org hierarchy.
- [ ] Disposition note is a free-text field (max 500 characters) with template shortcuts.
- [ ] The full action (select recipient + write note + send) completes in ≤ 3 taps/clicks.
- [ ] A disposition confirmation summary is shown before final submit.

#### US-005 — Automated Disposition Routing
- **As a** system,
- **I want to** automatically suggest the optimal disposition route through the organizational hierarchy,
- **So that** users don't need to manually know who the next recipient should be.

**Acceptance Criteria:**
- [ ] The org chart is stored as a weighted directed graph in the system.
- [ ] Dijkstra's algorithm calculates the shortest/optimal path from current position to target role.
- [ ] Routing suggestions are displayed as an ordered list of recipients.
- [ ] The user can override the suggested route.
- [ ] The system logs the actual route taken vs. the suggested route for audit purposes.

---

### Epic 3: Letter Tracking

#### US-006 — E-Commerce Style Disposition Timeline
- **As a** civil servant or manager,
- **I want to** see the full journey of a letter displayed as a vertical timeline,
- **So that** I can instantly understand where a letter is and who has acted on it.

**Acceptance Criteria:**
- [ ] Timeline displays each step chronologically: received → disposed → read → acted upon.
- [ ] Each timeline node shows: Actor Name, Role, Action Taken, Timestamp.
- [ ] Active/current step is visually highlighted.
- [ ] Completed steps are marked with a checkmark; pending steps show a clock icon.
- [ ] Timeline is accessible from both the inbox and the letter detail view.

---

### Epic 4: Smart Letter Registration (OCR)

#### US-007 — OCR Auto-Fill from Scanned Physical Letter
- **As a** Staf TU,
- **I want to** scan a physical letter using my phone camera and have the system automatically extract key fields,
- **So that** I don't have to manually type letter numbers, dates, and subjects.

**Acceptance Criteria:**
- [ ] The camera/scan interface is accessible from the "Add Letter" flow.
- [ ] After scanning, the system extracts: **Letter Number, Letter Date, Letter Subject, Sender Name** using OCR.
- [ ] Extracted data is pre-filled into the registration form with visual confidence indicators (highlight uncertain fields in yellow).
- [ ] The user can manually correct any extracted field before saving.
- [ ] OCR processing completes within 5 seconds of image capture.
- [ ] The original scan image is stored and linked to the letter record.

---

### Epic 5: Electronic Signature (TTE)

#### US-008 — Single Document Electronic Signature
- **As a** Kepala Dinas,
- **I want to** electronically sign a government document using my BSrE passphrase,
- **So that** I can sign documents remotely without a physical USB token.

**Acceptance Criteria:**
- [ ] A "Sign (TTE)" button is available on any letter awaiting signature.
- [ ] Tapping "Sign" prompts for the user's BSrE passphrase (securely, with password masking).
- [ ] The system calls the BSrE API with the document and passphrase.
- [ ] Upon success, a digital stamp/QR code is appended to the document.
- [ ] The signed document is stored and the letter status updates to "Signed".
- [ ] The process completes within 10 seconds.
- [ ] Failure (wrong passphrase, API timeout) shows a clear error with retry guidance.

#### US-009 — Batch Electronic Signature
- **As a** Kepala Dinas,
- **I want to** sign multiple documents in a single session using one passphrase entry,
- **So that** I don't have to enter my credentials repeatedly for each document.

**Acceptance Criteria:**
- [ ] A "Batch Sign" mode allows selection of multiple documents (checkboxes).
- [ ] One passphrase entry triggers sequential signing of all selected documents.
- [ ] A progress indicator shows: "Signing 3 of 7 documents...".
- [ ] Individual failures are logged without cancelling the entire batch.
- [ ] A summary report is shown after the batch completes (X signed, Y failed).

---

### Epic 6: External Notifications

#### US-010 — WhatsApp Notification on New Letter/Disposition
- **As a** civil servant,
- **I want to** receive a WhatsApp message when a new letter is assigned to me or I receive a disposition,
- **So that** I never miss time-sensitive correspondence even if I haven't opened the app.

**Acceptance Criteria:**
- [ ] WhatsApp notification is sent within 30 seconds of a letter/disposition being assigned.
- [ ] Message includes: **Sender, Subject summary (≤ 120 chars), Urgency Level, and a Magic Link** for direct deep-link access to the letter.
- [ ] Magic link is unique, time-limited (72 hours), and requires authentication after clicking.
- [ ] Notification delivery success/failure is logged in the system.
- [ ] Users can opt out of WhatsApp notifications in their profile settings (but email fallback remains mandatory).

#### US-011 — Email Notification Fallback
- **As a** civil servant,
- **I want to** receive email notifications for all letter events,
- **So that** I have a guaranteed fallback if WhatsApp delivery fails.

**Acceptance Criteria:**
- [ ] Email notification is sent for: new letter received, disposition received, signature requested, letter signed.
- [ ] Email includes HTML-formatted summary with a link to the letter.
- [ ] Email delivery uses a reliable transactional email service (e.g., SMTP relay, Mailgun).

---

### Epic 7: System Administration

#### US-012 — Manage Organizational Structure
- **As an** Admin Sistem,
- **I want to** configure and update the agency's organizational hierarchy in the system,
- **So that** disposition routing and user permissions reflect the actual org chart.

**Acceptance Criteria:**
- [ ] Admin panel provides a visual tree editor for the org structure.
- [ ] Supports multi-level hierarchy (e.g., Agency > Department > Division > Section > Staff).
- [ ] Changes to org structure are effective immediately for new dispositions.
- [ ] Historical dispositions are not affected by org structure changes.
- [ ] User-to-role assignments can be updated in bulk via CSV import.

---
