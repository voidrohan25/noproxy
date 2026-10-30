# NoProxy — GitHub Setup & Repository Maintenance Guide

This document details how the NoProxy Git repository is configured and maintained.

---

## 1. Remote Configuration & Branch Topology
- **Remote Origin**: `https://github.com/voidrohan25/noproxy.git`
- **Default Branch**: `main`
- **Backup Snapshot Branch**: `backup-unified-baseline`

To view remote status:
```bash
git remote -v
git status
```

---

## 2. Directory Structure Conventions

```text
noproxy/
├── frontend/             # Next.js 15 client app for Vercel
├── backend/              # Node/Express API service for Render
├── docs/                 # Production deployment & architecture guides
├── render.yaml           # Render Infrastructure Blueprint
├── README.md             # Project overview & quickstart
└── .gitignore            # Root ignore rules
```

---

## 3. Pre-Commit Checklist

Before pushing commits:
1. Ensure no secrets, `.env`, or `.env.local` files are staged.
2. Verify backend tests pass:
   ```bash
   cd backend && npm test
   ```
3. Verify backend compiles:
   ```bash
   cd backend && npm run build
   ```
4. Verify frontend compiles:
   ```bash
   cd frontend && npm run build
   ```
