## 13. MVP Release Timeline

### Overview

Total MVP development target: **5 months** (20 sprints of 1 week each, two-week sprint cycles = 10 sprints over 5 months).

| Phase | Duration | Key Deliverables |
|---|---|---|
| **Phase 0 — Setup & Architecture** | Weeks 1–2 | Repo setup, Docker infra, DB schema, API boilerplate |
| **Phase 1 — Core Letter Pipeline** | Weeks 3–6 | Inbox, Letter CRUD, PDF Viewer, User Auth, RBAC |
| **Phase 2 — Disposition Engine** | Weeks 7–10 | Disposition flow, Routing engine, Timeline, Org structure |
| **Phase 3 — Integrations** | Weeks 11–14 | TTE/BSrE, WhatsApp API, Email, OCR |
| **Phase 4 — Polish & UAT** | Weeks 15–18 | UI polish, bug fixes, UAT with pilot agency |
| **Phase 5 — Pilot Launch** | Weeks 19–20 | Pilot deployment, monitoring, hypercare |

---

### Phase 0 — Foundation Setup (Weeks 1–2)

- [ ] Initialize Laravel API project with Docker Compose configuration.
- [ ] Initialize Next.js 14 project with App Router and Tailwind (or custom CSS).
- [ ] Set up FilamentPHP admin panel.
- [ ] Define and migrate core database schema (letters, users, organizations, dispositions, audit_logs).
- [ ] Set up Redis and Laravel Horizon for queue management.
- [ ] Configure Nginx reverse proxy.
- [ ] Establish CI/CD pipeline (GitHub Actions or GitLab CI).
- [ ] Define API contract (OpenAPI/Swagger specification).

---

### Phase 1 — Core Letter Pipeline (Weeks 3–6)

**Sprint 1 (Weeks 3–4):**
- [ ] User authentication (login, logout, session management).
- [ ] RBAC implementation (Admin, Pimpinan, Staf TU, Staf Pelaksana roles).
- [ ] Letter registration API (create, read, update, delete).
- [ ] File upload for letter PDFs (secure storage, signed URL retrieval).
- [ ] Basic inbox API (list, filter by status, urgency).

**Sprint 2 (Weeks 5–6):**
- [ ] Inbox UI — letter list with urgency badges, search, filter.
- [ ] Letter detail UI — metadata header + embedded PDF viewer.
- [ ] Letter registration form UI (manual entry mode).
- [ ] Organizational unit CRUD in FilamentPHP admin panel.
- [ ] User management in FilamentPHP admin panel.

**Phase 1 Exit Criteria:** A Staf TU can log in, manually register a letter, upload a PDF, and view it in the inbox.

---

### Phase 2 — Disposition Engine (Weeks 7–10)

**Sprint 3 (Weeks 7–8):**
- [ ] Org chart graph data model implementation.
- [ ] Dijkstra routing algorithm service.
- [ ] Disposition API (create disposition, route suggestion, update status).
- [ ] Disposition note templates (system-configured).
- [ ] Audit trail logging for all disposition events.

**Sprint 4 (Weeks 9–10):**
- [ ] Swipe-to-disposition gesture UI (mobile).
- [ ] 1-Click disposition modal/sheet UI with auto-suggest recipient.
- [ ] Disposition timeline UI (vertical stepper with actor, action, timestamp).
- [ ] Letter status state machine (Diterima → Didisposisi → Dibaca → Selesai).
- [ ] Admin panel: disposition template management.

**Phase 2 Exit Criteria:** A full disposition chain can be completed end-to-end from Staf TU to Staf Pelaksana, with the timeline correctly reflecting each step.

---

### Phase 3 — Integrations (Weeks 11–14)

**Sprint 5 (Weeks 11–12):**
- [ ] WhatsApp API integration (notification dispatch, magic link generation).
- [ ] Email notification integration (transactional SMTP/Mailgun).
- [ ] Notification queue implementation with retry logic.
- [ ] Magic link authentication flow (JWT validation, session creation).

**Sprint 6 (Weeks 13–14):**
- [ ] BSrE API integration (single document signature).
- [ ] Batch signature UI and backend processing.
- [ ] QR code stamp generation on signed documents.
- [ ] OCR integration (Tesseract, image upload to queue, field extraction, confidence scoring).
- [ ] OCR-assisted letter registration UI (camera capture + auto-fill form).

**Phase 3 Exit Criteria:** A letter can be registered via OCR, dispositioned with WhatsApp notification received, and batch-signed via BSrE with QR verification stamp.

---

### Phase 4 — UI Polish & UAT (Weeks 15–18)

**Sprint 7 (Weeks 15–16):**
- [ ] Full dark mode design implementation per color system.
- [ ] Animation and micro-interaction polish (swipe gestures, toast notifications, loading states).
- [ ] PWA configuration (service worker, offline page, home screen install).
- [ ] Performance audit (Lighthouse score target: Mobile > 85).
- [ ] Cross-browser and cross-device testing.

**Sprint 8 (Weeks 17–18):**
- [ ] User Acceptance Testing (UAT) with 3–5 pilot agency users (representing each persona).
- [ ] Bug fixes from UAT feedback (P0 and P1 issues only).
- [ ] Security penetration test (basic scan + manual review).
- [ ] Deployment runbook documentation.
- [ ] Data migration plan (if agency has existing SRIKANDI data to import).

**Phase 4 Exit Criteria:** UAT sign-off from pilot agency representative. No P0 bugs open.

---

### Phase 5 — Pilot Launch & Hypercare (Weeks 19–20)

- [ ] Production deployment to pilot agency server.
- [ ] Admin onboarding: configure org structure, import users.
- [ ] Staff onboarding session (max 30-minute walkthrough).
- [ ] Monitoring setup: uptime alerts, error rate alerts, queue depth alerts.
- [ ] Hypercare: dedicated support channel for pilot agency (Weeks 19–20).
- [ ] Collect KPI baseline data (letters processed per day, avg disposition time, notification delivery rate).

---
