# NoProxy — Render Backend Deployment Guide

Follow these steps to deploy the NoProxy backend web service to **Render**.

---

## 1. Prerequisites
- A [Render](https://render.com) account.
- The NoProxy repository pushed to GitHub (`voidrohan25/noproxy`).

---

## 2. Option A: One-Click Deploy via Render Blueprint (render.yaml)

The repository root includes a pre-configured `render.yaml`.
1. In your Render Dashboard, click **New +** > **Blueprint**.
2. Connect your `voidrohan25/noproxy` GitHub repository.
3. Render will read `render.yaml`, identify the backend service, set the health check path to `/health`, and configure the build/start commands.
4. Fill in the required secret environment variables (`QR_SIGNING_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`).
5. Click **Apply**.

---

## 3. Option B: Manual Web Service Setup

1. In Render Dashboard, click **New +** > **Web Service**.
2. Connect `voidrohan25/noproxy`.
3. Configure the service settings:
   - **Name**: `noproxy-backend`
   - **Region**: Singapore or Frankfurt (choose nearest to your database)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` or `Starter`
4. Under **Advanced**:
   - **Health Check Path**: `/health`
5. Under **Environment Variables**, add:
   - `PORT`: `10000`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://your-frontend-project.vercel.app`
   - `QR_SIGNING_SECRET`: *(32-byte hex string)*
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `your-anon-key`
   - `SUPABASE_SERVICE_ROLE_KEY`: `your-service-role-key`
   - `NEXT_PUBLIC_DEMO_MODE`: `false`
6. Click **Create Web Service**.
7. Once deployed, test your health check at:
   `https://noproxy-backend.onrender.com/health`
