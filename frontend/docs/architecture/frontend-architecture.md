# Frontend Architecture

Version: 1.0

Author: AI Engineering Team

Status: Production

---

# 1. Purpose

This document defines the overall architecture of the Phone Store Frontend application.

The objective is to ensure:

- scalability
- maintainability
- testability
- high performance
- developer experience
- AI-agent compatibility
- consistent coding standards

Every feature implemented inside the project MUST follow this architecture.

---

# 2. Project Overview

The project is a modern enterprise e-commerce frontend built using:

- React 19
- TypeScript
- Vite
- TanStack Query
- React Router
- TailwindCSS v4
- shadcn/ui
- Radix UI
- Zod
- React Hook Form
- OpenAPI generated client

The frontend communicates with Spring Boot REST APIs.

Architecture Style:

Feature First + Layered Architecture

NOT MVC

NOT Redux Everything

NOT Component Folder Dump

---

# 3. High Level Architecture

                    Browser
                        │
                        │
                React Application
                        │
 ┌────────────────────────────────────────────┐
 │
 │
 ▼
Routing Layer
 │
 ▼
Layout Layer
 │
 ▼
Feature Layer
 │
 ▼
Component Layer
 │
 ▼
Business Logic Layer
 │
 ▼
TanStack Query
 │
 ▼
API Client
 │
 ▼
Spring Boot Backend
 │
 ▼
Database

---

# 4. Architecture Principles

The project follows these principles.

## 4.1 Separation of Concerns

Each module has one responsibility.

Example:

❌ ProductCard fetches API itself.

✅ ProductCard only renders UI.

Product API is handled inside hooks.

---

## 4.2 Composition over Inheritance

Always compose UI.

Bad

ProductPage

↓

inherits

↓

BasePage

Good

<ProductLayout>

<ProductGallery>

<ProductInformation>

<ProductReview>

<ProductRecommendation>

---

## 4.3 Smart vs Dumb Components

Smart Components

Responsible for

- API
- Query
- Mutation
- Business Logic

Dumb Components

Responsible for

- UI
- Display
- Styling

Example

Smart

ProductDetailPage

↓

fetch product

↓

pass props

↓

ProductDetail

ProductDetail

↓

display only

---

## 4.4 Feature Isolation

Every feature owns itself.

Example

features/

product/

cart/

order/

user/

wishlist/

auth/

Each feature contains

- api
- hooks
- components
- pages
- types
- validation
- constants

No cross-feature coupling.

---

## 4.5 Single Source of Truth

Never duplicate data.

Correct

Product cache

↓

shared

↓

every page

Wrong

Product page fetches

↓

Cart fetches again

↓

Wishlist fetches again

---

# 5. Folder Philosophy

The project is organized by feature rather than file type.

Bad

components/

pages/

hooks/

utils/

500 files mixed together.

Good

features/

product/

components/

hooks/

api/

types/

validation/

constants/

Everything stays together.

---

# 6. Rendering Flow

Browser

↓

Router

↓

Layout

↓

Page

↓

Feature

↓

API Query

↓

Loading

↓

Success

↓

UI

↓

Interaction

↓

Mutation

↓

Invalidate Query

↓

Refresh Cache

---

# 7. Data Flow

User Click

↓

UI Event

↓

Hook

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

# 8. State Architecture

The application has four state layers.

## Server State

Managed by

TanStack Query

Examples

Products

Orders

Categories

Coupons

Profile

Never duplicate into Context.

---

## Client State

Managed by

React

Examples

Modal

Drawer

Selected tab

Current step

Dark mode

---

## Form State

Managed by

React Hook Form

Validation handled by

Zod

---

## URL State

Managed by

React Router

Example

/products?page=2&brand=apple&sort=price

Never store these filters in React State.

---

# 9. API Layer

Frontend never calls fetch directly.

Instead

UI

↓

Hook

↓

API Service

↓

Generated OpenAPI Client

↓

Axios

↓

Backend

Benefits

- type safety
- reusable
- centralized error handling
- easier testing

---

# 10. Authentication Flow

Login

↓

Backend returns

Access Token

Refresh Token

↓

Store Access Token securely

↓

Attach Authorization Header

↓

API Request

↓

401?

↓

Refresh Token

↓

Retry Request

↓

Success

---

# 11. Error Handling Strategy

All errors follow one format.

UI Error

↓

Business Error

↓

Network Error

↓

Unexpected Error

Each type has its own handler.

Never display backend stacktrace.

---

# 12. Performance Strategy

Use

Lazy Loading

Route Splitting

Memoization

Virtualization

Image Optimization

Skeleton Loading

Prefetch

Code Splitting

Suspense

React Compiler

Avoid

Large rerenders

Huge Context

Nested Providers

Unnecessary Effects

---

# 13. Accessibility Strategy

All pages must satisfy WCAG AA.

Requirements

Keyboard Navigation

Screen Reader

Focus Trap

Color Contrast

ARIA Labels

Semantic HTML

Visible Focus

Reduced Motion

---

# 14. Security Principles

Never

Store JWT in localStorage without assessment.

Trust client validation.

Expose internal errors.

Execute HTML directly.

Always

Validate API response.

Escape user input.

Sanitize HTML.

Use HTTPS.

Protect routes.

---

# 15. Testing Pyramid

                E2E

           Integration

          Component Test

            Unit Test

Recommended

Vitest

Testing Library

Playwright

MSW

---

# 16. Logging

Development

Console

Production

Structured Logger

Never log

password

token

credit card

refresh token

---

# 17. Monitoring

Monitor

API latency

CLS

LCP

FID

JS Errors

Memory Leak

Render Count

Network Failure

---

# 18. Scalability Strategy

The architecture should support

10 developers

50 developers

100 developers

without folder restructuring.

New feature

↓

Create Feature Folder

↓

Independent Development

↓

Merge

No global conflicts.

---

# 19. AI Agent Guidelines

Every AI-generated code must

Follow folder structure.

Reuse components.

Follow design system.

Use generated API.

Create tests.

Avoid duplicated code.

Avoid inline styles.

Avoid business logic inside UI.

Use TypeScript strict mode.

Follow accessibility rules.

---

# 20. Architecture Decision Summary

✅ Feature-first architecture

✅ React 19

✅ TypeScript Strict

✅ TanStack Query

✅ React Hook Form

✅ Zod

✅ TailwindCSS v4

✅ shadcn/ui

✅ Radix UI

✅ OpenAPI Client

✅ Enterprise scalable folder structure

---

# 21. Future Extensions

The architecture is prepared for

- Micro Frontend
- Module Federation
- PWA
- SSR
- React Server Components
- AI-assisted development
- Storybook
- Design Token Automation
- Internationalization
- White-label products

No major restructuring should be required.
