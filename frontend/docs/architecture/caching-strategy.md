# docs/architecture/caching-strategy.md

Version: 1.0

Status: Production Ready

Audience

- Frontend Developers
- Backend Developers
- Software Architects
- DevOps Engineers
- AI Agents

---

# 1. Purpose

This document defines the caching strategy used throughout the Phone Store Frontend.

Caching exists to improve

- Performance
- User Experience
- API Efficiency
- Rendering Speed
- Scalability

A wrong caching strategy causes

- stale data
- inconsistent UI
- duplicated requests
- poor user experience

---

# 2. Philosophy

Caching is NOT storing data forever.

Caching is

Temporary Storage

↓

Reuse

↓

Refresh

↓

Invalidate

↓

Garbage Collection

Every cache must have a lifecycle.

---

# 3. Cache Layers

The application contains multiple cache layers.

Browser Cache

↓

HTTP Cache

↓

CDN Cache

↓

React Query Cache

↓

Memory Cache

↓

Component Cache

Each layer has different responsibilities.

---

# 4. Browser Cache

Managed by

Browser

Stores

Images

Fonts

JavaScript

CSS

Static Assets

Rules

Use long cache lifetime

Fingerprint assets

Never manually invalidate browser cache.

---

# 5. CDN Cache

Stores

Images

Product Photos

Icons

Videos

JavaScript Bundles

CSS Bundles

Benefits

Fast global delivery

Reduced backend load

Lower latency

---

# 6. HTTP Cache

Controlled by

Cache-Control

ETag

Last-Modified

Frontend respects server cache headers.

Do not override them without reason.

---

# 7. React Query Cache

Main application cache.

Stores

Products

Categories

Orders

Cart

Wishlist

Profile

Reviews

Coupons

Never duplicate these into React Context.

---

# 8. Cache Ownership

Each resource has one cache owner.

Example

Products

↓

React Query

Theme

↓

Context

Modal

↓

Component State

Never duplicate ownership.

---

# 9. Cache Lifecycle

Request

↓

Fetch

↓

Cache

↓

Display

↓

Reuse

↓

Background Refetch

↓

Invalidate

↓

Garbage Collection

---

# 10. Query Keys

Every resource uses predictable keys.

Examples

["products"]

["products", page]

["product", productId]

["cart"]

["wishlist"]

["orders"]

Avoid

["abc"]

["test"]

["random"]

---

# 11. Cache Freshness

Fresh

↓

Stale

↓

Refetch

↓

Fresh Again

Fresh data is reused immediately.

Stale data remains usable until new data arrives.

---

# 12. staleTime

Defines

How long cached data remains fresh.

Examples

Categories

30 minutes

Products

5 minutes

User Profile

10 minutes

Cart

0-30 seconds

Choose based on business requirements.

---

# 13. gcTime

Defines

How long unused cache remains in memory.

After expiration

↓

Garbage Collection

↓

Memory Released

---

# 14. Background Refetch

User opens Product List.

↓

Cached data appears instantly.

↓

Background request starts.

↓

UI updates silently.

Never block users waiting for fresh data.

---

# 15. Cache Invalidation

Invalidate only affected resources.

Example

Create Review

↓

Invalidate

Product Reviews

Not

Entire Product Catalog

---

# 16. Optimistic Updates

Examples

Wishlist

Favorites

Cart Quantity

Like Button

Flow

User Action

↓

UI Updates

↓

API Request

↓

Success

↓

Keep Changes

Failure

↓

Rollback

---

# 17. Pagination Cache

Each page owns its cache.

Examples

["products",1]

["products",2]

["products",3]

Do not overwrite page caches.

---

# 18. Infinite Scroll Cache

Each fetched page remains cached.

Page 1

↓

Page 2

↓

Page 3

↓

Merged UI

↓

Independent Cache Entries

---

# 19. Search Cache

Each search query has unique cache.

Examples

iphone

↓

["search","iphone"]

Samsung

↓

["search","samsung"]

Avoid cache collisions.

---

# 20. Filter Cache

Each filter combination is unique.

Brand

Apple

Storage

256GB

Sort

Price

↓

Unique Query Key

---

# 21. Prefetch Strategy

Hover Product

↓

Prefetch Product Detail

Hover Checkout

↓

Prefetch Cart

Hover Category

↓

Prefetch Category

Users experience instant navigation.

---

# 22. Mutation Strategy

Mutation

↓

Backend

↓

Success

↓

Invalidate

↓

Refetch

↓

UI Updated

Avoid manual cache editing unless necessary.

---

# 23. Manual Cache Updates

Allowed for

Wishlist

Cart Quantity

Notification Read Status

Badge Counter

Use carefully.

---

# 24. Persistent Cache

May store

Theme

Language

Draft Checkout

Offline Wishlist

Do not permanently store sensitive server data.

---

# 25. Offline Cache

Future support

Offline Cart

Offline Wishlist

Offline Orders

Queued Mutations

Background Sync

---

# 26. Image Cache

Images should

Use CDN

Use Browser Cache

Use Responsive Sizes

Use Lazy Loading

Never reload identical images unnecessarily.

---

# 27. Cache Synchronization

Events

Login

Logout

Role Change

Product Update

Language Change

should synchronize affected caches.

---

# 28. Cache After Login

Invalidate

Profile

Wishlist

Cart

Orders

Coupons

Permissions

Initialize user-specific cache.

---

# 29. Cache After Logout

Clear

Profile

Cart

Wishlist

Orders

Notifications

Sensitive Information

Prevent data leakage.

---

# 30. Cache Memory Rules

Avoid

Huge Objects

Duplicate Collections

Nested Copies

Unused Cache

Large Images

Keep cache lightweight.

---

# 31. Performance Guidelines

Aim for

High Cache Hit Rate

Minimal Refetch

Fast First Paint

Low Memory Usage

Reduced API Calls

---

# 32. Common Mistakes

❌ Duplicate cache

❌ Random query keys

❌ Infinite staleTime

❌ No invalidation

❌ Refetch everything

❌ Storing cache in Context

❌ Manual synchronization

❌ Massive cache objects

---

# 33. AI Agent Rules

Generated code MUST

Use consistent query keys

Invalidate only affected resources

Prefer background refetch

Use optimistic updates carefully

Avoid duplicate cache

Follow cache ownership

Support offline extension

Keep cache small

---

# 34. Code Review Checklist

Before merging

✓ Query keys consistent

✓ staleTime defined

✓ gcTime appropriate

✓ Invalidation correct

✓ Optimistic update safe

✓ Cache ownership correct

✓ No duplicated data

✓ Performance verified

---

# 35. Future Evolution

Prepared for

React Server Components

Streaming

Edge Cache

Offline First

PWA

Shared Cache

Micro Frontends

Service Workers

Background Sync

---

# 36. Summary

The Phone Store Frontend follows a layered caching architecture.

Caching responsibilities are clearly separated between

- Browser
- CDN
- HTTP
- React Query
- Component Memory

Every resource has a single cache owner.

The strategy prioritizes

- Fast UI
- Minimal API Requests
- Background Updates
- Predictable Invalidation
- Enterprise Scalability

Following these rules ensures high performance while keeping data consistent across the application.