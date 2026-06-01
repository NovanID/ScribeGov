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
