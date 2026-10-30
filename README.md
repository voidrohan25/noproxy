# NoProxy — Production-Ready Smart Attendance Management SaaS

NoProxy is an enterprise-grade, multi-tenant attendance management SaaS platform engineered specifically for IT training institutes, colleges, universities, and coaching academies. It eliminates proxy attendance through **HMAC dynamic QR codes**, **classroom GPS geofencing**, **one-device-per-student binding**, **authoritative institutional roster verification**, and provides **downloadable batch Excel attendance registers (.xlsx)**.

---

## 1. Architectural Principles & Non-Negotiables

### Strict 3-Status System (Non-Negotiable)
The platform strictly enforces exactly three attendance statuses across all database constraints, API endpoints, UI badges, and Excel reports:
- **`PRESENT`**: Physical classroom attendance verified via dynamic QR, GPS geofence, and registered device.
- **`ONLINE`**: Virtual attendance confirmed by the trainer from the live online meeting platform (Zoom, Teams, Google Meet).
- **`ABSENT`**: Recorded automatically when a session is finalized for students who did not establish verified physical or online attendance.

> **CRITICAL RULE**: There is **no Late, Delayed, Grace Period, or Late Arrival status** anywhere in the database schema, business logic, reports, or APIs.

### Exactly 3 Roles
The system is built strictly around three authenticated roles:
1. **`ADMIN` (Super Admin / Institution Administrator)**: Has global administrative authority to manage trainers, courses, subjects, batches, classrooms, authoritative rosters, and audited attendance corrections.
2. **`TRAINER`**: Managed directly by administrators; controls assigned batch lecture sessions, dynamic QR displays, online attendance marking, and finalization.
3. **`STUDENT`**: Self-registers via email/Google OAuth, but must claim and verify their identity against the institution's authoritative pre-loaded roster before accessing the mobile attendance scanner.

---

## 2. Multi-Factor Anti-Proxy Verification

| Verification Factor | Method & Security Logic | Browser vs. Native Disclosure |
|---|---|---|
| **Authoritative Roster Validation** | Institutional administrator uploads authoritative student enrollment roster (Roll Number, Full Name, Batch). Newly registered students must match their identity against this roster before scanning QR codes. Duplicate claims on the same student record are strictly rejected. | Server-side validation; prevents self-created fake student identities. |
| **Dynamic QR Code** | Cryptographic HMAC-SHA256 signature, 20-second sliding expiration, auto-refresh, and single-use challenge nonce stored server-side. | Supported natively in mobile web browsers and desktop screens. |
| **GPS Geofencing** | Server calculates spherical distance using the Haversine formula against configured classroom coordinates. Rejects submissions outside radius or with poor device accuracy. | Uses standard HTML5 Geolocation API (`navigator.geolocation`). Disclosure: Browser location can be spoofed on rooted devices; native OS attestation is recommended for high-security campus deployments. |
| **Device Binding** | One active registered smartphone per student. Device credentials recorded in `device_registrations`. Prevents multiple students from scanning on a single device. | Uses WebAuthn / Passkey platform authenticator credentials where supported. |
| **Absence Finalization** | Stored procedure (`finalize_session`) queries eligible roster and automatically marks unrecorded students as `ABSENT`, revokes active QR tokens, and locks the session. | Supported directly via server action and PostgreSQL stored procedure. |
| **Excel Matrix Register** | Server-side `.xlsx` generation using `ExcelJS`. Each finalized session gets its own column labeled by date and subject. Displays Present, Online, Absent counts and attendance %. | Genuine OpenXML `.xlsx` binary stream. |

---

## 3. Initial Super Admin Provisioning

NoProxy comes with secure, persistent administrative provisioning.

### Default Initial Super Admin Credentials
- **Portal**: [http://localhost:3000/login](http://localhost:3000/login)
- **Email**: `admin@noproxy.edu`
- **Password**: `Admin@NoProxy2026!`

To provision or verify the admin credentials at any time:
```bash
npm run provision:admin
```
*(Customizable via environment variables `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD`).*

---

## 4. Pre-Configured Test Accounts

| Role | Name | Email | Password | Primary Workflow |
|---|---|---|---|---|
| **Admin** | System Administrator | `admin@noproxy.edu` | `Admin@NoProxy2026!` | Roster management, trainer creation, classroom geofencing, Excel export |
| **Trainer** | Arvind Kapoor | `trainer.kapoor@apexinstitute.edu` | `Trainer@2026!` | Dynamic QR projector console, online lecture attendance, session finalization |
| **Student** | Aarav Patel | `aarav.patel@student.edu` | `Student@2026!` | Bound smartphone QR scanner, GPS verification, personal attendance history |

---

## 5. Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript (Strict), Tailwind CSS, Lucide React
- **Backend**: Next.js Server Actions & API Routes, Node.js Crypto (HMAC-SHA256)
- **Database**: Supabase PostgreSQL with Row Level Security (RLS) & Stored Functions
- **QR Engine**: `qrcode` (generator) and `jsqr` (client camera scanner)
- **Reporting**: `exceljs` (real `.xlsx` matrix generation)
- **Testing**: Automated verification suite running on TypeScript (`tsx`)

---

## 6. Local Setup & Quick Start

### Prerequisites
- Node.js v18 or higher (tested on Node v24)
- npm or yarn

### Installation
```bash
# 1. Clone repository
git clone https://github.com/your-org/noproxy.git
cd noproxy

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Provision initial Super Admin
npm run provision:admin

# 5. Run automated verification test suite
npm test

# 6. Start development server
npm run dev
```

Visit `http://localhost:3000` to access the application.

---

## 7. Authoritative Student Onboarding Flow

1. **Admin Roster Preparation**: In the Admin Portal (`/admin`), the administrator adds or bulk-imports (CSV format) students into the batch authoritative roster:
   ```csv
   studentIdNumber,fullName,email
   ST-002,Priya Singh,priya.singh@student.edu
   ST-003,Rohan Gupta,rohan.gupta@student.edu
   ```
2. **Student Signup**: The student registers at `/register` using their email or Google account.
3. **Identity Claiming**: Upon initial sign-in, the system redirects to `/student/complete-registration`.
4. **Validation Check**: The student enters their institutional Student ID (e.g., `ST-002`) and full name. The server verifies:
   - Does this Student ID exist in the batch roster?
   - Does the submitted name match the institutional enrollment record?
   - Has this Student ID already been claimed by another account?
5. **Instant Access**: Upon successful validation, the account is bound, and the student gains access to the attendance scanner at `/student`.

---

## 8. Supabase PostgreSQL Setup & Migrations

To connect to a live Supabase project:

1. Create a new project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Apply the migrations in numerical order:
   - `supabase/migrations/001_initial_schema.sql` (Authoritative roster, tables, constraints, indexes)
   - `supabase/migrations/002_row_level_security.sql` (RLS tenant policies)
   - `supabase/migrations/003_functions_and_triggers.sql` (Session finalization & strict triggers)
   - `supabase/migrations/004_multi_batch_enrollment.sql` (Multi-batch enrollments, classroom views, RLS)
4. (Optional) Run `supabase/seed.sql` to populate sample batches, enrollments, and sessions.
5. Copy your project credentials into `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   QR_SIGNING_SECRET=your-random-64-char-hex-secret
   ```

---

## 9. Multi-Batch Student Enrollment & Isolation Architecture

In modern educational institutions, students frequently enroll in multiple batches concurrently (e.g., *Full Stack Web Development* and *Python & Data Engineering*).

NoProxy decouples student identity from batch enrollment:
- **`student_profiles`**: Represents the student's unique identity, student ID number, device binding, and claim status.
- **`student_enrollments`**: Relational junction table linking a student to multiple active batches (`batch_id`, `status: ACTIVE | COMPLETED | DROPPED`, `enrolled_at`).
- **Student Portal Batch Switcher**: In `/student`, students can view all enrolled batches under "My Batches", switch their active view, and scan batch-specific dynamic QR codes.
- **Strict Batch Verification**: Dynamic QR attendance enforces `isStudentEnrolledInBatch(studentId, session.batchId)`. A student scanning a QR for a batch they are not enrolled in is immediately rejected.
- **Attendance Isolation**: Marking attendance in Batch A never affects Batch B. All attendance records are scoped strictly to `(session_id, student_id)`.

---

## 10. Admin-Only Location & Network Verification Settings

Institutional security requires that physical coordinates (exact latitude, longitude) and network subnet CIDRs remain strictly confidential to prevent student spoofing or unauthorized trainer tampering:

- **Admin Portal**: Accessible exclusively at `/admin/settings/location-network` and protected by server-side `isAdmin` session checks.
- **Coordinate Masking**: Trainer and Student endpoints use `listClassroomsPublic()` / `trainer_classroom_view`, which completely strips latitude, longitude, and allowed network CIDRs.
- **Audited Configuration Updates**: Every update requires an administrative reason for audit logs. Non-admins submitting updates receive an immediate `403 Forbidden`.

---

## 11. Visual Studio Code Workspace Configuration

The project is pre-configured with a `.vscode/` setup for rapid development:
- **`settings.json`**: TypeScript workspace SDK, automatic ESLint linting, Prettier formatting on save, and file exclusions.
- **`extensions.json`**: Recommended extensions for Next.js, Tailwind CSS, TypeScript, ESLint, Prettier, and PostgreSQL.
- **`launch.json`**: Debug configurations to run Next.js server-side, client-side in Chrome/Edge, and launch all automated tests directly from VS Code.

To open in VS Code:
```bash
code C:\Users\hp\.gemini\antigravity\scratch\noproxy
```

---

## 12. Monorepo Architecture & Directory Structure

NoProxy is organized as a production-grade decoupled monorepo prepared for separate frontend and backend hosting:

```
noproxy/
├── frontend/               # Next.js 15 App Router (Deploy to Vercel)
│   ├── src/                # Pages, App Router, Components, Hooks
│   ├── next.config.ts      # API rewrites (/api/:path* -> backend) and security headers
│   ├── package.json        # Frontend dependencies (React 19, Lucide, Tailwind)
│   └── README.md           # Vercel deployment instructions
├── backend/                # Node.js + Express API (Deploy to Render)
│   ├── src/
│   │   ├── server.ts       # Express app, Helmet, CORS, Health checks
│   │   ├── routes/         # auth, admin, attendance, qr, reports, sessions
│   │   ├── middleware/     # JWT authentication, role guards
│   │   └── lib/            # Business logic, DB adapters, QR cryptography
│   ├── supabase/           # PostgreSQL migrations (001-004 + seed)
│   ├── package.json        # Backend dependencies (Express, ExcelJS, Helmet)
│   └── README.md           # Render deployment instructions
├── docs/                   # Full Technical & Deployment Documentation
│   ├── ARCHITECTURE.md     # System architecture & data flow diagrams
│   ├── DATABASE_SETUP.md   # Supabase PostgreSQL schema & migration guide
│   ├── ENVIRONMENT_VARIABLES.md # Complete env var reference
│   ├── GITHUB_SETUP.md     # Git repository and branch guide
│   ├── VERCEL_DEPLOYMENT.md# Step-by-step Vercel frontend deployment
│   ├── RENDER_DEPLOYMENT.md# Step-by-step Render backend deployment
│   ├── TESTING.md          # Test suite execution and verification
│   └── TROUBLESHOOTING.md  # Common issues and troubleshooting playbook
├── render.yaml             # Render Blueprint for zero-configuration backend deployment
└── README.md               # Project root overview (this file)
```

---

## 13. Automated Testing Suite

Run the automated test matrix covering status rules, roster validation, role boundaries, dynamic QR encryption, GPS geofencing, Excel generation, multi-batch enrollment, and admin-only location security:

```bash
# Run backend tests
cd backend && npm test
```

### Verified Test Matrix (8/8 Test Suites, 100% Passing)
1. **Status Constraint Suite**: Strict enforcement of `PRESENT`, `ONLINE`, `ABSENT`. Instant rejection of `LATE`, `DELAYED`, `GRACE_PERIOD`, and `HALF_DAY`.
2. **Authoritative Roster Suite**: Identity claiming, duplicate claim prevention, and name mismatch rejection.
3. **Role-Based Access Control Suite**: Absolute server-side boundary enforcement (`isAdmin`, `isTrainer`, `isStudent`).
4. **Anti-Proxy Geofence & QR Suite**: HMAC-SHA256 sliding challenge verification, replay rejection, tamper rejection, and Haversine distance geofencing.
5. **Multi-Batch Enrollment Suite**: Multi-batch enrollment persistence, duplicate enrollment rejection, batch removal isolation, batch-specific QR attendance, and non-enrolled batch rejection.
6. **Admin Location Security Suite**: Admin-only access to `/admin/settings/location-network`, 403 blocks for trainers/students, public coordinate masking, trainer update denial, and audited admin updates.
7. **End-to-End User Journeys**: Complete student claim, multi-batch switch, dynamic QR scan, and Excel export verification.
8. **High-Concurrency Load Suite**: Concurrent scan stress tests ensuring zero race conditions or double marks.

---

## 14. Production Deployment Quickstart

### Frontend (Vercel)
- **Repository**: [https://github.com/voidrohan25/noproxy](https://github.com/voidrohan25/noproxy)
- **Framework Preset**: Next.js
- **Root Directory**: `frontend`
- **Environment Variables**: `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- See [docs/VERCEL_DEPLOYMENT.md](docs/VERCEL_DEPLOYMENT.md) for full guide.

### Backend (Render)
- **Render Blueprint**: Connect repository and Render will automatically detect `render.yaml`.
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/health`
- See [docs/RENDER_DEPLOYMENT.md](docs/RENDER_DEPLOYMENT.md) for full guide.

