# NoProxy — Troubleshooting & Diagnostics Guide

Common issues, causes, and verified solutions for NoProxy.

---

## 1. CORS Errors (Frontend to Backend)
**Symptom**: Browser console logs `Access to XMLHttpRequest has been blocked by CORS policy`.  
**Cause**: The Render backend's `FRONTEND_URL` environment variable does not match your Vercel deployment URL.  
**Fix**:
1. Check your Vercel URL (e.g. `https://noproxy.vercel.app`).
2. Go to **Render Dashboard -> noproxy-backend -> Environment**.
3. Set `FRONTEND_URL=https://noproxy.vercel.app` (without trailing slash).
4. Save and trigger manual redeploy on Render.

---

## 2. GPS Geofence Rejection
**Symptom**: Student scans valid QR code but receives `GPS geofence verification failed`.  
**Cause**: Student device is outside the configured classroom radius or device GPS accuracy is low.  
**Fix**:
1. In the Admin portal (`/admin/settings/location-network`), verify the classroom latitude and longitude.
2. Ensure the geofence radius (meters) accommodates classroom size and walls (recommended: 50m to 70m).
3. If students are indoors with weak satellite fixes, adjust `Max Allowable Accuracy` to `35m` or `50m`.

---

## 3. Dynamic QR "Nonce Already Consumed"
**Symptom**: Student receives `QR challenge nonce already consumed`.  
**Cause**: The single-use QR nonce was already scanned or refreshed.  
**Fix**: Dynamic QR codes rotate every 20 seconds. Ensure the student points their camera at the live, currently displayed QR code on the trainer projector.

---

## 4. Multi-Batch "Not Actively Enrolled" Error
**Symptom**: Student scans QR and receives `Authorization violation: You are not actively enrolled in the batch`.  
**Cause**: The student is attending a session for Batch A while their active selection or enrollment is for Batch B.  
**Fix**:
1. In the student portal (`/student`), click **"My Batches"**.
2. Select the batch corresponding to the lecture currently in progress.
3. If not enrolled, an Administrator can enroll them in the Admin portal under **Multi-Batch Enrollments**.
