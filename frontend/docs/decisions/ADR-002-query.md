# docs/decisions/ADR-002-query.md

Status: Accepted

Date: 2026-07-28

Decision Makers

- Frontend Architect
- Backend Architect
- Tech Lead

Related Documents

- docs/architecture/state-management.md
- docs/architecture/caching-strategy.md
- docs/api/openapi.yaml
- docs/api/response-patterns.md

---

# ADR-002

Server State Management Strategy

---

# 1. Context

The Phone Store Frontend communicates with multiple backend services.

Examples

- Authentication
- Products
- Categories
- Orders
- Payment
- Wishlist
- Reviews
- Notifications
- User Profile
- Dashboard

The application requires

- Request caching
- Background synchronization
- Pagination
- Infinite scrolling
- Optimistic updates
- Offline resilience
- Retry strategy
- Request deduplication

Traditional client-state libraries are insufficient for these requirements.

---

# 2. Problem

Managing server state manually leads to

Duplicate requests

↓

Loading inconsistency

↓

Race conditions

↓

Complex cache logic

↓

Stale data

↓

Poor user experience

A dedicated server-state solution is required.

---

# 3. Decision

The project officially adopts

TanStack Query v5

for all server state.

Client state remains separate.

---

# 4. Responsibilities

TanStack Query manages

Server State

↓

Caching

↓

Synchronization

↓

Background Refetch

↓

Retries

↓

Optimistic Updates

↓

Pagination

↓

Infinite Query

It does NOT replace local UI state.

---

# 5. Alternatives Considered

Redux Toolkit Query

Pros

Integrated Redux ecosystem

Cons

Requires Redux dependency

Less flexible cache model

---

SWR

Pros

Simple API

Cons

Smaller feature set

Limited enterprise patterns

---

Apollo Client

Pros

Excellent GraphQL support

Cons

REST-first project

Rejected.

---

Manual Fetch

Rejected immediately.

Reason

Maintenance cost.

---

# 6. Decision Rationale

TanStack Query provides

Excellent caching

↓

Automatic synchronization

↓

Powerful mutations

↓

Framework independence

↓

Outstanding documentation

↓

Enterprise scalability

---

# 7. State Separation

Application State

↓

Server State

↓

Client State

↓

Form State

↓

URL State

↓

Temporary UI State

Never mix these responsibilities.

---

# 8. Server State

Examples

Products

Orders

Categories

Coupons

Reviews

Addresses

Inventory

Payment Status

Always managed by TanStack Query.

---

# 9. Client State

Examples

Sidebar

Theme

Current Modal

Current Tab

Drawer

Wizard Step

Tooltip

Client state belongs in React state or Context.

---

# 10. Form State

Managed by

React Hook Form

Validation

Zod

Never use TanStack Query for form state.

---

# 11. Query Keys

Query Keys must be

Stable

Typed

Predictable

Hierarchical

Good

products

products-list

products-detail

orders-history

users-profile

Bad

data

list

query1

temp

---

# 12. Query Key Structure

Recommended hierarchy

Feature

↓

Resource

↓

Identifier

↓

Filter

↓

Pagination

Example

products

↓

detail

↓

productId

↓

locale

↓

currency

---

# 13. Query Functions

Query Functions must

Only fetch data

Avoid UI logic

Avoid navigation

Avoid notifications

Remain pure.

---

# 14. Mutations

Mutations handle

Create

Update

Delete

Checkout

Payment

Upload

Login

Logout

Mutations must never be used for reads.

---

# 15. Cache Strategy

Every query should define

staleTime

gcTime

Retry Policy

Refetch Policy

Placeholder Strategy

Avoid relying on defaults everywhere.

---

# 16. staleTime

Purpose

Controls freshness.

Fresh

↓

No Refetch

Expired

↓

Background Refetch

Different resources may require different staleTime values.

---

# 17. gcTime

Purpose

Controls cache lifetime.

Expired cache should be garbage collected automatically.

Avoid excessively long cache durations.

---

# 18. Background Refetch

Allowed

Product List

Categories

User Profile

Exchange Rates

Configuration

Avoid unnecessary background traffic.

---

# 19. Retry Strategy

Retry

Transient Errors

Network Errors

Timeouts

Do NOT retry

Validation Errors

Authentication Errors

Business Rule Violations

---

# 20. Optimistic Updates

Allowed for

Wishlist

Cart Quantity

Profile Update

Like

Favorite

Bookmark

Avoid optimistic updates for payment operations.

---

# 21. Query Invalidation

Invalidate only affected resources.

Good

Update Product

↓

Invalidate Product Detail

↓

Invalidate Product List (if necessary)

Avoid invalidating everything.

---

# 22. Prefetching

Allowed

Product Detail

Next Page

Checkout

Frequently visited pages

Improve perceived performance.

---

# 23. Infinite Query

Used only when

Infinite Scroll

Timeline

Reviews

Notifications

Activity Feed

Avoid using infinite queries for small datasets.

---

# 24. Pagination

Standard pagination includes

Page

Size

Sort

Filter

Search

Maintain URL synchronization where appropriate.

---

# 25. Placeholder Data

Placeholder data may be used

To avoid layout shift

To improve perceived performance

Never display misleading information.

---

# 26. Error Handling

Every query must define

Loading

Empty

Error

Success

Retry

Offline

No screen should remain blank.

---

# 27. Loading States

Preferred

Skeleton

Then

Spinner

Avoid flashing loading indicators.

---

# 28. Offline Support

Detect connectivity changes.

Avoid repeated failed requests.

Allow automatic recovery after reconnection.

---

# 29. Cancellation

Cancel outdated requests

Search

Autocomplete

Rapid navigation

Prevent race conditions.

---

# 30. Request Deduplication

Multiple identical requests should reuse the same promise whenever possible.

Avoid duplicate network traffic.

---

# 31. Suspense

Suspense may be adopted gradually.

Do not mix Suspense and manual loading patterns within the same feature without clear justification.

---

# 32. DevTools

TanStack Query DevTools

Enabled

Development

Disabled

Production

---

# 33. Security

Never cache

Passwords

Tokens

Sensitive secrets

Sensitive information must follow backend security requirements.

---

# 34. Performance

Avoid

Nested queries

Waterfall requests

Duplicate fetching

Unbounded cache growth

---

# 35. Folder Structure

Recommended

api/

queries/

mutations/

queryKeys/

hooks/

types/

Each feature owns its own queries.

---

# 36. AI Agent Rules

Generated code MUST

Use TanStack Query

Use standardized query keys

Separate query and mutation

Handle loading/error/empty states

Invalidate selectively

Avoid duplicate requests

Use typed responses

---

# 37. Best Practices

✔ Typed query keys

✔ Feature ownership

✔ Optimistic updates where appropriate

✔ Skeleton loading

✔ Selective invalidation

✔ Background synchronization

✔ Retry only transient failures

✔ URL-aware pagination

---

# 38. Anti Patterns

❌ Fetch inside components repeatedly

❌ Global cache invalidation

❌ Manual loading flags everywhere

❌ API calls in render

❌ Cache sensitive credentials

❌ Mixed server/client state

❌ Duplicate query keys

❌ Query functions with side effects

---

# 39. Review Checklist

Before Merge

✓ Query key follows convention

✓ Query function is pure

✓ Loading state exists

✓ Empty state exists

✓ Error state exists

✓ Retry policy reviewed

✓ Cache strategy defined

✓ Invalidations minimized

✓ Types verified

✓ Tests updated

---

# 40. Consequences

Positive

Consistent server-state architecture

Reduced network traffic

Automatic synchronization

Simplified async logic

Improved developer experience

Better scalability

Negative

Developers must understand cache behavior

Requires disciplined query-key management

---

# 41. Decision Summary

The Phone Store Frontend officially adopts TanStack Query v5 as the standard solution for all server-state management.

Server state, client state, form state, and UI state remain clearly separated. Every query and mutation must follow standardized query-key conventions, explicit cache policies, selective invalidation, and enterprise-ready loading, error, and synchronization strategies.