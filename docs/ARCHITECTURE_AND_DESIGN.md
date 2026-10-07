# SentinelX — Architecture, Design System & Phase Blueprint

## 1. Prototype Scope & User Journey (Phase 1)

### Primary Investigation Story
An investigator receives an AI-generated incident alert from a monitored CCTV feed, investigates the timeline and bounding-box tracking telemetry, inspects explainable AI reasoning, verifies cryptographic SHA-256 evidence integrity (with optional GDPR/privacy face-blurring), queries natural language search across cameras, and exports a court-ready incident report.

### Core Feature Matrix
| Module | Prototype Capability | Full-Stack Engine Capability |
|---|---|---|
| **Dashboard** | Active camera matrix, live alert ticker, severity breakdown, system health | Real-time telemetry aggregation from SQLite/FastAPI & Next.js API |
| **Video Input & CCTV** | Multi-camera switcher (`CAM-01` to `CAM-04`) + custom video upload | Drag-and-drop MP4/WebM upload, metadata extraction, frame analysis |
| **Object Detection & Tracking** | Real-time bounding box overlays (`Person #17`, `Bag #04`, `Vehicle #09`) | YOLOv8 / OpenCV motion & contour + heuristic multi-object tracker |
| **Smart Security Zones** | Interactive polygon/rectangle zone editor directly on the video canvas | Persistent normalized coordinates `(x, y)` with configurable dwell thresholds |
| **Event Detection Engine** | 4 automated event classes: Restricted Intrusion, Abandoned Object, Crowd Formation, Rapid Movement | Rule + spatial-temporal state machine evaluating object tracks against active zones |
| **Explainable AI (XAI)** | Step-by-step causal checklist explaining *why* an alert triggered | Structured rule-trace log with confidence breakdown, dwell time, and velocity vectors |
| **Privacy Mode** | Real-time toggleable face/identity redaction blur on video & evidence | Dynamic head/face region Gaussian blur filter in canvas & evidence export |
| **Evidence Integrity** | SHA-256 cryptographic hash badge + tamper-simulation tester | Real SHA-256 computation over evidence payload + tamper verification audit |
| **AI Investigation Search** | Natural language query bar (`"Show high severity incidents from CAM-03"`) | Semantic + structured NL parser filtering camera, severity, event type, and time |
| **Report Generation** | One-click court-ready forensic PDF/print investigation report | Automated compilation of incident metadata, XAI trace, and verified evidence hashes |

---

## 2. User Flow Architecture (Phase 2)

```
[Login / Operator Auth]
          │
          ▼
     [Dashboard] ──────────────────────► [Upload Custom Video]
          │                                       │
          ▼                                       ▼
  [Camera Selection] ◄──────────────── [AI Frame & Track Analysis]
          │
          ▼
 [Live / Recorded CCTV + Smart Zones]
          │
          ▼
  [Incident Detected] (Real-time Alert Banner & Timeline Marker)
          │
          ▼
  [Incident Details & Investigation View]
     ├──► [Timeline Scrubbing (Jump to Exact Timestamp)]
     ├──► [Explainable AI (Causal Detection Breakdown)]
     └──► [Privacy Mode (Automatic Face Redaction)]
          │
          ▼
  [Evidence Vault & SHA-256 Integrity Verification]
          │
          ▼
  [AI Natural Language Investigation Search]
          │
          ▼
  [Generate & Export Official Forensic Report]
```

---

## 3. Information Architecture & Sitemap (Phase 3)

```
SENTINELX
│
├── 01. Dashboard          (Overview KPIs, Severity Distribution, Active Camera Grid, Live Feed)
├── 02. Cameras & Upload   (Live CCTV Matrix, Smart Security Zone Drawer, Custom Video Upload & AI Processor)
├── 03. Incidents          (Filterable Incident Feed, Timeline Scrubbing, Risk & Severity Engine)
├── 04. Evidence Vault     (Extracted Clips, Snapshots, SHA-256 Hash Verifier, Tamper Test, Privacy Mode)
├── 05. AI Investigation   (Natural Language Query Console, Cross-Camera Correlation, Instant Jump)
├── 06. Reports            (Forensic Report Builder, Chain-of-Custody Log, Print/Export View)
└── 07. Settings           (AI Confidence Thresholds, Zone Defaults, Privacy Policies, Audit Logs)
```

---

## 4. Low-Fidelity Wireframes (Phase 4)

### 1. Login Screen
```
┌──────────────────────────────────────────────────────────┐
│  SENTINELX // SECURE OPERATOR TERMINAL                   │
│                                                          │
│              ┌────────────────────────────┐              │
│              │  [Shield Logo] SENTINELX   │              │
│              │  Operator ID: [INV-8842  ] │              │
│              │  Passkey:     [••••••••••] │              │
│              │  Clearance:   LEVEL 4 SOC  │              │
│              │  [ AUTHENTICATE SESSION ]  │              │
│              └────────────────────────────┘              │
└──────────────────────────────────────────────────────────┘
```

### 2. Investigator Dashboard
```
┌────────────┬─────────────────────────────────────────────┐
│ SENTINELX  │  TOPBAR: System Online | Upload | Operator  │
├────────────┼─────────────────────────────────────────────┤
│ > Dashboard│  [Active Cameras: 4/4] [Critical: 2] [High:4]│
│   Cameras  ├──────────────────────────┬──────────────────┤
│   Incidents│  CAMERA MATRIX (2x2)     │ RECENT ALERTS    │
│   Evidence │  ┌──────────┬──────────┐ │ 🔴 INC-0042      │
│   AI Search│  │ CAM-01   │ CAM-02   │ │    CAM-03 14:32  │
│   Reports  │  ├──────────┼──────────┤ │ 🟠 INC-0041      │
│   Settings │  │ CAM-03 🔴│ CAM-04   │ │    CAM-01 13:58  │
│            │  └──────────┴──────────┘ │ 🟡 INC-0040      │
└────────────┴──────────────────────────┴──────────────────┘
```

### 3. Camera View & Smart Zone Editor
```
┌────────────┬─────────────────────────────────────────────┐
│ CAMERAS    │  CAM-03: Central Building Entrance [PRIVACY]│
│ - CAM-01   ├─────────────────────────────────────────────┤
│ - CAM-02   │  ┌───────────────────────────────────────┐  │
│ > CAM-03 🔴│  │  [Person #17 94%]    ╔═════════════╗  │  │
│ - CAM-04   │  │         │            ║ RESTRICTED  ║  │  │
│            │  │         └───────────►║ ZONE A      ║  │  │
│ [+ Upload] │  │                      ╚═════════════╝  │  │
│ [Draw Zone]│  └───────────────────────────────────────┘  │
│            ├─────────────────────────────────────────────┤
│            │  00:00 ───────[🟠02:14]──[🔴03:42]──── 10:00│
└────────────┴─────────────────────────────────────────────┘
```

### 4. Incident Alert Toast / Banner
```
┌──────────────────────────────────────────────────────────┐
│ 🚨 CRITICAL ALERT: Restricted Area Intrusion (CAM-03)    │
│ Timestamp: 14:32:18 | Confidence: 94% | Dwell: 18.4s     │
│ [ Dismiss ]                        [ Investigate Now → ] │
└──────────────────────────────────────────────────────────┘
```

### 5. Incident Details & 6. Interactive Timeline
```
┌──────────────────────────────────┬───────────────────────┐
│ VIDEO PLAYER (Jumped to 14:32:18)│ INC-00042 DETAILS     │
│ ┌──────────────────────────────┐ │ Severity: HIGH (🟠)   │
│ │  Bounding Box + Track Path   │ │ Camera: CAM-03        │
│ └──────────────────────────────┘ │ Duration: 18.4s       │
│ TIMELINE SCRUBBER                │ Track ID: Person #17  │
│ 00:00 ──●────────────── 10:00    │ [View Evidence]       │
│         ▲ 14:32:18               │ [Generate Report]     │
└──────────────────────────────────┴───────────────────────┘
```

### 7. Evidence Vault & Integrity Checker
```
┌──────────────────────────────────────────────────────────┐
│ EVIDENCE ITEM: EVD-2026-089 (Linked to INC-00042)        │
├───────────────────────────┬──────────────────────────────┤
│ [Video Clip Preview]      │ SHA-256 CRYPTOGRAPHIC HASH   │
│ [Keyframes: Entry, Dwell] │ e3b0c44298fc1c149afbf4c899...│
│ [x] Privacy Face Blur     │ STATUS: [ ✓ INTEGRITY VALID ]│
│                           │ [Simulate Tamper] [Re-Verify]│
└───────────────────────────┴──────────────────────────────┘
```

### 8. AI Explanation & Natural Language Investigation
```
┌──────────────────────────────────────────────────────────┐
│ ASK SENTINELX AI                                         │
│ [🔍 "Show high severity incidents from CAM-03"         ] │
├───────────────────────────┬──────────────────────────────┤
│ MATCHING INCIDENTS (3)    │ EXPLAINABLE AI (XAI) TRACE   │
│ 1. INC-00042 (94% High)   │ ✓ Person #17 detected (94%)  │
│ 2. INC-00039 (91% Crit)   │ ✓ Polygon boundary crossed   │
│ 3. INC-00035 (88% High)   │ ✓ Dwell time 18.4s > 5.0s    │
└───────────────────────────┴──────────────────────────────┘
```

### 9. Forensic Report & 10. System Settings
```
┌──────────────────────────────────────────────────────────┐
│ OFFICIAL SENTINELX FORENSIC INVESTIGATION REPORT         │
│ Report ID: RPT-9042 | Investigator: Operator INV-8842    │
├──────────────────────────────────────────────────────────┤
│ 1. Executive Summary & Incident Metadata                 │
│ 2. Explainable AI Causal Chain                           │
│ 3. Keyframe Snapshots (Privacy Redacted)                 │
│ 4. Cryptographic Chain of Custody (SHA-256 Verified)     │
│ [ Print / Export PDF ]                                   │
└──────────────────────────────────────────────────────────┘
```

---

## 5. Design System Specification (Phase 5)

- **Aesthetic Direction**: High-Tech Tactical SOC (Cyberpunk / Clean SaaS hybrid — deep obsidian/slate surfaces, crisp 1px structural borders, telemetry monospaced metrics, high-contrast WCAG AA severity tokens).
- **Color Palette (Semantic Tokens)**:
  - Canvas Background: `#07090E` (`slate-950` deep tactical obsidian)
  - Card / Surface: `#0F1420` (`slate-900/90` with `1px solid rgba(148, 163, 184, 0.14)`)
  - Primary Accent: `#06B6D4` (Electric Tactical Cyan) & `#3B82F6` (Command Cobalt)
  - Text Primary: `#F8FAFC` | Text Secondary: `#94A3B8` | Text Muted: `#64748B`
  - Status & Severity Indicators:
    - 🔴 **CRITICAL**: `#EF4444` (Rose/Red 500) — Immediate threat / Abandoned object / Breach
    - 🟠 **HIGH**: `#F97316` (Orange 500) — Restricted zone intrusion / Rapid movement
    - 🟡 **MEDIUM**: `#EAB308` (Amber 500) — Crowd formation / Perimeter loitering
    - 🟢 **NORMAL / VERIFIED**: `#10B981` (Emerald 500) — Nominal telemetry / SHA-256 verified
- **Typography**:
  - Headings & UI: `Inter` / `Geist Sans` (tight tracking, semibold/bold hierarchy)
  - Telemetry, Hashes, Timestamps & Coordinates: `JetBrains Mono` / `Geist Mono`

---

## 6. Database Schema (Development Phase 6)

- `cameras`: `id`, `code`, `name`, `location`, `status`, `resolution`, `fps`, `stream_url`, `restricted_zones_json`
- `videos`: `id`, `filename`, `camera_id`, `duration_sec`, `fps`, `width`, `height`, `uploaded_at`, `file_hash`, `status`
- `detections`: `id`, `video_id`, `frame_index`, `timestamp_sec`, `label`, `confidence`, `bbox_json`, `track_id`
- `tracks`: `id`, `video_id`, `track_number`, `object_class`, `first_seen_sec`, `last_seen_sec`, `trajectory_json`, `avg_speed`
- `incidents`: `id`, `code`, `title`, `event_type`, `camera_id`, `video_id`, `start_time`, `end_time`, `duration_sec`, `severity`, `confidence`, `track_id`, `zone_name`, `explanation_json`, `status`
- `evidence`: `id`, `code`, `incident_id`, `camera_id`, `clip_start`, `clip_end`, `sha256_hash`, `current_hash`, `verified`, `privacy_blurred`, `created_at`
- `audit_logs`: `id`, `timestamp`, `actor`, `action`, `target_id`, `details`
