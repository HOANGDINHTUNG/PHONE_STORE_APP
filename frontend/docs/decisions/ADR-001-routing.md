# docs/decisions/ADR-001-routing.md

Status: Accepted

Date: 2026-07-28

Decision Makers

- Frontend Architect
- Backend Architect
- Tech Lead
- Product Owner

Related Documents

- docs/architecture/routing-architecture.md
- docs/architecture/frontend-architecture.md
- docs/design-system/responsive.md
- docs/design-system/accessibility.md
- docs/api/openapi.yaml

---

# ADR-001

Project Routing Architecture

---

# 1. Context

The Phone Store Frontend is expected to evolve into a large-scale enterprise application.

The project contains multiple business domains including

- Authentication
- Product Catalog
- Shopping Cart
- Checkout
- Payment
- User Profile
- Wishlist
- Order History
- Administration
- CMS

The routing solution must remain maintainable as the application grows.

---

# 2. Problem

Without a routing standard, different developers may

Create inconsistent URLs

↓

Duplicate layouts

↓

Implement authentication differently

↓

Handle errors inconsistently

↓

Break navigation flow

↓

Increase maintenance cost

A unified routing strategy is required.

---

# 3. Decision

The project officially adopts

React Router v7

combined with

Feature-Based Architecture

Layout Routes

Code Splitting

Lazy Loading

Protected Routes

Role-based Authorization

This decision applies to every future feature.

---

# 4. Why React Router

React Router provides

Excellent ecosystem

Official React support

Nested routing

Data APIs

Lazy loading

Error boundaries

TypeScript support

Long-term stability

Large community

---

# 5. Alternatives Considered

Alternative 1

TanStack Router

Pros

Excellent Type Safety

Modern API

Search Params

Cons

Smaller ecosystem

Lower hiring familiarity

Alternative 2

File-based Router

Pros

Easy to start

Cons

Less flexible

Harder enterprise customization

Alternative 3

Custom Router

Rejected immediately.

Reason

Maintenance cost.

---

# 6. Decision Rationale

React Router provides the best balance between

Learning Curve

↓

Community

↓

Flexibility

↓

Scalability

↓

Hiring Availability

↓

Enterprise Adoption

---

# 7. URL Design Principles

URLs must be

Readable

Stable

Predictable

REST-like

Lowercase

Hyphen-separated

Good

/products

/orders

/my-account

/admin/users

Bad

/ProductList

/Product123

/getProducts

/list_product

---

# 8. Route Naming Convention

Plural nouns

/products

/orders

/categories

Singular

Only

Static pages

/login

/register

/about

/contact

---

# 9. Nested Routes

Nested routes are mandatory.

Example

Dashboard

↓

Orders

↓

Order Detail

↓

Invoice

Nested layouts reduce duplication.

---

# 10. Layout Routes

Every major module owns its layout.

Public Layout

Authentication Layout

Customer Layout

Admin Layout

Checkout Layout

Shared layouts must never contain business logic.

---

# 11. Public Routes

Accessible without authentication.

Examples

/

Products

Categories

Search

About

Contact

FAQ

Privacy Policy

Terms

---

# 12. Guest Routes

Guest routes are intended only for unauthenticated users.

Examples

Login

Register

Forgot Password

Reset Password

Authenticated users should be redirected appropriately.

---

# 13. Protected Routes

Require authentication.

Examples

Profile

Orders

Wishlist

Checkout

Address Book

Notifications

---

# 14. Admin Routes

Require

Authentication

+

Admin Role

Examples

Dashboard

Inventory

Orders

Coupons

Reports

User Management

---

# 15. Permission-based Routes

Avoid hardcoding permissions inside components.

Permission validation belongs in

Authorization Layer

↓

Route Guard

↓

Permission Hook

---

# 16. Route Guards

Official Guards

AuthGuard

GuestGuard

RoleGuard

PermissionGuard

MaintenanceGuard

Every guard should have one responsibility.

---

# 17. Route Metadata

Each route defines metadata.

Title

Description

Requires Auth

Layout

Breadcrumb

Permissions

Feature Flag

SEO Metadata

---

# 18. Dynamic Routes

Allowed

/products/:slug

/orders/:orderId

/users/:userId

Avoid ambiguous parameters.

---

# 19. Query Parameters

Use query parameters only for

Filtering

Sorting

Searching

Pagination

Good

/products?page=2

/products?brand=apple

/products?sort=price

Avoid placing resource identity inside query parameters.

---

# 20. Route Parameters

Use route parameters for

Identity

Examples

/orders/123

/products/iphone-17

/users/99

Identity belongs in the path.

---

# 21. Error Routes

Every route tree must support

404

403

401

500

Offline

Timeout

Error pages should be reusable.

---

# 22. Lazy Loading

Every feature module must be lazy loaded.

Examples

Admin

Checkout

Reports

Analytics

Settings

Do not lazy load tiny shared components.

---

# 23. Code Splitting

Split bundles by

Feature

Not by individual component.

Target

Small initial bundle

Fast first paint

---

# 24. Scroll Restoration

Navigation should restore scroll intelligently.

Product List

↓

Product Detail

↓

Back

Return to previous scroll position whenever practical.

---

# 25. Breadcrumb Strategy

Breadcrumbs should be generated from route metadata.

Avoid manually maintaining breadcrumbs in pages.

---

# 26. SEO

Every public route defines

Title

Description

Canonical URL

Open Graph

Structured Data

Private routes do not require SEO metadata.

---

# 27. Analytics

Route changes should trigger

Page View

Performance Metrics

Feature Usage

Business Events

Analytics logic should remain outside page components.

---

# 28. Accessibility

Navigation must

Move keyboard focus to main content

Announce page title changes

Support screen readers

Maintain logical tab order

---

# 29. Performance

Use

Lazy Routes

Prefetch

Suspense

Error Boundaries

Avoid loading the entire application at startup.

---

# 30. Security

Never trust route visibility.

Backend authorization remains mandatory.

Frontend guards improve UX but do not replace server-side authorization.

---

# 31. Folder Structure

Recommended

routes/

features/

layouts/

guards/

navigation/

breadcrumbs/

Do not place all routes inside one file.

---

# 32. AI Agent Rules

Generated routes MUST

Use React Router

Reuse layouts

Follow URL conventions

Support lazy loading

Register metadata

Support authentication

Avoid duplicate routes

Respect feature boundaries

---

# 33. Best Practices

✔ Mobile-friendly URLs

✔ Lazy modules

✔ Route metadata

✔ Layout reuse

✔ Breadcrumb generation

✔ Protected routes

✔ Clear naming

✔ Feature isolation

---

# 34. Anti Patterns

❌ Giant routing file

❌ Business logic in layouts

❌ Authentication inside page components

❌ Random URL naming

❌ Duplicate routes

❌ Nested layouts deeper than necessary

❌ Hardcoded redirects

---

# 35. Migration Strategy

Future routing changes should

Preserve URLs whenever possible

Provide redirects

Maintain bookmarks

Avoid breaking external links

---

# 36. Architecture Impact

Benefits

Consistent navigation

Lower maintenance

Reusable layouts

Better scalability

Improved onboarding

Predictable feature development

---

# 37. Risks

Potential Risks

Large route tree

Permission complexity

Nested layouts becoming deep

Mitigation

Feature isolation

Route metadata

Architecture reviews

---

# 38. Review Checklist

Before Merge

✓ URL follows naming rules

✓ Correct layout selected

✓ Lazy loading applied

✓ Metadata configured

✓ Authorization verified

✓ Accessibility checked

✓ Error boundary available

✓ Breadcrumb supported

---

# 39. Consequences

Positive

Consistent architecture

Predictable navigation

Reusable layouts

Enterprise scalability

Negative

Slightly more initial setup

Requires discipline during development

---

# 40. Decision Summary

The Phone Store Frontend officially adopts React Router v7 with a feature-based routing architecture.

All routing must use reusable layouts, route metadata, lazy loading, standardized guards, and enterprise URL conventions. This decision provides a scalable, maintainable, and accessible foundation for future development while ensuring consistency across the entire application.