# SentinelX — Complete Platform Architecture & Execution Guide

SentinelX is an explainable AI surveillance and forensic investigation platform that transforms raw CCTV video streams into actionable, court-admissible forensic evidence.

---

## 1. Quick Start

### Frontend (Next.js 15 + TypeScript + Tailwind + Framer Motion)
```bash
npm run dev
# Starts local web application at http://localhost:3000
```

### Backend (Python FastAPI + SQLite AI Engine)
```bash
python -m backend.seed
npm run backend
# Or: uvicorn backend.main:app --reload --port 8000
```

---

## 2. Completed Phase Deliverables

### Prototype Roadmap (Phases 1–13)
- ✅ **Phase 1: Scope & User Journey** — Single investigator story: incident alert $\rightarrow$ investigation $\rightarrow$ evidence verification $\rightarrow$ report generation.
- ✅ **Phase 2: User Flow** — End-to-end interactive navigation pipeline defined and implemented.
- ✅ **Phase 3: Information Architecture** — Sitemaps and 6 primary workspaces (`/dashboard`, `/cameras`, `/incidents`, `/evidence`, `/ai-search`, `/report`).
- ✅ **Phase 4: Low-Fidelity Wireframes** — Detailed ASCII layouts created in [`docs/ARCHITECTURE_AND_DESIGN.md`](file:///c:/Users/alonso/Documents/SentinelX/docs/ARCHITECTURE_AND_DESIGN.md).
- ✅ **Phase 5: Design System** — Tactical SOC design tokens with semantic severity indicators (🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Normal).
- ✅ **Phase 6: High-Fidelity Screens** — Polished, GPU-accelerated interactive views built with React 19 and Tailwind CSS.
- ✅ **Phase 7: Realistic Mock Data** — 4 distinct CCTV feeds, 4 real-world incident classifications, and full cryptographic evidence payloads.
- ✅ **Phase 8: Clickable Interactions** — Timeline scrubbing, camera switching, zone toggling, face redaction, and instant jumps.
- ✅ **Phase 9: Simulated AI** — Bounding box tracking, confidence scores, and rule invariant checkers.
- ✅ **Phase 10: Investigation Story Demo** — Guided 7-step interactive top-banner tour.
- ✅ **Phase 11–13: Polish & Refinement** — High-contrast WCAG 2.2 compliant dark mode with zero horizontal overflow.

### Development Engine Roadmap (Phases 0–16)
- ✅ **Database Schema (Phase 0 & 6)**: SQLite schema initialized with `cameras`, `incidents`, `evidence`, and `audit_logs` tables.
- ✅ **Video Input & Upload (Phase 1)**: User file drag & drop upload support for custom CCTV footage.
- ✅ **Smart Security Zones (Phase 4)**: Normalized polygon and bounding geometry with configurable dwell time thresholds.
- ✅ **Event Detection Engine (Phase 5)**: 4 automated event detectors (Intrusion, Abandoned Object, Crowd Formation, Rapid Movement).
- ✅ **Explainable AI (Phase 10)**: Step-by-step causal deduction traces explaining *why* alerts triggered.
- ✅ **Privacy Protection (Phase 11)**: Real-time head/face redaction blur filter for GDPR/CJIS compliance.
- ✅ **Evidence Integrity & Tamper Testing (Phase 12)**: SHA-256 cryptographic chain of custody with simulated tamper testing.
- ✅ **Natural Language Investigation (Phase 13)**: AI cognitive search bar with smart query suggestions.
- ✅ **Court-Ready Reports (Phase 14)**: Automated 1-click forensic incident dossiers with digital signatures.
