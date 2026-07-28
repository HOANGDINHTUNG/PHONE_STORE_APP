# docs/architecture/authentication-flow.md

Version: 1.0

Status: Production Ready

Audience

- Frontend Developers
- Backend Developers
- Security Engineers
- AI Agents
- Software Architects

---

# 1. Purpose

This document defines the official authentication architecture used throughout the Phone Store Frontend.

The goals are

- Secure authentication
- Stateless architecture
- Excellent user experience
- Automatic session recovery
- Token lifecycle management
- Enterprise scalability

Authentication must remain transparent to users while maintaining strong security.

---

# 2. Authentication Overview

The application uses

JWT Authentication

combined with

Refresh Token

The frontend never stores user credentials after login.

The frontend only stores authentication tokens according to the project's security policy.

---

# 3. Authentication Flow

User

↓

Login Page

↓

Validation

↓

Backend Authentication

↓

Generate Access Token

↓

Generate Refresh Token

↓

Frontend Storage

↓

Authenticated Session

↓

API Requests

↓

Access Token Expired?

↓

Refresh Token

↓

Retry Request

↓

Continue Session

---

# 4. Login Flow

User enters

Email

Password

↓

React Hook Form

↓

Zod Validation

↓

POST /auth/login

↓

Backend verifies

↓

Success

↓

Return

Access Token

Refresh Token

User Profile

Permissions

↓

Initialize Session

↓

Navigate Home

---

# 5. Logout Flow

User Click Logout

↓

Clear Memory

↓

Clear Cache

↓

Remove Tokens

↓

Invalidate Session

↓

Redirect Login

↓

Reset Application State

Never leave sensitive information after logout.

---

# 6. JWT Structure

JWT contains

Header

↓

Payload

↓

Signature

Frontend SHOULD NOT trust payload blindly.

Backend remains the source of truth.

---

# 7. Access Token

Purpose

Authorize API requests.

Characteristics

Short lifetime

Fast verification

Stateless

Attached to every protected request.

Recommended lifetime

5–30 minutes.

---

# 8. Refresh Token

Purpose

Issue new Access Tokens.

Characteristics

Long lifetime

Highly sensitive

Should never be exposed unnecessarily.

Rotation is recommended.

---

# 9. Token Lifecycle

Login

↓

Receive Tokens

↓

API Requests

↓

Access Token Expires

↓

Refresh Request

↓

Receive New Token

↓

Continue

↓

Logout

↓

Destroy Tokens

---

# 10. Token Storage Strategy

Preferred

Secure HttpOnly Cookie

Alternative

Memory Storage

Avoid

Permanent Local Storage

unless business requirements explicitly allow it.

---

# 11. Authentication State

Authentication State contains

Authenticated

User

Permissions

Roles

Loading

Refreshing

Session Expired

Never duplicate this information across multiple stores.

---

# 12. Protected API Flow

UI

↓

TanStack Query

↓

Axios Client

↓

Attach Authorization Header

↓

Backend

↓

Response

↓

Cache

---

# 13. Axios Interceptor

Every protected request passes through

Request Interceptor

↓

Attach Token

↓

Send Request

↓

Receive Response

↓

Response Interceptor

↓

401?

↓

Refresh

↓

Retry

---

# 14. Automatic Token Refresh

Request

↓

401

↓

Pause Pending Requests

↓

Refresh Token

↓

Success

↓

Replay Requests

↓

Continue

If refresh fails

↓

Logout

---

# 15. Refresh Queue

Multiple requests may fail simultaneously.

Correct Strategy

One Refresh Request

↓

Other Requests Wait

↓

Refresh Success

↓

Replay Queue

Avoid sending ten refresh requests.

---

# 16. Silent Refresh

Users should never notice token renewal.

No popup

No redirect

No loading screen

Only background refresh.

---

# 17. Session Expiration

Refresh Token Expired

↓

Invalidate Session

↓

Clear Cache

↓

Redirect Login

↓

Display Friendly Message

Never enter infinite refresh loops.

---

# 18. Role-Based Access Control

Example Roles

CUSTOMER

STAFF

ADMIN

SUPER_ADMIN

Roles determine available routes and actions.

---

# 19. Permission-Based Access

Permissions are more granular.

Examples

PRODUCT_READ

PRODUCT_CREATE

PRODUCT_UPDATE

ORDER_APPROVE

REPORT_VIEW

Routes may require permissions instead of roles.

---

# 20. Route Protection

Public

↓

Guest

↓

Protected

↓

Admin

↓

Permission Route

Each level performs independent checks.

---

# 21. Authentication Context

Context stores

Authentication Status

Current User

Logout

Refresh Status

Never store product data here.

---

# 22. Current User

After login

Fetch

GET /users/me

The backend becomes the source of truth.

Never trust JWT payload alone.

---

# 23. Multi-Tab Synchronization

Logout in one tab

↓

Notify Other Tabs

↓

Clear Session

↓

Redirect Login

Use

BroadcastChannel

or Storage Events.

---

# 24. Remember Me

Remember Me extends session duration.

It should never disable authentication security.

---

# 25. Password Reset

Forgot Password

↓

Email Verification

↓

Temporary Token

↓

Reset Password

↓

Login Again

Never automatically authenticate after password reset.

---

# 26. OAuth Login

Supported Providers

Google

GitHub

Facebook (Future)

Flow

Frontend

↓

OAuth Provider

↓

Backend

↓

Issue JWT

↓

Application Session

---

# 27. Two-Factor Authentication

Future Support

Login

↓

Password

↓

OTP

↓

Verification

↓

Issue JWT

Architecture already supports this extension.

---

# 28. Security Rules

Never

Log Tokens

Expose Tokens

Store Password

Trust Client Validation

Disable HTTPS

Always

Validate Server Responses

Sanitize Inputs

Handle Expiration

Protect Sensitive Routes

---

# 29. Error Handling

Possible Errors

401 Unauthorized

403 Forbidden

419 Session Expired

429 Too Many Requests

500 Internal Error

Each should have dedicated UI feedback.

---

# 30. TanStack Query Integration

Authentication changes should

Invalidate

Current User

Wishlist

Cart

Orders

Notifications

Refresh only affected queries.

---

# 31. Logout Cleanup

Remove

Authentication State

Cached User

Temporary Forms

Sensitive Memory

Shopping Session (if required)

Analytics Identity

---

# 32. AI Agent Rules

Generated authentication code MUST

Use Axios Interceptors

Support Silent Refresh

Avoid Infinite Retry

Protect Routes

Clear Session Properly

Use Secure Storage

Avoid Duplicated Auth State

Follow Permission Model

---

# 33. Best Practices

✔ Stateless Authentication

✔ Short Access Token Lifetime

✔ Refresh Rotation

✔ Background Refresh

✔ Role Separation

✔ Permission Checks

✔ Secure Storage

✔ Friendly Session Expiration

✔ Cache Invalidation

✔ Route Protection

---

# 34. Anti Patterns

❌ Store Password

❌ Infinite Refresh Loop

❌ Multiple Refresh Requests

❌ LocalStorage Without Review

❌ Trust JWT Payload Completely

❌ Duplicate Auth Stores

❌ Route Protection Inside Components

❌ Ignore Token Expiration

❌ Forget Logout Cleanup

❌ Log Sensitive Data

---

# 35. Checklist

Before Release

✓ Login Works

✓ Logout Works

✓ Refresh Works

✓ Expired Session Works

✓ Role Protection Works

✓ Permission Protection Works

✓ Interceptors Configured

✓ Multi-Tab Sync Works

✓ Tokens Never Logged

✓ Cache Cleared After Logout

---

# 36. Future Evolution

Prepared for

OAuth 2.1

Passkeys

WebAuthn

Multi-Factor Authentication

SSO

Enterprise Identity Providers

Device Trust

Risk-Based Authentication

---

# Summary

The Phone Store Frontend authentication architecture is designed around

- JWT Authentication
- Refresh Token Rotation
- Secure Token Storage
- Automatic Session Recovery
- Role-Based Access Control
- Permission-Based Authorization
- TanStack Query Integration
- React Router Protection

This architecture provides enterprise-grade security while maintaining a seamless user experience.