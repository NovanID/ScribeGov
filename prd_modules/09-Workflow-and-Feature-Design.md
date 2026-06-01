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
