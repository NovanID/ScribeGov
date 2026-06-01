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
