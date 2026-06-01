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
