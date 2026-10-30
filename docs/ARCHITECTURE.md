# NoProxy — System Architecture & Deployment Blueprint

## 1. High-Level System Overview

NoProxy employs a decoupled modern SaaS architecture separating presentation from compute, database persistence, and cryptographic verification:

```text
┌─────────────────────────────────────────────────────────────┐
│                 Client Layer (Web Browsers)                 │
│         Desktop Projector  /  Student Mobile Camera         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                HTTPS / TLS    │ (Port 443)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            Frontend Tier — Vercel Edge Network              │
│                 (Root Directory: frontend)                  │
│       • Next.js 15 (React 19) App Router                    │
│       • Strict 3-Status Badging (Present, Online, Absent)   │
│       • Multi-Batch Student Dashboard Switcher              │
│       • Camera QR Scanner & Geolocation Capture             │
│       • Transparent Rewrites: /api/* -> Render Backend      │
└──────────────────────────────┬──────────────────────────────┘
                               │
               CORS / HTTPS    │ (Bearer / Cookie Auth)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│           Backend API Tier — Render Web Service             │
│                  (Root Directory: backend)                  │
│       • Node.js & Express REST Service (Port 10000)         │
│       • Cryptographic HMAC-SHA256 Sliding QR Nonces (20s)   │
│       • Haversine Geofence Evaluation & Accuracy Checks     │
│       • Multi-Batch Enrollment & Attendance Isolation       │
│       • Streaming OpenXML .xlsx Excel Matrix Registers      │
│       • Session Finalization & Auto-Absence Engine          │
│       • Health Endpoint (/health) for Liveness Probes       │
└──────────────────────────────┬──────────────────────────────┘
                               │
                PostgreSQL Wire│ (SSL / RLS)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│            Data Tier — Supabase Managed PostgreSQL          │
│       • Relational Multi-Tenant Schema                      │
│       • student_enrollments Junction Table                  │
│       • Row-Level Security (RLS) Tenant Policies            │
│       • Strict Stored Procedures & Triggers                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Security Boundaries & Coordinate Confidentiality

- **Admin Isolation**: Physical latitude, longitude, and internal network CIDRs are strictly restricted to the Administrator at `/admin/settings/location-network`.
- **Public Coordinate Masking**: When trainers or students query classrooms, the server strips latitude, longitude, and network ranges completely.
- **Replay Protection**: Each dynamic QR challenge contains a single-use cryptographic nonce. Once consumed by an attendance record, the nonce is burned.

---

## 3. Strict 3-Status Philosophy

Attendance allows **only three statuses**:
1. `PRESENT` — Physical classroom verification via dynamic QR, GPS geofence, and registered device.
2. `ONLINE` — Virtual attendance confirmed by trainer from live conference meeting.
3. `ABSENT` — Automatically marked upon session finalization for unrecorded students.

Zero Late, Delayed, or grace-period statuses exist across any database enum, API route, or Excel report.
