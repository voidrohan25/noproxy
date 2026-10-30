# NoProxy — Comprehensive Testing & QA Matrix

## 1. Running the Automated Test Suite

From the `backend/` directory or root:
```bash
cd backend
npm test
```

### Verified Test Matrix (8/8 Test Suites, 100% Passing)

1. **Strict Attendance Status Constraints**: Enforces strictly `PRESENT`, `ONLINE`, `ABSENT`. Rejects `LATE`, `DELAYED`, `GRACE_PERIOD`, `HALF_DAY`.
2. **Authoritative Institutional Roster**: Tests identity matching, duplicate claim prevention, and name mismatch rejection.
3. **Role Guards (RBAC)**: Validates server-side boundaries for `ADMIN`, `TRAINER`, and `STUDENT`.
4. **Dynamic QR Cryptography**: Tests HMAC-SHA256 sliding signatures, 20s expiration, signature tampering, and session binding.
5. **Classroom Geofencing**: Validates Haversine spherical formula, boundary enforcement (7.65m vs 50m), out-of-bounds rejection, and GPS accuracy filters.
6. **Excel Matrix Register (.xlsx)**: Validates genuine OpenXML `PK\x03\x04` binary stream, programmatic ExcelJS parsing, formula injection sanitization (`=`, `@`, `+`, `-`), and zero-session `N/A` handling.
7. **Multi-Batch Enrollment**: Tests many-to-many persistence, duplicate enrollment rejection, batch removal isolation, and batch-specific QR validation.
8. **Admin-Only Location Security**: Tests `/admin/settings/location-network` access restrictions, 403 blocks for trainers/students, public coordinate masking, and audited updates.

---

## 2. Running Concurrent Load Benchmarks

```bash
cd backend
npm run test:load
```
Benchmarks 10, 25, 50, and 100 virtual users across:
- Scenario 1: Concurrent Student Dashboard & Batch Retrieval (p50: ~0.01ms)
- Scenario 2: Concurrent Dynamic QR Attendance Scans (p50: ~0.04ms)
- Scenario 3: Concurrent Excel Matrix Register Generation (p50: ~400ms)
