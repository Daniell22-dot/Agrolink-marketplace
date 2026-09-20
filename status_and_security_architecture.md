# AgroLink System Resilience & Restricted Security Dashboard Architecture

## 📌 Executive Overview
This document outlines the design and implementation proposal for two key infrastructure features:
1. **Zero-Downtime Failover & Public Health Status Page**: Ensures continuous app availability so maintenance or repairs on one node occur seamlessly while a secondary standby node serves live traffic.
2. **Restricted Real-Time Security & Threat Status Dashboard**: A highly secure, RBAC-restricted dashboard accessible strictly by the Owner (Super Admin) with granular delegation capabilities to monitor real-time threat activity.

---

## 🔄 Part 1: High Availability & Zero-Downtime Failover Architecture

### 1. Dual-Node Active-Passive Failover Model
To ensure the application never goes offline during maintenance or unexpected node failures:

```
[ Incoming User Traffic ]
           │
           ▼
[ Global Cloudflare / Vercel Edge Load Balancer ]
     │                              │
     ▼ (Primary Health: OK)         ▼ (Failover Backup)
┌─────────────────────────┐    ┌─────────────────────────┐
│ Primary Server (Node A) │    │ Backup Server (Node B)  │
│ [ Active Server Engine ]│    │ [ Hot-Standby Replica ] │
└─────────────────────────┘    └─────────────────────────┘
```

- **Automatic Health Checks**: The Edge router polls `/health` every 10 seconds.
- **Seamless Traffic Switch**: If Node A experiences a 5xx error or latency spike >2000ms, traffic automatically shifts to Node B within 5 seconds without user-facing 502/504 pages.
- **Live Patching**: Developers can update, apply migrations, or correct code on Node A while Node B serves all active users, then swap nodes back seamlessly.

### 2. Public Status Page (`status.agrolink.biz` / `/status`)
Displays live uptime indicators for:
- 🟢 **API Gateway & Proxy Services** (100% Operational)
- 🟢 **PostgreSQL Primary Database** (100% Operational)
- 🟢 **Redis Cache & In-Memory Storage** (100% Operational)
- 🟢 **M-Pesa Payment Callback Gateway** (100% Operational)
- 🟢 **CDN & Media Asset Delivery** (100% Operational)

---

## 🔒 Part 2: Restricted Security & Threat Status Dashboard

### 1. Granular Access Control & Super-Admin Invites
- **Role Requirement**: `SUPER_ADMIN` or explicitly granted `SECURITY_AUDITOR` role.
- **Multi-Factor Authentication (2FA)**: Access strictly enforced with mandatory 2FA TOTP check before viewing security event logs.
- **Admin Delegation**: The Super Admin can generate single-use, time-bound invitation tokens to grant security dashboard access to trusted team members.

### 2. Real-Time Threat Incident Metrics
The Security Dashboard monitors:

| Threat Category | Defense System Implemented | Live Dashboard Metric |
| :--- | :--- | :--- |
| **SQL Injection** | Sequelize Parameterized ORM Queries | Count of intercepted raw SQL attempt patterns |
| **Brute-Force Attack** | 5-Attempt Lockout + `loginLimiter` (5 req / 15 min) | List of locked IPs & locked accounts (`accountLockedUntil`) |
| **Traffic Spikes / DDoS** | `apiLimiter` (10,000 req / 10 min window) | Real-time requests/sec graph & throttled IP logs |
| **XSS & Malicious Payload** | Express `xss-clean` + `hpp` headers | Sanitized script payload logs |
| **Webhook Spoofing** | M-Pesa Callback Payload Validation | Validated vs Rejected STK Push callback count |

---

## 🛡️ Why AgroLink Remains Resilient Under Attack

1. **SQL Injection Immunity**: All database queries execute via Sequelize ORM binding parameters. Direct string concatenation in SQL queries is banned.
2. **Brute Force Neutralization**: Accounts lock automatically for 30 minutes after 5 consecutive failed passwords. IP-level rate limiting prevents brute-forcing auth routes.
3. **Traffic Spike Cushioning**: Redis/In-memory caching handles high-frequency category and product reads, shielding the SQL database from read-exhaustion during peak traffic.
