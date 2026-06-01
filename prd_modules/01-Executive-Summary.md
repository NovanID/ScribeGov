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
