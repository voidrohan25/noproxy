# NoProxy — Frontend Web Application (Vercel)

This directory contains the production-ready Next.js 15 (React 19) frontend client for **NoProxy**, engineered for deployment on **Vercel**.

## Architecture & Responsibilities
- **Vercel Deployment**: Fast global edge delivery, static generation, and SSR.
- **Root Directory**: `frontend`
- **Portals**:
  - `/admin`: Administration console, multi-batch enrollment manager, and geofence configuration.
  - `/trainer`: Projector dynamic QR display console and online attendance marking.
  - `/student`: Student portal, batch switcher, and camera-based dynamic QR scanner.
- **Backend Communication**:
  - Rewrites all `/api/*` requests directly to the deployed Render backend service (`NEXT_PUBLIC_API_URL`).
  - Seamless cookie transmission with `credentials: 'include'`.

## Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

## Production Build
```bash
npm run build
npm start
```
