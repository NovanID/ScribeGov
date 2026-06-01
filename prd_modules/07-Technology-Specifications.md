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
