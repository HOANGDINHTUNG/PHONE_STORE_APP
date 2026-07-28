# docs/architecture/state-management.md

Version: 1.0

Status: Production Ready

Audience

- Frontend Developers
- Team Leaders
- Software Architects
- AI Agents

---

# 1. Purpose

This document defines the official state management architecture for the Phone Store Frontend.

The primary goals are:

- Predictable state management
- High performance
- Minimal re-render
- Easy debugging
- Clear separation of responsibilities
- AI-friendly implementation
- Enterprise scalability

Every piece of state MUST belong to exactly one state category.

Never store the same data in multiple places.

---

# 2. State Philosophy

A common mistake in frontend projects is treating all data as "React State".

This project separates state into specialized categories.

Every state has a single owner.

Never duplicate ownership.

---

# 3. State Categories

The application contains five different state layers.

Browser State

↓

URL State

↓

Server State

↓

Client State

↓

Form State

Each layer solves a different problem.

---

# 4. Browser State

Owned by

Browser

Examples

Theme Preference

Viewport

Scroll Position

Clipboard

History

Online Status

Window Size

Preferred Language

The application only reads or synchronizes these values.

---

# 5. URL State

Owned by

React Router

Examples

Current Page

Current Category

Current Search

Sorting

Filters

Pagination

Example

/products?page=2&brand=apple&sort=price

Rules

✓ Shareable

✓ Bookmarkable

✓ SEO Friendly

Never duplicate URL state into React State.

---

# 6. Server State

Owned by

TanStack Query

Examples

Products

Orders

Categories

Brands

Coupons

Profile

Notifications

Inventory

Reviews

Wishlist

Cart

Characteristics

✓ Cached

✓ Async

✓ Shared

✓ Refetchable

Never manage server state with useState.

---

# 7. Client State

Owned by

React

Examples

Sidebar

Modal

Drawer

Accordion

Selected Image

Expanded Card

Current Step

Menu

Tooltip

Popover

These values only exist during user interaction.

---

# 8. Form State

Owned by

React Hook Form

Validation

↓

Zod

Examples

Checkout Form

Register Form

Login Form

Shipping Address

Payment Information

Never manage forms with dozens of useState calls.

---

# 9. Derived State

Derived State is calculated.

Never stored.

Example

Total Price

↓

Cart Items

×

Quantity

Wrong

const [total,setTotal]

Correct

const total = useMemo(...)

---

# 10. Source of Truth

Every data has exactly one owner.

Example

Product List

Owner

TanStack Query

NOT

React Context

NOT

Redux

NOT

Component State

---

# 11. Data Flow

User Click

↓

Mutation

↓

API

↓

Backend

↓

Database

↓

Response

↓

TanStack Cache

↓

React Render

↓

Updated UI

---

# 12. Server State Lifecycle

Fetch

↓

Cache

↓

Display

↓

Background Refetch

↓

Update

↓

Invalidate

↓

Garbage Collection

---

# 13. Cache Ownership

Each API has one cache key.

Example

["products"]

["product", id]

["cart"]

["orders"]

Never invent random keys.

---

# 14. Cache Rules

Cache should be

Consistent

Small

Reusable

Predictable

Never duplicate cache.

---

# 15. Cache Invalidation

Invalidate only affected data.

Example

Create Review

↓

Invalidate

Product Review

NOT

Everything

---

# 16. Optimistic Update

Update UI first.

↓

Send Request.

↓

Rollback if failed.

Suitable for

Wishlist

Cart

Likes

Favorites

Quantity

---

# 17. Background Refetch

Display cached data.

↓

Fetch latest.

↓

Update silently.

Benefits

Fast UX

Fresh data

---

# 18. Prefetch

Before opening

Product Detail

↓

Prefetch Product

Before Checkout

↓

Prefetch Cart

---

# 19. React Context

Context is NOT a global database.

Suitable for

Theme

Locale

Authentication

Permissions

Feature Flags

Not suitable for

Products

Orders

Categories

---

# 20. Local Component State

Use useState only for UI.

Examples

Dropdown

Tab

Modal

Accordion

Never store backend data here.

---

# 21. useReducer

Use when state transitions become complex.

Examples

Checkout Wizard

Shopping Configurator

Multi Step Form

Do not replace every useState with useReducer.

---

# 22. useOptimistic (React 19)

Use for

Instant UI

Example

Like Product

Wishlist

Quantity

Review

Rollback automatically on failure.

---

# 23. React Compiler

React Compiler automatically optimizes many renders.

Still follow good state separation.

Compiler is not magic.

---

# 24. Global State

Avoid large global stores.

Only global if truly global.

Theme

Language

Authentication

Permission

Everything else belongs elsewhere.

---

# 25. State Normalization

Avoid nested duplicated objects.

Bad

Product

↓

Category

↓

Product

↓

Category

Good

Unique resources.

Reference IDs.

---

# 26. Component Communication

Parent

↓

Props

↓

Child

Avoid

Sibling communication.

Use lifted state.

---

# 27. Event Flow

UI

↓

Handler

↓

Mutation

↓

API

↓

Cache

↓

Render

Never skip layers.

---

# 28. Offline Strategy

Future support

Offline Cart

Offline Wishlist

Background Sync

Retry Queue

Persistent Cache

---

# 29. Persistence

Persist only

Theme

Locale

Authentication

Draft Checkout

Never persist

API Cache Forever

---

# 30. AI Agent Rules

When AI generates code

It MUST

Choose correct state type

Avoid duplicated state

Prefer TanStack Query

Avoid unnecessary Context

Prefer derived state

Keep UI state local

Follow cache conventions

Generate proper query keys

Use optimistic updates correctly

---

# 31. Anti Patterns

❌ API in useEffect

❌ Products inside Context

❌ Everything in Redux

❌ Duplicate cache

❌ Duplicate useState

❌ Derived state stored

❌ Global modal state

❌ Nested providers

❌ Query inside component tree

❌ Random cache keys

---

# 32. Checklist

Before adding state

✓ Is this server data?

✓ Is this UI only?

✓ Is this URL state?

✓ Is this form state?

✓ Can this be derived?

✓ Is there already an owner?

✓ Does it duplicate another source?

✓ Is caching needed?

✓ Does it need persistence?

---

# 33. Future Roadmap

Prepared for

React Server Components

Streaming

Suspense

Offline Mode

Micro Frontend

AI Generated Features

Shared Cache

Edge Rendering

---

# 34. Summary

This architecture separates state into specialized layers.

Every piece of data has one owner.

Server data belongs to TanStack Query.

UI belongs to React.

Forms belong to React Hook Form.

Routing belongs to React Router.

Following these rules ensures predictable behavior, excellent performance, maintainability, and long-term scalability.