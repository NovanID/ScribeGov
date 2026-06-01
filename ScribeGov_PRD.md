# 📄 Product Requirements Document (PRD)
## ScribeGov — Dynamic Archiving & E-Office Digitalization Platform
### *A Modern B2G SaaS Alternative to SRIKANDI*

---

> **Document Metadata**
> | Field | Value |
> |---|---|
> | Version | 1.0.0 — Draft for Review |
> | Status | 🟡 Awaiting Stakeholder Approval |
> | Document Owner | Product & Architecture Team |
> | Classification | Internal — Confidential |
> | Last Updated | May 2026 |
> | Target Launch (MVP) | Q4 2026 |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Background & Problem Statement](#2-background--problem-statement)
3. [Target Users & Personas](#3-target-users--personas)
4. [Product Vision & Goals](#4-product-vision--goals)
5. [User Stories & Acceptance Criteria](#5-user-stories--acceptance-criteria)
6. [System Architecture](#6-system-architecture)
7. [Technology Specifications](#7-technology-specifications)
8. [UI/UX Design Guidelines](#8-uiux-design-guidelines)
9. [Workflow & Feature Design](#9-workflow--feature-design)
10. [Advanced Integrations & Features](#10-advanced-integrations--features)
11. [MVP Scope & Out-of-Scope](#11-mvp-scope--out-of-scope)
12. [Non-Functional Requirements](#12-non-functional-requirements)
13. [MVP Release Timeline](#13-mvp-release-timeline)
14. [Risks & Mitigations](#14-risks--mitigations)
15. [Success Metrics (KPIs)](#15-success-metrics-kpis)
16. [Appendix & Glossary](#16-appendix--glossary)

---

## 1. Executive Summary

**ScribeGov** is a modern, API-first government e-office platform that replaces the legacy SRIKANDI application across Indonesian government agencies. It is purpose-built for **Aparatur Sipil Negara (ASN)** — civil servants who process high volumes of formal correspondence and dispositions daily.

The platform digitizes the full lifecycle of government letters: **from creation and reception, through multi-tier disposition routing, to electronic signing and archival** — all accessible via a fast, intuitive mobile-first interface with no native app install required.

**Why it matters:**
- SRIKANDI suffers from chronic performance degradation, unintuitive UX, unreliable notifications, and no mobile-native experience — directly slowing down administrative workflows for thousands of civil servants.
- ScribeGov is designed as a **"Toll Road for Government Mail"**: fast, frictionless, and reliable, with every interaction optimized for a typical 8-hour government workday.

**Key differentiators vs. SRIKANDI:**
| Capability | SRIKANDI | ScribeGov |
|---|---|---|
| Mobile Performance | Slow WebView wrapper | Native SSR Next.js PWA |
| Disposition UX | Multi-click dropdowns | Swipe gesture + 1-click |
| Notification Reliability | Unreliable push | WhatsApp API (guaranteed) |
| Signature | Manual, per-document | Batch TTE via BSrE API |
| OCR / Smart Entry | None | Auto-extract from scan |
| Routing Intelligence | Manual hierarchy | Dijkstra graph auto-route |
| Deployment | Cloud SaaS only | Docker on-premises |

---

## 2. Background & Problem Statement

### 2.1 Context

Government agencies in Indonesia are mandated to implement electronic office systems for inter-agency and intra-agency correspondence management. The nationally designated platform, **SRIKANDI** (Sistem Informasi Kearsipan Dinamis Terintegrasi), has been adopted but faces significant operational resistance due to its user experience and technical shortcomings.

### 2.2 Current System Pain Points

#### 🐢 Performance & Accessibility
- The SRIKANDI mobile application loads slowly, with excessive resource consumption on low-to-mid range Android devices common among government employees.
- The mobile app is architecturally a **WebView wrapper over the desktop web app** — it does not behave like a native mobile application, lacks gesture support, and frequently causes forced closures (app crashes).
- Offline or low-bandwidth environments (common in regional agencies) render the app nearly unusable.

#### 🖥️ Rigid & Cluttered UI/UX
- The interface presents too much information simultaneously, creating cognitive overload.
- The **disposition process** — a core daily task — requires navigating multiple dropdowns and confirmation screens, averaging 7–10 clicks per action.
- No visual hierarchy to distinguish urgent vs. routine letters at a glance.
- Poor form UX with extensive mandatory fields that slow down letter entry.

#### 🔔 Inactive & Unreliable Notifications
- **Push notifications frequently fail** or arrive with significant delays, causing ASN to miss time-sensitive letters and disposition requests.
- No fallback notification channel is provided.
- This directly impacts response SLAs mandated by government regulation (e.g., Perpres No. 95/2018 on SPBE).

#### 🔍 Search, Indexing & Tracking Deficiencies
- Tracking the full history of a letter's disposition chain is non-trivial, requiring manual navigation through nested menus.
- Full-text search is limited, slow, and does not support filtering by date, urgency, or department.
- No visual representation of a letter's journey through the organizational hierarchy.

---

## 3. Target Users & Personas

### 3.1 Primary User Segments

| Persona | Role | Key Job-to-be-Done |
|---|---|---|
| **Staf TU (Tata Usaha)** | Administrative Staff | Receive, register, and route incoming letters; scan physical letters |
| **Kepala Divisi / Bidang** | Head of Division | Review letters, write disposition notes, forward to staff |
| **Kepala Dinas / Pimpinan** | Head of Agency | Approve, sign, and make final dispositions on critical correspondence |
| **Staf Pelaksana** | Operational Staff | Receive dispositioned letters, execute tasks, mark as complete |
| **Admin Sistem** | System Administrator | Manage users, org structure, archive configurations |

### 3.2 Persona Details

#### Persona A — "Rina" (Staf TU)
- **Age:** 28 | **Device:** Android mid-range phone, shared office desktop
- **Context:** Processes 30–80 incoming letters per day. Frequently switches between physical documents and the system.
- **Pain Points:** Manually typing letter numbers and dates from physical scans; uncertain whether the head has read a letter.
- **Goal:** Register a letter in under 60 seconds and know exactly where it went.

#### Persona B — "Pak Hendra" (Kepala Bidang)
- **Age:** 45 | **Device:** iPhone 12, laptop
- **Context:** Reviews 15–40 letters per day during office hours and frequently during commutes.
- **Pain Points:** Too many clicks to disposition a letter; misses notifications when traveling.
- **Goal:** Read a letter summary and disposition it in under 30 seconds, from a phone.

#### Persona C — "Bu Dewi" (Kepala Dinas)
- **Age:** 52 | **Device:** iPad, Windows laptop
- **Context:** Signs 5–20 documents per day. Approves final dispositions on sensitive matters.
- **Pain Points:** Signing documents requires separate USB token or traveling to the office.
- **Goal:** Batch-sign multiple documents remotely using a secure passphrase.

---

## 4. Product Vision & Goals

### 4.1 Product Vision Statement

> *"To be the most efficient and humane government e-office platform in Indonesia — where every civil servant can manage their entire correspondence workflow in seconds, not minutes, from any device, anywhere."*

### 4.2 Strategic Goals

- **Speed:** Reduce the average time-to-disposition from 5+ minutes (SRIKANDI) to under 30 seconds (ScribeGov).
- **Reliability:** Achieve 99.9% notification delivery rate via WhatsApp API fallback.
- **Adoption:** Reach 80% active daily use rate within 90 days of agency onboarding (vs. the ~30–40% typical for SRIKANDI rollouts).
- **Compliance:** Maintain full compliance with SPBE (Sistem Pemerintahan Berbasis Elektronik) standards and ANRI archiving guidelines.

### 4.3 Product Principles

- **Efficiency First:** Every screen must earn its existence. If a step doesn't move the letter forward, remove it.
- **Mobile-Native:** Designed for a phone first, desktop second — not the reverse.
- **Zero Training Burden:** New ASN should complete their first disposition within 5 minutes of first login, without a manual.
- **On-Premises Ready:** Full Docker deployment on agency local servers for data sovereignty compliance.

---

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

## 6. System Architecture

### 6.1 Architecture Overview (Text Description)

ScribeGov follows a **clean, API-First / Headless architecture** with strict separation between the data/business layer, the admin control plane, and the user-facing frontend.

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER-FACING LAYER                            │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │          Next.js Frontend (PWA — Mobile/Web)                │   │
│   │   • Server-Side Rendering (SSR) for instant load            │   │
│   │   • Pages: Inbox, Letter Detail, Disposition, Timeline,     │   │
│   │     Sign, Scan/OCR, Profile, Notifications                  │   │
│   │   • State: React Query (server state) + Zustand (UI state)  │   │
│   └─────────────────┬───────────────────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────────────────┘
                      │ HTTPS / REST API (JSON)
                      ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     API & BUSINESS LOGIC LAYER                      │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │              Laravel API (RESTful + Sanctum Auth)           │   │
│   │                                                             │   │
│   │  ┌──────────────┐  ┌────────────────┐  ┌───────────────┐   │   │
│   │  │ Letter Mgmt  │  │ Disposition    │  │ User & Org    │   │   │
│   │  │ Module       │  │ Routing Engine │  │ Module        │   │   │
│   │  │              │  │ (Dijkstra)     │  │               │   │   │
│   │  └──────────────┘  └────────────────┘  └───────────────┘   │   │
│   │  ┌──────────────┐  ┌────────────────┐  ┌───────────────┐   │   │
│   │  │ OCR Service  │  │ TTE / BSrE     │  │ Notification  │   │   │
│   │  │ Module       │  │ Integration    │  │ Dispatcher    │   │   │
│   │  └──────────────┘  └────────────────┘  └───────────────┘   │   │
│   └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│   ┌─────────────────────────────────────────────────────────────┐   │
│   │              FilamentPHP Admin Panel                        │   │
│   │   • User & Role Management                                  │   │
│   │   • Org Structure Editor                                    │   │
│   │   • Letter Type & Template Configuration                    │   │
│   │   • System Logs & Audit Trail Viewer                        │   │
│   │   • Notification Config (WhatsApp/Email keys)               │   │
│   └─────────────────────────────────────────────────────────────┘   │
└─────────────────────┬─────────────────────────────────────────────--┘
                      │
        ┌─────────────┼─────────────────────┐
        ▼             ▼                     ▼
┌──────────────┐ ┌──────────────┐  ┌───────────────────────────────┐
│   MySQL /    │ │  Redis Cache │  │     External Services         │
│   PostgreSQL │ │  + Queue     │  │  • BSrE API (BSSN) — TTE      │
│   (Primary   │ │  (Laravel    │  │  • WhatsApp Business API      │
│   Data Store)│ │   Horizon)   │  │  • SMTP / Mailgun (Email)     │
└──────────────┘ └──────────────┘  │  • OCR Engine (Tesseract /    │
                                   │    Google Vision API)         │
                                   └───────────────────────────────┘
```

### 6.2 Data Flow — Disposition Lifecycle

```
[Physical/Digital Letter Received]
        │
        ▼
[Staf TU: Scan → OCR Auto-fill → Register Letter]
        │
        ▼
[Letter created in system → Status: "Diterima"]
        │
        ▼
[Notification Dispatcher → WhatsApp + Email to recipient]
        │
        ▼
[Recipient: Open via Magic Link / App Inbox]
        │
        ├──→ [Read Letter (PDF Viewer)]
        │
        ▼
[Disposition Engine: Swipe / 1-Click]
        │
        ├──→ [Dijkstra Routing: Suggest Next Recipient]
        │
        ▼
[Disposition sent → Status: "Didisposisi"]
        │
        ▼
[Notification → Next recipient (WhatsApp/Email)]
        │
        ▼
[Chain repeats until: Final executor receives]
        │
        ▼
[Executor marks: "Selesai / Completed"]
        │
        ▼
[Letter archived → Audit timeline frozen]
```

### 6.3 Deployment Architecture (On-Premises Docker)

```
┌─────────────────────────────────────────────┐
│           Agency Local Server               │
│                                             │
│  ┌─────────────┐   ┌───────────────────┐   │
│  │  Nginx      │   │  Docker Network   │   │
│  │  Reverse    │──▶│                   │   │
│  │  Proxy      │   │  ┌─────────────┐  │   │
│  └─────────────┘   │  │ next-app    │  │   │
│                    │  │ (container) │  │   │
│                    │  └─────────────┘  │   │
│                    │  ┌─────────────┐  │   │
│                    │  │ laravel-api │  │   │
│                    │  │ (container) │  │   │
│                    │  └─────────────┘  │   │
│                    │  ┌─────────────┐  │   │
│                    │  │ mysql       │  │   │
│                    │  │ (container) │  │   │
│                    │  └─────────────┘  │   │
│                    │  ┌─────────────┐  │   │
│                    │  │ redis       │  │   │
│                    │  │ (container) │  │   │
│                    │  └─────────────┘  │   │
│                    └───────────────────┘   │
└─────────────────────────────────────────────┘
        │ HTTPS (outbound only)
        ▼
   External APIs
   (BSrE, WhatsApp, OCR)
```

---

## 7. Technology Specifications

### 7.1 Core Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Backend API** | Laravel 11 (PHP 8.3) | Battle-tested for government projects; strong ecosystem; Sanctum for stateless API auth |
| **Admin Panel** | FilamentPHP v3 | Rapid CRUD UI; built on Livewire; minimal JS; extremely fast for admin dashboards |
| **Frontend** | Next.js 14+ (App Router, SSR) | SSR for first-contentful-paint speed; React ecosystem; PWA support |
| **Database** | MySQL 8 / PostgreSQL 15 | Reliable relational DB for structured correspondence data |
| **Cache & Queue** | Redis + Laravel Horizon | Queue management for async notifications and OCR jobs |
| **Containerization** | Docker + Docker Compose | On-premises portability; environment consistency |
| **Reverse Proxy** | Nginx | SSL termination; static file serving; load balancing |
| **OCR Engine** | Tesseract OSS + optional Google Vision API | Local-first OCR; cloud fallback for higher accuracy |
| **State Management** | React Query (server) + Zustand (client) | Optimal for SSR + client-side interactivity |
| **API Auth** | Laravel Sanctum (SPA token) | Lightweight, session + token dual-mode |
| **File Storage** | Local disk (Docker volume) + optional MinIO S3 | On-premises document storage |

### 7.2 Key Technical Decisions

- **API-First Design:** All business logic is exposed via versioned REST API (`/api/v1/`). The admin panel and Next.js frontend are both consumers of this same API, ensuring consistency.
- **SSR for Mobile Performance:** Next.js SSR renders HTML on the server, meaning the browser receives a fully-rendered page — eliminating the blank screen / loading spinner problem in SRIKANDI's WebView.
- **Queue-Based Notification Dispatch:** WhatsApp and email notifications are dispatched via Redis queues (Laravel Horizon) to ensure API slowdowns don't block the disposition workflow.
- **Graph-Based Routing:** The org chart is stored as an adjacency list in the database. The Disposition Routing Engine loads this graph at runtime and applies Dijkstra's algorithm to compute the shortest path.

---

## 8. UI/UX Design Guidelines

### 8.1 Design Philosophy

- **Work Efficiency Over Aesthetics:** The interface must support 8 hours of daily use without causing eye fatigue or cognitive overload.
- **Mobile-First & Minimalist:** Designed in Figma at iPhone 13 frame dimensions (390 × 844px). Every component is tested at this resolution first.
- **Zero Redundancy:** If information is not actionable or immediately necessary, it is hidden by default.

### 8.2 Color Palette — Elegant Dark Mode

| Token Name | Hex Code | Usage |
|---|---|---|
| `color-bg-primary` | `#132440` | Main application background (dark navy) |
| `color-surface-card` | `#16476A` | Document cards, modals, sheets (teal blue) |
| `color-accent-primary` | `#3B9797` | Primary CTA buttons, links, active state indicators (sharp cyan) |
| `color-status-urgent` | `#BF092F` | "Urgent" / "Rahasia" badge, destructive actions (warning red) |
| `color-text-primary` | `#F0F4F8` | Primary text on dark backgrounds |
| `color-text-secondary` | `#8DA4BF` | Metadata, timestamps, secondary labels |
| `color-border-subtle` | `#1E3A5F` | Card borders, dividers |
| `color-surface-overlay` | `#0D1929` | Backdrop overlays, bottom sheets |

### 8.3 Typography

- **Font Family:** `Inter` (Google Fonts) — optimized for screen legibility at small sizes.
- **Scale:**
  - `H1` — 24px / 700 weight — Page titles
  - `H2` — 18px / 600 weight — Section headers
  - `Body` — 14px / 400 weight — Letter content, descriptions
  - `Caption` — 12px / 400 weight — Timestamps, metadata

### 8.4 Inbox Item Design

```
┌────────────────────────────────────────────────┐
│  [🔴 URGENT]                       14 May 2026 │
│  Undangan Rapat Koordinasi Nasional             │
│  Kementerian PAN-RB                            │
│                                    [> Swipe]   │
└────────────────────────────────────────────────┘
```

**Inbox Card Rules:**
- Displays: Urgency Badge, Letter Title, Sender Name, Date Received.
- **Does NOT display:** Letter body, attachment count, disposition chain — these are one tap away.
- Maximum 2 lines for letter title (truncated with ellipsis).
- Tap anywhere on the card → opens Letter Detail.
- Swipe right → Quick Disposition panel.

### 8.5 Component Specifications

| Component | Behavior | Notes |
|---|---|---|
| **Inbox List** | Infinite scroll, pull-to-refresh | Search bar sticky at top |
| **Letter Detail** | Collapsible header + embedded PDF | Sticky "Disposition" footer button |
| **Disposition Sheet** | Bottom slide-up sheet (modal) | Auto-suggest recipient from Dijkstra |
| **Timeline View** | Vertical stepper UI | Each step: Avatar, Name, Role, Action, Time |
| **OCR Scanner** | Camera overlay with auto-capture | Confidence score displayed per field |
| **Signature Modal** | Centered modal with passphrase field | Password strength-masked input |
| **Notification Toast** | Bottom snackbar, auto-dismiss 3s | Success: cyan; Error: red |

---

## 9. Workflow & Feature Design

### 9.1 Disposition Workflow Detail

#### Standard Disposition Flow (Desktop/Web)
1. User opens inbox → selects a letter.
2. Reads the PDF in the embedded viewer.
3. Taps "Disposition" (sticky button).
4. System auto-suggests recipient based on org graph.
5. User accepts suggestion or manually searches.
6. Selects a note template or writes a custom note.
7. Taps "Kirim" → confirmation dialog → "Konfirmasi".
8. Success toast → letter removed from active inbox.

#### Quick Disposition Flow (Mobile — Swipe)
1. User sees inbox → swipes right on a letter card.
2. Quick Disposition panel slides in.
3. User taps a template instruction (e.g., "Tindak Lanjuti").
4. System auto-fills recipient from routing engine.
5. User confirms with a single tap.
6. Letter exits inbox. **Total: 2 taps, 0 typing.**

### 9.2 Disposition Routing Engine (Dijkstra Implementation)

**Data Model:**
```
Node: OrganizationUnit { id, name, level, parent_id, weight }
Edge: ReportingLine { from_unit_id, to_unit_id, weight }
```

**Algorithm Steps:**
1. Load org graph from cache (Redis, TTL 5 minutes).
2. Set source node = current user's organizational unit.
3. Set target = letter's classification category → mapped to target role level.
4. Run Dijkstra → return ordered list of intermediate nodes (routing path).
5. Present top-1 as primary suggestion; show full path as preview in the disposition modal.

**Override Rules:**
- User can always override the suggested recipient.
- If skipping a level (e.g., direct to two levels up), the system logs a "skip" event for audit.

### 9.3 Letter Tracking Timeline

```
● Received by TU                              [14 May, 08:12]
│   Rina Susanti — Staf TU, Bagian Umum
│
● Disposed by Kepala Bagian                   [14 May, 09:45]
│   Budi Hartono — Kepala Bagian Umum
│   Note: "Tindak lanjuti segera"
│
● Read by Kepala Bidang                       [14 May, 10:30]
│   Hendra Wijaya — Kepala Bidang Perencanaan
│
◌ Assigned to Staff (Pending)                 [Awaiting...]
    Assigned to: Staf Pelaksana Perencanaan
```

---

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

## 11. MVP Scope & Out-of-Scope

### 11.1 MVP — "Toll Road" Scope ✅

The MVP focuses exclusively on the core letter processing pipeline. Every feature must justify its inclusion by directly enabling a letter to move from reception to resolution.

| # | Feature | Priority | Included in MVP |
|---|---|---|---|
| 1 | **Unified Inbox** — Centralized inbox with fast PDF viewer | P0 | ✅ Yes |
| 2 | **1-Click Disposition** — Forwarding with short notes | P0 | ✅ Yes |
| 3 | **Swipe Disposition** — Quick disposition on mobile | P0 | ✅ Yes |
| 4 | **Disposition Timeline** — E-commerce style tracking | P1 | ✅ Yes |
| 5 | **Electronic Signature (TTE)** — via BSrE API + QR stamp | P0 | ✅ Yes |
| 6 | **WhatsApp Notification** — With magic link | P0 | ✅ Yes |
| 7 | **Email Notification** — Fallback channel | P0 | ✅ Yes |
| 8 | **OCR Smart Entry** — From camera scan | P1 | ✅ Yes |
| 9 | **Org Structure Management** — Admin panel | P1 | ✅ Yes |
| 10 | **Basic Search & Filter** — By title, sender, date, urgency | P1 | ✅ Yes |

### 11.2 Post-MVP (Future Releases) 🚫

| Feature | Planned Release |
|---|---|
| Archive Retention Schedule (Jadwal Retensi Arsip / JRA) | v1.2 |
| Inter-agency letter routing (antar instansi) | v1.3 |
| AI-based letter classification & summarization | v1.4 |
| Advanced reporting & analytics dashboard | v1.3 |
| Audit export to ANRI-compliant formats | v1.2 |
| Multi-agency deployment (SaaS multi-tenant) | v2.0 |
| Mobile native app (React Native / Flutter) | v2.0 |

---

## 12. Non-Functional Requirements

### 12.1 Performance

- **API Response Time:** 95th percentile < 500ms for read operations; < 1500ms for write operations.
- **Frontend First Contentful Paint (FCP):** < 1.5 seconds on 4G mobile.
- **PDF Viewer Load:** < 2 seconds for files ≤ 5MB.
- **Concurrent Users:** System must support at least 200 concurrent users per agency deployment without degradation.

### 12.2 Security

- **Authentication:** Laravel Sanctum with SPA token; session timeout after 8 hours of inactivity.
- **Authorization:** Role-Based Access Control (RBAC) with predefined roles: Admin, Pimpinan, Kepala Bidang, Staf TU, Staf Pelaksana.
- **Data Encryption:** All data in transit via TLS 1.3. Database-level encryption for sensitive fields (passphrase hashes, NIK).
- **Magic Link Security:** JWT tokens for magic links; single-use enforcement; 72-hour TTL.
- **Audit Trail:** Immutable audit log for all letter events (created, read, disposed, signed, archived).
- **File Storage:** Documents stored in a private volume, not publicly accessible. Served via signed URLs with expiry.

### 12.3 Reliability & Availability

- **Target Uptime:** 99.5% (excluding planned maintenance windows).
- **Notification Queue Reliability:** WhatsApp/Email queue retries up to 3 times with exponential backoff.
- **Data Backup:** Automated daily database backup with 30-day retention.

### 12.4 Compliance

- **SPBE (Sistem Pemerintahan Berbasis Elektronik):** Compliant with Perpres No. 95/2018.
- **ANRI Guidelines:** Letter registration and archival metadata compliant with Perka ANRI standards.
- **BSrE/TTE Compliance:** Electronic signatures comply with UU ITE and PerBSSN regarding digital signatures.
- **Data Residency:** All data remains on the agency's on-premises server; no letter content is transmitted to external cloud storage.

### 12.5 Usability

- **Zero Training Goal:** New users complete first disposition in < 5 minutes without training.
- **Accessibility:** Minimum WCAG 2.1 AA compliance for text contrast ratios.
- **Browser Support:** Latest 2 versions of Chrome, Firefox, Safari. No Internet Explorer support.

---

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

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| BSrE API instability or changes | Medium | High | Implement adapter pattern; mock BSrE in dev/staging. Build retry + fallback to manual signature stamp. |
| WhatsApp API business verification delay | Medium | High | Start Meta Business verification process in Week 1. Use email-only during pilot if WhatsApp approval pending. |
| OCR accuracy insufficient for complex letter formats | High | Medium | Implement manual correction flow for all OCR fields. Set user expectation: OCR is assistance, not replacement. |
| On-premises server hardware limitations at agencies | Medium | Medium | Define minimum hardware spec in deployment runbook (8GB RAM, 4 vCPU, 100GB SSD). Provide Docker resource limits. |
| SRIKANDI data migration complexity | Medium | Medium | Scope data migration as a paid separate engagement. MVP does not require migration. |
| ASN adoption resistance | Medium | High | Design zero-training UX. Provide in-app contextual tooltips. Conduct persona-based UAT to validate ease of use. |
| Government security audit requirements | Low | High | Maintain audit trail, RBAC, and TLS compliance from Day 1. Prepare security documentation proactively. |

---

## 15. Success Metrics (KPIs)

### 15.1 Adoption Metrics (30 / 60 / 90 Days Post-Launch)

| Metric | Target (30d) | Target (60d) | Target (90d) |
|---|---|---|---|
| Daily Active Users (DAU) | 40% of registered users | 60% | 80% |
| Letters Processed via ScribeGov | 30% of total agency mail | 60% | 90% |
| Mobile vs. Desktop Usage | 60% mobile | 65% mobile | 70% mobile |

### 15.2 Operational Efficiency Metrics

| Metric | Baseline (SRIKANDI) | ScribeGov Target |
|---|---|---|
| Average time-to-disposition per letter | ~5–8 minutes | < 60 seconds |
| Notification delivery rate | ~60–70% | ≥ 98% |
| Letter registration time (manual) | ~5 minutes | < 2 minutes |
| Letter registration time (OCR-assisted) | N/A | < 60 seconds |
| Batch signature time (10 documents) | ~30 minutes (manual) | < 5 minutes |

### 15.3 Technical Performance Metrics

| Metric | Target |
|---|---|
| API p95 response time | < 500ms |
| Mobile FCP (4G) | < 1.5 seconds |
| System uptime | ≥ 99.5% |
| WhatsApp delivery failure rate | < 2% |
| P0 production bugs per month | ≤ 1 |

### 15.4 User Satisfaction

| Metric | Target |
|---|---|
| Net Promoter Score (NPS) at 90 days | ≥ 50 |
| First-disposition completion without help | ≥ 90% of new users |
| Support ticket volume per 100 users/month | < 5 |

---

## 16. Appendix & Glossary

### 16.1 Glossary

| Term | Definition |
|---|---|
| **ASN** | Aparatur Sipil Negara — Indonesian civil servant |
| **TU** | Tata Usaha — Administrative/clerical unit of a government agency |
| **Disposisi** | The act of forwarding and annotating a letter to a subordinate or relevant party with instructions |
| **TTE** | Tanda Tangan Elektronik — Electronic Signature |
| **BSrE** | Balai Sertifikasi Elektronik — the government's electronic certification authority under BSSN |
| **BSSN** | Badan Siber dan Sandi Negara — National Cyber and Encryption Agency |
| **SRIKANDI** | Sistem Informasi Kearsipan Dinamis Terintegrasi — the existing national government e-office platform |
| **SPBE** | Sistem Pemerintahan Berbasis Elektronik — Electronic-Based Government System framework |
| **ANRI** | Arsip Nasional Republik Indonesia — National Archives of Indonesia |
| **JRA** | Jadwal Retensi Arsip — Archive Retention Schedule |
| **NIK** | Nomor Induk Kependudukan — National Identity Number |
| **NIP** | Nomor Induk Pegawai — Civil Servant Registration Number |
| **Magic Link** | A tokenized, time-limited URL sent via WhatsApp/Email that authenticates the user and deep-links directly to a specific letter |
| **PWA** | Progressive Web App — a web app with native-app-like capabilities (installable, offline support) |
| **OCR** | Optical Character Recognition — technology to extract text from images/scans |
| **Dijkstra** | A graph theory algorithm used here to find the optimal disposition routing path through the org hierarchy |

### 16.2 API Contract Summary (Key Endpoints)

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/auth/login` | POST | Authenticate user, return Sanctum token |
| `/api/v1/letters` | GET | List inbox letters (filtered, paginated) |
| `/api/v1/letters` | POST | Register a new letter |
| `/api/v1/letters/{id}` | GET | Get letter detail + metadata |
| `/api/v1/letters/{id}/file` | GET | Get signed URL for PDF access |
| `/api/v1/letters/{id}/dispositions` | POST | Create a new disposition |
| `/api/v1/letters/{id}/timeline` | GET | Get full disposition timeline |
| `/api/v1/letters/{id}/sign` | POST | Submit TTE signature request to BSrE |
| `/api/v1/letters/batch-sign` | POST | Batch TTE signature for multiple letters |
| `/api/v1/routing/suggest` | POST | Get Dijkstra-based routing suggestion |
| `/api/v1/ocr/extract` | POST | Submit image for OCR field extraction |
| `/api/v1/users` | GET / POST | User management |
| `/api/v1/organizations` | GET / POST | Org unit management |

---

*End of Document — ScribeGov PRD v1.0.0*

---
> **Review & Approval Checklist**
> - [ ] Product Owner review
> - [ ] Tech Lead Architecture review
> - [ ] Security Officer review
> - [ ] Pilot Agency Representative review
> - [ ] Final approval for Sprint 0 kickoff
