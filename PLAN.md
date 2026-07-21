# COMPREHENSIVE FIX PLAN

## Issues Identified After Code Review

### 🔴 CRITICAL ISSUES

#### 1. Payment Routes Are DUPLICATED - `paymentRoutes.js` NOT Mounted
- **File**: `backend/src/routes/paymentRoutes.js` defines routes but is **NEVER imported/mounted** in `server.js`
- **Impact**: The payment routes exist but there could be conflicts, plus the separate router file is unused. The routes directly in `server.js` are the ones being used but they have issues.

#### 2. Payment Verify Route Has `authenticate` Middleware (May Fail on Redirect)
- **File**: `backend/server.js` - `GET /api/payments/verify/:reference` requires `authenticate` middleware
- **Impact**: When Paystack redirects back to `/payment-success?reference=xxx`, the `PaymentSuccess.jsx` makes an API call. If the auth token expired or doesn't exist, verification fails.

#### 3. PaymentSuccess.jsx Makes Separate API Call BUT Doesn't Auto-Enroll Properly
- **File**: `frontend/src/pages/PaymentSuccess.jsx` - calls `api.get('/payments/verify/${reference}')`
- **Impact**: The backend verify endpoint does create enrollment, but the frontend doesn't handle the `alreadyProcessed` response correctly, leading to double-processing errors.

#### 4. EditCourse.jsx - `formData` doesn't map `response.data` correctly
- **File**: `frontend/src/pages/EditCourse.jsx` 
- **Issue**: `setFormData(response.data)` - response.data is the formatted course object containing `{id, title, price, category, ...}`. But `formData` has extra fields like `description`, `instructor`, etc. that aren't in the form but get set anyway.

#### 5. EditCourse PUT Route Requires ADMIN Role - Regular Users Can't Edit
- **File**: `backend/server.js` - `app.put('/api/courses/:id', authenticate, isAdmin, ...)`
- **Impact**: Only admin can edit courses. The frontend edit buttons are visible to all users but the API will reject non-admin users.

#### 6. Delete Course Also Admin-Only - Same Issue as #5

### 🟡 MODERATE ISSUES

#### 7. PrismaClient Uses MariaDB Adapter but Schema Says MySQL
- **File**: `backend/src/prismaClient.js` uses `@prisma/adapter-mariadb`
- **File**: `backend/prisma/schema.prisma` has `provider = "mysql"`
- **Impact**: Mismatch could cause connection issues or data type problems.

#### 8. Course `displayOrder` Collision Risk
- **File**: `backend/prisma/seed.js` - sets `displayOrder` using `l.id ?? idx + 1` where lesson id values (1-5) are reused across courses
- **Impact**: Different courses could have lessons with same `displayOrder` within same course if id mapping is off. Fix: use `idx + 1` only.

#### 9. Vite Proxy Not Being Used - Direct Axios URL
- **File**: `frontend/src/api/axios.js` uses absolute URL `http://localhost:5000/api`
- **File**: `frontend/vite.config.js` has proxy config that's never used
- **Impact**: No real issue since CORS is enabled, but cleaner to use relative URLs through Vite proxy.

#### 10. PaystackButton Uses `$` Symbol But Prices Might Be in NGN
- **File**: `frontend/src/components/PaystackButton.jsx` shows `Pay $${amount.toFixed(2)} with Paystack`
- **Impact**: Confusing for Nigerian users. Should show currency symbol or "NGN".

### 🟢 MINOR/ENHANCEMENT ISSUES

#### 11. No Loading States in Some Pages
- Various pages lack proper loading states

#### 12. localStorage Course Progress Not Synced to Backend
- Lesson progress is only stored locally and never saved to the backend

---

## FIX PLAN (Step-by-Step)

### Step 1: Fix Backend `server.js` - Payment Routes & Course Permissions
- Mount the `paymentRoutes` router properly
- Fix `PUT /api/courses/:id` to allow both ADMIN and INSTRUCTOR roles
- Fix `DELETE /api/courses/:id` to allow both ADMIN and INSTRUCTOR roles

### Step 2: Fix `PaymentSuccess.jsx` - Better Error Handling & Auto-Redirect
- Add better error handling for when token is missing
- Add auto-redirect to login if not authenticated
- Show proper success message after enrollment

### Step 3: Fix `PaystackButton.jsx` - Currency Display & Error Handling
- Update currency display to show NGN or adapt based on context
- Better error messages

### Step 4: Fix `EditCourse.jsx` - Proper Data Mapping
- Properly map response data to form fields instead of setting entire response

### Step 5: Fix `prismaClient.js` - Adapter Consistency
- Change adapter to match schema provider (mysql instead of mariadb, or vice versa)

### Step 6: Fix Seed.js - `displayOrder` Collision
- Use `idx + 1` only for displayOrder, not lesson id

### Step 7: Fix Vite Config - Use Proxy for Relative URLs
- Update axios baseURL to relative path so Vite proxy handles it

### Step 8: Test Everything
- Run seed command
- Start backend and frontend
- Verify courses show up
- Test payment flow

