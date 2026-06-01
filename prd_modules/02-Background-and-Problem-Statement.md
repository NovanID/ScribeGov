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
