# NoProxy — Backend Web Service (Render)

This directory contains the production-ready Node.js & Express backend service for **NoProxy**, engineered for deployment on **Render**.

## Architecture & Responsibilities
- **Render Web Service**: Binds to `PORT` (default: 10000).
- **Health Check**: `GET /health` endpoint for Render uptime monitoring.
- **CORS Protection**: Scoped to the Vercel frontend origin (`FRONTEND_URL`).
- **Dynamic QR Engine**: Cryptographic HMAC-SHA256 sliding challenge token generator (20-second expiration).
- **Classroom Geofencing**: Server-side Haversine spherical distance calculation.
- **Reporting**: Streaming OpenXML `.xlsx` binary matrix attendance registers via ExcelJS.
- **Database**: Supabase PostgreSQL with RLS and ACID multi-batch enrollment integrity.

## Local Development
```bash
# 1. Install dependencies
npm install

# 2. Run automated tests
npm test

# 3. Start development server with auto-reload
npm run dev
```

## Production Build & Start
```bash
npm run build
npm start
```
