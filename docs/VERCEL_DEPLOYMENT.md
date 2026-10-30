# NoProxy — Vercel Frontend Deployment Guide

Follow these steps to deploy the NoProxy frontend to **Vercel**.

---

## 1. Prerequisites
- A [Vercel](https://vercel.com) account.
- The NoProxy repository pushed to GitHub (`voidrohan25/noproxy`).

---

## 2. Import Repository into Vercel

1. Navigate to the **Vercel Dashboard**.
2. Click **Add New...** > **Project**.
3. Select your GitHub repository: `voidrohan25/noproxy`.
4. In the project configuration screen:
   - **Framework Preset**: Next.js (automatically detected).
   - **Root Directory**: Click **Edit** and select `frontend`.
   - **Build Command**: `next build` (default).
   - **Output Directory**: `.next` (default).
   - **Install Command**: `npm install` (default).

---

## 3. Configure Environment Variables in Vercel

Under the **Environment Variables** section, add the following:

| Name | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-service.onrender.com` |
| `NEXT_PUBLIC_APP_URL` | `https://your-frontend-project.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-anon-key` |
| `NEXT_PUBLIC_QR_EXPIRY_SECONDS` | `20` |
| `NEXT_PUBLIC_DEMO_MODE` | `false` |

---

## 4. Deploy

1. Click **Deploy**.
2. Vercel will build and deploy the Next.js frontend across its global edge network.
3. Once finished, Vercel will display your production URL:
   `https://noproxy-<unique-id>.vercel.app`
4. Copy this URL and add it as the `FRONTEND_URL` in your Render backend settings.
