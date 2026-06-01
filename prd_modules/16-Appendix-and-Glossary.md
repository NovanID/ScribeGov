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
