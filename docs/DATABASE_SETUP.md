# NoProxy — Supabase PostgreSQL Database Setup & Migration Guide

## 1. Overview
NoProxy utilizes **Supabase Managed PostgreSQL** with Row-Level Security (RLS), multi-tenant isolation, and relational foreign keys.

---

## 2. Setting Up Supabase Project

1. Log in to [Supabase](https://supabase.com).
2. Click **New Project** and name it `NoProxy-Attendance-SaaS`.
3. Choose your nearest region (e.g., `ap-south-1` Mumbai / Pune).
4. Save your database password securely.

---

## 3. Applying Migrations in Order

Open the **SQL Editor** in the Supabase Dashboard and apply the migration scripts located in `backend/supabase/migrations/`:

### Migration 1: Initial Schema & Constraints
File: `backend/supabase/migrations/001_initial_schema.sql`
- Creates tables: `institutions`, `profiles`, `institution_memberships`, `courses`, `subjects`, `batches`, `classrooms`, `sessions`, `authoritative_student_roster`, `student_profiles`, `device_registrations`, `attendance_records`, `audit_logs`.
- Enforces attendance enum constraint: strictly `PRESENT`, `ONLINE`, `ABSENT`.

### Migration 2: Row Level Security (RLS)
File: `backend/supabase/migrations/002_row_level_security.sql`
- Configures multi-tenant RLS policies ensuring students can only view their own attendance, trainers only view assigned batches, and admins have full tenant control.

### Migration 3: Stored Procedures & Triggers
File: `backend/supabase/migrations/003_functions_and_triggers.sql`
- Implements `finalize_session(session_id, actor_id)` which queries unrecorded students from the authoritative roster and atomically inserts `ABSENT` records.

### Migration 4: Multi-Batch Enrollment & Classroom Masking
File: `backend/supabase/migrations/004_multi_batch_enrollment.sql`
- Creates `student_enrollments` table for many-to-many batch memberships.
- Defines `trainer_classroom_view` which strips sensitive GPS coordinates and CIDRs for non-admins.

---

## 4. Environment Configuration
Copy your credentials from **Project Settings -> API** into `backend/.env` and `frontend/.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
NEXT_PUBLIC_DEMO_MODE=false
```
