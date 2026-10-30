# NoProxy — Environment Variables & Secrets Reference

This document catalogs every environment variable across the Frontend (Vercel) and Backend (Render).

---

## 1. Frontend Web App (Vercel)

Configure these in **Vercel Project Settings -> Environment Variables**:

| Variable | Type | Default / Example | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Public (URL) | `https://noproxy-backend.onrender.com` | Base URL of the Render backend web service. Used for API rewrites and direct client requests. |
| `NEXT_PUBLIC_APP_URL` | Public (URL) | `https://noproxy.vercel.app` | Public canonical URL of the frontend application. |
| `NEXT_PUBLIC_SUPABASE_URL` | Public (URL) | `https://<id>.supabase.co` | Supabase project API URL for client-side Auth and subscriptions. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (Key) | `eyJhbGciOi...` | Supabase public anonymous API key (safe for browser). |
| `NEXT_PUBLIC_QR_EXPIRY_SECONDS` | Public (Number) | `20` | Dynamic QR code auto-refresh duration in seconds. |
| `NEXT_PUBLIC_DEMO_MODE` | Public (Boolean) | `false` | Set to `false` in production. Set to `true` for offline demo testing. |

---

## 2. Backend Web Service (Render)

Configure these in **Render Dashboard -> Environment**:

| Variable | Type | Default / Example | Purpose |
|---|---|---|---|
| `PORT` | Public (Int) | `10000` | Port on which the Express server listens. Render sets this automatically. |
| `NODE_ENV` | Public (String) | `production` | Set to `production` for production optimizations and secure cookies. |
| `FRONTEND_URL` | Public (URL) | `https://noproxy.vercel.app` | Origin URL permitted by CORS to make credentialed API requests. |
| `QR_SIGNING_SECRET` | **SECRET** | `32-byte hex` | Cryptographic HMAC secret for signing dynamic QR tokens. Generate via `openssl rand -hex 32`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Public (URL) | `https://<id>.supabase.co` | Supabase project API URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public (Key) | `eyJhbGciOi...` | Supabase public anonymous API key. |
| `SUPABASE_SERVICE_ROLE_KEY` | **SECRET** | `eyJhbGciOi...` | Supabase privileged service role key. Never expose in client code. |
| `NEXT_PUBLIC_DEMO_MODE` | Public (Boolean) | `false` | Set to `false` so backend writes to live Supabase PostgreSQL. |
| `INITIAL_ADMIN_EMAIL` | Optional | `admin@noproxy.edu` | Used by initial admin provisioning script. |
| `INITIAL_ADMIN_PASSWORD` | Optional | `Admin@NoProxy2026!` | Used by initial admin provisioning script. |
