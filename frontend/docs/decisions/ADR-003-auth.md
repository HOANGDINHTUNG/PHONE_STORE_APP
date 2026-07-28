# docs/decisions/ADR-003-auth.md

Status: Accepted

Date: 2026-07-28

Decision Makers

- Frontend Architect
- Backend Architect
- Security Engineer
- Tech Lead

Related Documents

- docs/architecture/authentication-flow.md
- docs/api/auth-api.md
- docs/api/response-patterns.md
- ADR-001-routing.md
- ADR-002-query.md

---

# ADR-003

Authentication & Authorization Strategy

---

# 1. Context

The Phone Store Frontend provides access to multiple business domains.

Examples

- Customer Portal
- Checkout
- Payment
- Wishlist
- Order History
- Admin Dashboard
- Inventory
- Reports
- User Management

Different users require different permissions.

A unified authentication and authorization architecture is required.

---

# 2. Problem

Without a standard authentication strategy the application may suffer from

Inconsistent login flow

↓

Token leaks

↓

Unauthorized access

↓

Poor session management

↓

Broken refresh logic

↓

Security vulnerabilities

↓

Maintenance difficulties

---

# 3. Decision

The project officially adopts

JWT Access Token

+

Refresh Token

+

Role-Based Access Control (RBAC)

+

Permission-Based Authorization

+

Automatic Token Refresh

This architecture applies to all authenticated features.

---

# 4. Authentication vs Authorization

Authentication answers

Who are you?

Authorization answers

What are you allowed to do?

Never mix these responsibilities.

---

# 5. Authentication Flow

Login

↓

Receive Access Token

↓

Receive Refresh Token

↓

Access Protected APIs

↓

Refresh Access Token Automatically

↓

Logout

---

# 6. Access Token

Purpose

Authenticate API requests.

Characteristics

Short-lived

Stateless

Signed

Sent with every protected request.

---

# 7. Refresh Token

Purpose

Obtain a new access token.

Characteristics

Long-lived

Rotated

Revocable

Never sent with every API request.

---

# 8. Token Lifetime

Access Token

Short lifetime

Refresh Token

Longer lifetime

Exact durations are defined by backend policy.

Never hardcode expiration assumptions in the frontend.

---

# 9. Token Rotation

Every refresh operation should invalidate the previous refresh token.

Benefits

Reduced replay attacks

Improved session security

---

# 10. Token Storage

Preferred

HttpOnly Secure Cookie

Alternative

In-memory Access Token

Avoid Local Storage for long-lived sensitive credentials whenever backend architecture allows secure cookies.

---

# 11. Secure Cookies

Cookies should support

HttpOnly

Secure

SameSite

Configured by backend.

Frontend must not rely on JavaScript access to HttpOnly cookies.

---

# 12. Authorization Model

Authorization combines

Roles

+

Permissions

Role examples

Customer

Staff

Admin

Super Admin

---

# 13. Permission Model

Permissions are fine-grained.

Examples

product.read

product.update

order.cancel

coupon.create

report.export

Never rely only on roles.

---

# 14. Route Protection

Protected routes require

Valid Session

Required Role

Required Permission

Route visibility is not security.

---

# 15. Backend Enforcement

Backend always performs authorization.

Frontend guards improve user experience only.

Never trust the client.

---

# 16. Login

Successful login returns

Authenticated User

Access Token

Refresh Token

Session Metadata

Frontend stores only what is necessary.

---

# 17. Logout

Logout should

Invalidate session

Clear cached user data

Clear authentication state

Redirect appropriately

---

# 18. Silent Refresh

Access token renewal should occur automatically before expiration when possible.

Users should not be interrupted.

---

# 19. Refresh Queue

If multiple requests fail due to an expired access token

Pause pending requests

↓

Refresh once

↓

Replay queued requests

Never send multiple refresh requests simultaneously.

---

# 20. Expired Session

If refresh fails

Clear session

↓

Redirect to login

↓

Display informative message

Avoid infinite refresh loops.

---

# 21. HTTP Status Handling

401

Unauthenticated

403

Authenticated but forbidden

429

Rate limited

500

Server error

Each status requires dedicated handling.

---

# 22. Session Restoration

After page reload

Restore session automatically if valid.

Avoid forcing unnecessary logins.

---

# 23. Multi-tab Synchronization

Tabs should synchronize

Login

Logout

Session expiration

Permission changes

Maintain consistent user state.

---

# 24. Password Handling

Passwords are never

Stored

Cached

Logged

Displayed

Frontend transmits passwords only during authentication requests.

---

# 25. CSRF Protection

If cookie authentication is used

Backend must provide CSRF protection.

Frontend includes CSRF tokens when required.

---

# 26. XSS Prevention

Never render untrusted HTML.

Escape user content.

Sanitize rich text.

Avoid dangerous DOM APIs.

---

# 27. CORS

Frontend never bypasses CORS.

CORS policy belongs to backend configuration.

---

# 28. Sensitive Data

Avoid storing

Passwords

Credit card data

Refresh tokens (where secure cookies are available)

Private secrets

---

# 29. User Profile

Current authenticated user is treated as server state.

Retrieve using TanStack Query.

Do not duplicate user data unnecessarily.

---

# 30. Permission Updates

Permission changes should refresh

Navigation

Protected Routes

Menus

Buttons

Visible actions

---

# 31. Idle Timeout

Applications may warn users before automatic session expiration.

Allow graceful recovery whenever possible.

---

# 32. Audit Events

Authentication events include

Login

Logout

Password Change

Refresh

Session Expiration

Frontend may emit analytics events without exposing sensitive information.

---

# 33. Error Messages

Authentication failures should be informative but not reveal sensitive implementation details.

Avoid exposing internal security logic.

---

# 34. Performance

Avoid validating permissions repeatedly during every render.

Reuse derived authorization state.

---

# 35. Folder Structure

Recommended

auth/

guards/

permissions/

session/

hooks/

api/

tokens/

Each module has a single responsibility.

---

# 36. AI Agent Rules

Generated authentication code MUST

Use centralized auth logic

Support refresh queue

Support silent refresh

Separate authentication from authorization

Never hardcode roles

Never expose sensitive data

Respect backend contracts

---

# 37. Best Practices

✔ Short-lived access tokens

✔ Refresh token rotation

✔ HttpOnly cookies

✔ RBAC

✔ Permission checks

✔ Silent refresh

✔ Secure logout

✔ Session synchronization

---

# 38. Anti Patterns

❌ Long-lived access tokens

❌ Tokens in URLs

❌ Hardcoded permissions

❌ Local authorization only

❌ Infinite refresh loops

❌ Logging sensitive information

❌ Trusting hidden UI

❌ Business logic inside route guards

---

# 39. Review Checklist

Before Merge

✓ Login flow verified

✓ Logout flow verified

✓ Refresh logic tested

✓ Route guards validated

✓ Permission checks reviewed

✓ Session restoration works

✓ Error handling complete

✓ Sensitive data protected

✓ Security review completed

✓ Tests updated

---

# 40. Consequences

Positive

Consistent authentication

Improved security

Predictable authorization

Simplified maintenance

Enterprise scalability

Negative

More implementation complexity

Requires coordination with backend

---

# 41. Decision Summary

The Phone Store Frontend officially adopts a JWT-based authentication architecture with short-lived access tokens, refresh-token rotation, centralized session management, RBAC, permission-based authorization, silent token refresh, and backend-enforced security.

Authentication and authorization remain separate concerns, ensuring a scalable, maintainable, and secure foundation for all protected application features.