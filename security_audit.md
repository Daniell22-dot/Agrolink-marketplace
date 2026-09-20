# AgroLink Security Audit & System Architecture Report

## 📋 Overview
This document presents the complete security audit and system architecture analysis for the **AgroLink Web Application**, **Backend Proxy API**, and **Admin Dashboard**.

---

## 🛡️ Security Architecture & Audit Findings

### 1. Authentication & Session Security
- **JWT Standard**: Access tokens signed using `JWT_SECRET` with short expiration (`15m`).
- **Refresh Token Lifecycle**: Stored in PostgreSQL database (`RefreshToken` table) with server-side validation.
- **Session Revocation**: Integrated `POST /api/auth/logout` endpoint that destroys refresh token entries in the database to invalidate user sessions upon logout.
- **Admin Verification Endpoint**: Implemented `GET /api/admin/verify` gated by `protect` and `checkRole('admin')` middleware to allow the Admin Dashboard to safely verify sessions on load.

### 2. Role-Based Access Control (RBAC)
- All `/api/admin/*` routes are protected using explicit Express middleware:
  ```javascript
  router.use(protect);
  router.use(checkRole('admin'));
  ```
- Unauthenticated or unauthorized role requests (buyers/farmers) are rejected with standard HTTP `401` / `403` responses.

### 3. Password Hashing & Account Protection
- **Bcrypt Hashing**: Passwords stored in PostgreSQL are hashed via Sequelize model hooks (`beforeCreate`, `beforeUpdate`) using `bcryptjs` with salt factor 10.
- **Brute-Force Lockout**: 5 failed consecutive login attempts trigger an automatic 30-minute lock (`accountLockedUntil`) on the user account.
- **Login Rate Limiter**: Stricter `loginLimiter` (max 5 requests per 15 mins per IP) prevents credential stuffing.

### 4. Defense-In-Depth Security Middleware
- **Helmet**: Secures HTTP response headers against common web vulnerabilities.
- **XSS Protection**: `xss-clean` middleware strips malicious script tags from incoming request bodies.
- **HTTP Parameter Pollution (HPP)**: Prevents HTTP parameter pollution attacks.
- **Input Validation**: `express-validator` schema rules filter registration, login, product creation, order placement, and review submissions.

### 5. Webhook & External API Security
- **Payload Validation**: M-Pesa STK Push callback handler (`POST /api/payments/callback`) checks payload structure (`req.body.Body.stkCallback`) to prevent unhandled `TypeError` exceptions.
- **CORS Configuration**: Restricts origin requests strictly to allowed domains:
  - `https://agrolink.biz`
  - `https://www.agrolink.biz`
  - `https://admin.agrolink.biz`
  - Local development ports (`http://localhost:3000`, `http://localhost:3001`, `http://localhost:4000`)

---

## 🎨 Admin Dashboard & Frontend Alignment

### 1. Unified Color Palette
The Admin Dashboard (`admin-panel/tailwind.config.js`) has been aligned with the primary web application design tokens:

| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| `agrolink.green` | `#15803D` | Primary emerald green (buttons, active states, brand headers) |
| `agrolink.orange` | `#F97316` | Jumia-style e-commerce accent orange (CTA buttons, highlight badges) |
| `agrolink.lightGreen` | `#DCFCE7` | Soft mint background for badges and chips |
| `agrolink.darkGreen` | `#166534` | Rich forest green for dark mode headers & hero gradients |

### 2. Typography & Fonts
Imported Google Fonts (*Outfit* and *Inter*) into `admin-panel/src/index.css` to match the main marketplace font system.

### 3. Environment Variable Fallbacks
Added safe default fallbacks across all Admin Redux Slices (`adminAuthSlice`, `dashboardSlice`, `ordersSlice`, `productsSlice`, `reportsSlice`, `usersSlice`):
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
```
This ensures the Admin Dashboard operates seamlessly in both local development and cloud production environments without hardcoded breaks.

---

## 🔐 Production Hardening Checklist

Before launching in a production environment:

1. **Secrets Rotation**:
   - Rotate `JWT_SECRET`, `JWT_REFRESH_SECRET`, Cloudinary keys, and database passwords in the production hosting provider.
   - Do **NOT** commit `.env` files to git repositories (`.gitignore` rules are active).

2. **M-Pesa IP Whitelisting**:
   - For live M-Pesa webhooks, configure reverse proxy (Nginx / Cloudflare) to whitelist Safaricom IP ranges.

3. **HTTPS Enforcement**:
   - Ensure `NODE_ENV=production` is set so error stack traces are hidden and cookies enforce `Secure` and `SameSite=Strict` flags.
