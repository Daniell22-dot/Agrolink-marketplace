# AgroLink Notification Pipelines, Account Deletion & System Architecture Report

## 📌 1. Notification: System vs. Service Architecture

In AgroLink, notifications are structured as a **Multi-Layered Notification System** composed of dedicated **Asynchronous Micro-Services**:

```
 ┌────────────────────────────────────────────────────────────────────────┐
 │                      AGROLINK NOTIFICATION SYSTEM                       │
 └────────────────────────────────────────────────────────────────────────┘
                                    │
               ┌────────────────────┼────────────────────┐
               ▼                    ▼                    ▼
     ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
     │ Database Layer   │  │ Real-Time Socket │  │ Preference Engine│
     │ (Notification.js)│  │ (emitToUser)     │  │ (User.preferences│
     └──────────────────┘  └──────────────────┘  └──────────────────┘
                                    │
                     ┌──────────────┴──────────────┐
                     ▼                             ▼
       ┌───────────────────────────┐ ┌───────────────────────────┐
       │   Email Dispatch Service  │ │    SMS Dispatch Service   │
       │ (Nodemailer / Bull Queue) │ │ (Africa's Talking / SMS)  │
       └───────────────────────────┘ └───────────────────────────┘
```

- **Notification System (Domain)**: Oversees user preference rules, in-app notification badges, persistence, and audit tracking.
- **Notification Services (Workers)**: Isolated event-driven background workers (Bull queue / mock fallback, Nodemailer SMTP, SMS gateway) that execute asynchronously without blocking API responses.

---

## ⚡ 2. Aggressive Multi-Channel Event Pipelines

### A. Real-Time Socket Pipeline
- Instantly emits `notification` events over Socket.IO connections (`emitToUser(userId, 'notification', payload)`).
- Automatically updates in-app notification counters in real time without requiring page refreshes.

### B. Email Pipeline
- **Template Engine**: Handles order confirmations, payment receipts, password resets, and trade alerts.
- **Failover Queue**: Dispatches via Bull Queue with Redis backing; falls back to an in-memory execution queue if Redis is temporarily offline.

### C. SMS Pipeline
- Integrates with Africa's Talking SMS API for instant SMS updates on order status changes and M-Pesa payment receipts.

### D. Preference Rules Engine
Before any multi-channel dispatch occurs, `notificationService.js` evaluates `user.preferences`:
```javascript
const prefs = user.preferences || { emailNotifications: true, smsAlerts: true, orderUpdates: true };
if (prefs.emailNotifications !== false && prefs.orderUpdates !== false) {
  // Dispatch Email
}
```

---

## 🗑️ 3. Account Deletion & Anonymization Engine

### 1. API Contract & Endpoint
- **Route**: `DELETE /api/users/account`
- **Protection**: Gated by `protect` JWT middleware.
- **Body Requirement**: `{ "password": "current_password" }` (for password-registered accounts).

### 2. Execution Flow & Guard Rules

```
[ User Requests Account Deletion ]
               │
               ▼
   Password Verified Correctly?
        │                │
     (No)│                │(Yes)
         ▼                ▼
   401 Unauthorized    Active Orders Check
                       (Pending, Approved, Shipped?)
                            │                │
                         (Yes)│                │(No)
                              ▼                ▼
                     400 Bad Request     Execute Clean-up & Anonymization
```

### 3. Cascade Clean-up Steps
1. **Session Destruction**: Deletes all active `RefreshToken` entries in PostgreSQL.
2. **Cache Eviction**: Destroys Redis cart key `cart:${userId}`.
3. **Notification Removal**: Purges user entries from `Notification` table.
4. **Product Deactivation**: If user is a farmer, marks all listed products as `isAvailable: false`.
5. **Data Anonymization**: 
   - Replaces `fullName` with `"Deactivated User"`.
   - Replaces `email` with `deleted_${userId}_${timestamp}@deleted.agrolink.co.ke`.
   - Nullifies PII (`phone`, `nationalId`, `avatar`, `location`, `googleId`).
   - Sets `isActive: false`.

---

## ⚙️ 4. Preference Management API
Users can toggle their communication preferences at any time:
- **Route**: `PUT /api/users/preferences`
- **Payload**:
  ```json
  {
    "emailNotifications": true,
    "smsAlerts": false,
    "orderUpdates": true,
    "marketingEmails": false
  }
  ```
