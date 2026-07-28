# docs/architecture/routing-architecture.md

Version: 1.0

Status: Production Ready

Audience

- Frontend Developers
- Team Leaders
- Software Architects
- AI Agents

---

# 1. Purpose

This document defines the official routing architecture of the Phone Store Frontend.

The objectives are:

- Predictable navigation
- Secure route protection
- Better scalability
- Code splitting
- Lazy loading
- SEO-friendly URLs
- Easy maintenance
- AI-friendly routing conventions

Every page and feature MUST follow this routing architecture.

---

# 2. Routing Philosophy

The application follows:

Feature Driven Routing

NOT

Folder Driven Routing

NOT

File System Routing

NOT

Single Huge Routes.tsx

Each feature owns its routes.

Example

Product Feature

↓

Product Routes

↓

Product Pages

↓

Product Components

Instead of placing every route into one 3000-line file.

---

# 3. High Level Routing Architecture

Browser

↓

React Router

↓

Route Matching

↓

Layout Selection

↓

Authentication Check

↓

Permission Check

↓

Feature Route

↓

Lazy Load Page

↓

Fetch Data

↓

Render UI

---

# 4. Routing Layers

Layer 1

Browser URL

↓

Layer 2

React Router

↓

Layer 3

Layout

↓

Layer 4

Authentication

↓

Layer 5

Authorization

↓

Layer 6

Feature

↓

Layer 7

Page

↓

Layer 8

Components

---

# 5. Route Categories

The project contains four route groups.

## Public Routes

Accessible by everyone.

Examples

/

/products

/categories

/search

/about

/contact

---

## Guest Routes

Only for unauthenticated users.

Examples

/login

/register

/forgot-password

/reset-password

Authenticated users should be redirected away.

---

## Protected Routes

Require authentication.

Examples

/profile

/orders

/cart

/checkout

/address

/payment

---

## Admin Routes

Require authentication and ADMIN role.

Examples

/management

/dashboard

/products

/orders

/users

/categories

/reports

---

# 6. URL Convention

URLs should be:

Readable

Predictable

REST-like

Lowercase

Hyphen-separated

Good

/products

/products/iphone-16-pro

/categories/apple

/orders

/orders/12345

Bad

/ProductPage

/product_page

/getProduct

/load-product

---

# 7. Dynamic Routes

Dynamic parameters should represent resources.

Correct

/products/:slug

/orders/:orderId

/category/:categorySlug

/users/:userId

Wrong

/products?id=12

unless filtering is required.

---

# 8. Query Parameters

Query parameters are used for UI state.

Examples

/products?page=2

/products?sort=price

/products?brand=apple

/products?storage=512

/products?search=iphone

Never use query parameters to identify resources.

---

# 9. Nested Routing

Example

/

↓

Product Layout

↓

Product Detail

↓

Review

↓

Specifications

↓

Related Products

Example

/products/:slug

/specifications

/reviews

/accessories

---

# 10. Layout Routing

Every page belongs to one layout.

PublicLayout

Home

Search

Product

Category

AuthLayout

Login

Register

Forgot Password

CustomerLayout

Orders

Wishlist

Checkout

AdminLayout

Dashboard

Products

Users

Reports

---

# 11. Route Protection Flow

User Request

↓

Check Token

↓

Valid?

↓

No

↓

Redirect Login

↓

Yes

↓

Check Permission

↓

Allowed?

↓

No

↓

403 Page

↓

Yes

↓

Render Page

---

# 12. Authentication Guard

Authentication Guard only verifies

Token

Expiration

Refresh

Session

It NEVER checks business permissions.

---

# 13. Authorization Guard

Authorization verifies

Role

Permission

Feature Access

Resource Ownership

Example

Customer

cannot access

/admin/users

---

# 14. Lazy Loading

Every feature page should be lazy loaded.

Example

Dashboard

Checkout

Wishlist

Orders

Admin

Large pages

Do NOT lazy load

Login

404

Landing Page

Shared Layout

---

# 15. Code Splitting

Split by

Route

Feature

Heavy Components

Charts

Editor

Maps

Large Tables

Benefits

Smaller bundle

Faster loading

Better caching

---

# 16. Breadcrumb Strategy

Every page should generate breadcrumb automatically.

Example

Home

>

Products

>

Apple

>

iPhone 16 Pro

Breadcrumb should use route metadata.

Never hardcode.

---

# 17. Route Metadata

Every route contains metadata.

Example

title

icon

permission

layout

breadcrumb

seo

analytics

feature flag

This metadata should not live inside pages.

---

# 18. Scroll Restoration

When navigating

New Page

↓

Scroll Top

When returning

↓

Restore Previous Position

Infinite scroll pages should preserve scroll state.

---

# 19. Navigation Rules

Internal Navigation

React Router

External Navigation

window.open()

Never use <a> for internal routes.

---

# 20. Error Routes

Handle

404

403

500

Maintenance

Offline

Each page has its own layout.

---

# 21. Loading Strategy

During lazy loading

Display

Skeleton

Spinner

Progress Bar

Never blank screen.

---

# 22. Route-Based Data Fetching

Navigation

↓

Load Route

↓

Load Query

↓

Cache Check

↓

Background Fetch

↓

Render

Avoid waterfall requests.

---

# 23. Prefetch Strategy

Hover Product

↓

Prefetch Product Detail

Hover Category

↓

Prefetch Category

Hover Checkout

↓

Prefetch Cart

Benefits

Instant navigation.

---

# 24. SEO Friendly URLs

Good

/products/iphone-16-pro-max

Bad

/products/123

Use slug whenever possible.

---

# 25. Internationalization

Prepare routes for future.

Example

/en/products

/vi/products

/fr/products

Route generation should support locale prefix.

---

# 26. Feature Folder Example

features/

product/

pages/

ProductListPage.tsx

ProductDetailPage.tsx

routes.ts

hooks/

api/

components/

Each feature exports its own routes.

---

# 27. AI Agent Rules

When AI creates a new page it MUST

Create route

Assign layout

Apply lazy loading

Add metadata

Protect route if needed

Register breadcrumb

Generate page title

Follow URL convention

---

# 28. Best Practices

✔ Small route modules

✔ Route metadata

✔ Lazy loading

✔ Nested layouts

✔ Permission guards

✔ SEO-friendly URLs

✔ Automatic breadcrumbs

✔ Feature-based routing

✔ Scroll restoration

✔ Code splitting

---

# 29. Anti Patterns

❌ Giant Routes.tsx

❌ Hardcoded URLs

❌ Inline permissions

❌ Duplicate routes

❌ Relative path confusion

❌ Business logic inside routing

❌ Components deciding permissions

❌ No lazy loading

❌ Blank loading screen

❌ Random navigation helpers

---

# 30. Checklist

Before creating a new page

✓ URL follows convention

✓ Feature owns route

✓ Lazy loaded

✓ Metadata added

✓ Breadcrumb generated

✓ Permission configured

✓ Error boundary exists

✓ Skeleton loading exists

✓ SEO title defined

✓ Analytics registered

---

# 31. Future Roadmap

The routing architecture is prepared for

- React Server Components
- Module Federation
- Micro Frontend
- Multi-tenant
- White Label Products
- PWA
- AI Generated Routes
- Dynamic Feature Flags
- SSR
- Edge Rendering

No major restructuring should be required.

---

# 32. Summary

The routing architecture follows enterprise best practices by separating:

- URL
- Layout
- Authentication
- Authorization
- Feature
- Page
- Component

This keeps navigation predictable, scalable, secure, and AI-friendly.