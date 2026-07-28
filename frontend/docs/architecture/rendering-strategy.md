# docs/architecture/rendering-strategy.md

Version: 1.0

Status: Production Ready

Audience

- Frontend Developers
- Software Architects
- AI Agents
- Technical Leaders

---

# 1. Purpose

This document defines the official rendering strategy used throughout the Phone Store Frontend application.

The objectives are:

- Maximize rendering performance
- Reduce unnecessary re-renders
- Improve Time To Interactive (TTI)
- Improve Largest Contentful Paint (LCP)
- Improve user experience
- Support React 19
- Prepare for future Server Components

Every page and component MUST follow these rendering strategies.

---

# 2. Rendering Philosophy

Rendering is expensive.

The goal is NOT to prevent all renders.

The goal is to make rendering:

- Predictable
- Fast
- Minimal
- Incremental
- User-focused

A render is not a problem.

An unnecessary render is.

---

# 3. Rendering Pipeline

Browser Request

↓

React Router

↓

Route Matching

↓

Layout Rendering

↓

Page Rendering

↓

Feature Rendering

↓

Component Rendering

↓

Virtual DOM

↓

Reconciliation

↓

Commit Phase

↓

Browser Paint

---

# 4. Rendering Priorities

Priority 1

Critical UI

Examples

- Header
- Navigation
- Product Title
- Price
- Buy Button

Must render immediately.

---

Priority 2

Primary Content

Examples

- Product Images
- Product Information
- Reviews Summary

---

Priority 3

Secondary Content

Examples

- Related Products
- Recommendations
- Recently Viewed
- Suggested Accessories

Can be deferred.

---

Priority 4

Non-Critical Content

Examples

- Analytics
- Chat Widget
- Ads
- Tracking Scripts

Load after interaction.

---

# 5. Rendering Types

The project supports multiple rendering strategies.

Client Side Rendering (CSR)

Default

↓

Lazy Rendering

↓

Progressive Rendering

↓

Streaming Ready

↓

Server Components Ready

↓

SSR Ready (Future)

---

# 6. Client Side Rendering (CSR)

Most pages use CSR.

Advantages

- Rich interactions
- Fast navigation after initial load
- Simple deployment
- Excellent developer experience

Suitable for

- Dashboard
- Checkout
- Profile
- Cart
- Wishlist

---

# 7. Progressive Rendering

Render UI in stages.

Example

Header

↓

Skeleton

↓

Basic Product Info

↓

Gallery

↓

Reviews

↓

Recommendations

Never wait for everything before displaying content.

---

# 8. Skeleton Loading

Always prefer Skeleton over Spinner.

Good

Skeleton Product Card

Skeleton Table

Skeleton Gallery

Bad

Full-screen spinner for every request.

Benefits

- Better perceived performance
- Stable layout
- Reduced CLS

---

# 9. Lazy Rendering

Only render when necessary.

Examples

- Product Reviews
- Similar Products
- Image Zoom
- Specifications
- Charts
- Admin Reports

Techniques

- React.lazy()
- Suspense
- Dynamic import()

---

# 10. Route-Based Code Splitting

Every major page should be split.

Example

Login

Home

Products

Cart

Checkout

Dashboard

Each route becomes an independent bundle.

Benefits

- Smaller initial download
- Faster first load
- Better caching

---

# 11. Component-Based Code Splitting

Heavy components should load independently.

Examples

Rich Text Editor

Map

Chart

3D Viewer

PDF Preview

Image Cropper

Avoid loading these on initial render.

---

# 12. React Suspense

Use Suspense for

- Lazy components
- Async boundaries
- Future streaming

Always provide a meaningful fallback.

Good

Product Skeleton

Bad

Loading...

---

# 13. React 19 Rendering

React 19 introduces better concurrent rendering.

Benefits

- Smoother updates
- Better scheduling
- Less UI blocking
- Improved responsiveness

Developers should avoid forcing synchronous work.

---

# 14. Concurrent Rendering

React can interrupt low-priority work.

Example

User typing

↓

Search query updating

↓

Background recommendation rendering

Typing should never freeze.

---

# 15. useTransition

Use for low-priority updates.

Examples

Product Filtering

Sorting

Search Result Refresh

Large Table Updates

Avoid using for

Button clicks

Authentication

Critical actions

---

# 16. useDeferredValue

Useful for

Search

Filters

Large Lists

Example

User types instantly.

Search results update slightly later.

Result

Smooth typing.

---

# 17. React Compiler

React Compiler automatically optimizes many renders.

Still follow good architecture.

Compiler cannot fix:

- Bad state ownership
- Huge components
- Poor data flow

---

# 18. Rendering Boundaries

Split UI into rendering boundaries.

Product Page

↓

Gallery

↓

Info

↓

Reviews

↓

Recommendations

A review update should not re-render the gallery.

---

# 19. Memoization Strategy

Memoize only when needed.

Use

React.memo

useMemo

useCallback

Do not memoize everything.

Memoization has its own cost.

---

# 20. React.memo

Suitable for

Pure UI Components

Examples

Price

Rating

Badge

Avatar

Product Card

Avoid if props always change.

---

# 21. useMemo

Use only for expensive calculations.

Examples

Filter products

Sort products

Calculate totals

Build chart data

Do not wrap simple expressions.

---

# 22. useCallback

Useful when

Passing callbacks to memoized children.

Examples

Table

Virtual List

Large Forms

Avoid unnecessary useCallback everywhere.

---

# 23. Virtualization

Render only visible items.

Suitable for

Admin Product Table

Orders

Customer List

Inventory

Notifications

Libraries

TanStack Virtual

React Virtual

---

# 24. Image Rendering

Use responsive images.

Support

WebP

AVIF

Lazy Loading

Blur Placeholder

Responsive Sizes

CDN Optimization

Never load original 5000px images.

---

# 25. Rendering Product Grid

Load

Header

↓

Filters

↓

Skeleton Cards

↓

Real Product Cards

↓

Infinite Scroll

↓

Footer

Avoid layout shifts.

---

# 26. Rendering Tables

Large tables should

- Virtualize rows
- Paginate
- Lazy render cells
- Memoize columns

Never render 10,000 rows.

---

# 27. Conditional Rendering

Preferred

Loading

↓

Success

↓

Empty

↓

Error

Each state should have its own component.

---

# 28. Error Rendering

Never display blank pages.

Render

Error Boundary

↓

Friendly Message

↓

Retry Button

↓

Report Error

---

# 29. Empty State Rendering

Every empty dataset should have a dedicated UI.

Examples

Empty Cart

Empty Wishlist

No Orders

No Notifications

Provide clear actions.

---

# 30. Re-render Optimization

Avoid

Anonymous objects

Anonymous arrays

Inline functions

Deep prop chains

Repeated calculations

Use stable references.

---

# 31. State Placement

Incorrect state placement causes unnecessary rendering.

Rule

Keep state as close as possible to where it is used.

Do not lift state without a reason.

---

# 32. Context Optimization

Split Context by responsibility.

Good

ThemeContext

AuthContext

LocaleContext

Bad

AppContext

Everything inside.

---

# 33. Query Rendering

TanStack Query should manage

Loading

Error

Success

Background Fetch

Cache

Do not duplicate loading states.

---

# 34. Rendering Performance Metrics

Monitor

FPS

Render Count

LCP

CLS

FCP

TTFB

INP

Bundle Size

JavaScript Execution Time

---

# 35. Rendering Debugging

Tools

React DevTools

Profiler

Chrome Performance

Lighthouse

Web Vitals

Always profile before optimizing.

---

# 36. AI Agent Rendering Rules

When generating components, AI MUST

- Prefer composition
- Render progressively
- Use Skeletons
- Lazy load heavy features
- Avoid unnecessary state
- Keep render functions pure
- Split large components
- Respect Suspense boundaries
- Optimize images
- Avoid layout shifts

---

# 37. Best Practices

✔ Keep components small

✔ Render progressively

✔ Prefer Skeleton over Spinner

✔ Lazy load heavy modules

✔ Memoize expensive calculations

✔ Virtualize large datasets

✔ Profile before optimization

✔ Keep state local

✔ Use React Compiler effectively

✔ Optimize images

---

# 38. Anti-Patterns

❌ Full page spinner

❌ Huge components

❌ Fetching inside render

❌ Rendering hidden components

❌ Rendering thousands of rows

❌ Memoizing everything

❌ Large global state

❌ Nested Suspense without planning

❌ Blocking synchronous work

❌ Layout shifts

---

# 39. Checklist

Before merging a page

✓ Initial render is fast

✓ Skeleton exists

✓ Lazy loading configured

✓ Heavy components split

✓ Images optimized

✓ Render boundaries defined

✓ No unnecessary re-renders

✓ Performance profiled

✓ Error UI implemented

✓ Empty state implemented

---

# 40. Future Evolution

The rendering strategy is prepared for

- React Server Components
- Partial Hydration
- Streaming SSR
- Edge Rendering
- Incremental Rendering
- AI-assisted UI generation
- Predictive Prefetching
- Module Federation
- Micro Frontends

No major architectural changes should be required.

---

# Summary

The Phone Store Frontend adopts a rendering strategy centered on:

- Progressive Rendering
- Route-Based Code Splitting
- Component Isolation
- React 19 Concurrent Features
- TanStack Query
- Lazy Loading
- Skeleton Loading
- Virtualization
- Performance Monitoring

The objective is to deliver a responsive, scalable, and maintainable user experience while remaining ready for future React capabilities.