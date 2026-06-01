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
