# docs/decisions/ADR-005-testing.md

Status: Accepted

Date: 2026-07-28

Decision Makers

- Frontend Architect
- QA Lead
- Tech Lead

Related Documents

- docs/architecture/frontend-architecture.md
- docs/api/openapi.yaml
- ADR-001-routing.md
- ADR-002-query.md
- ADR-003-auth.md

---

# ADR-005

Frontend Testing Strategy

---

# 1. Context

The Phone Store Frontend is a large-scale enterprise application.

The project includes

- Authentication
- Shopping Cart
- Checkout
- Payment
- User Dashboard
- Admin Dashboard
- Reports
- Product Catalog

Every critical business feature must be testable.

Testing is part of development, not a separate phase.

---

# 2. Problem

Without a testing strategy

Bugs increase

↓

Regression becomes common

↓

Refactoring becomes risky

↓

Developers lose confidence

↓

Release quality decreases

A unified testing architecture is required.

---

# 3. Decision

The project officially adopts

Vitest

+

React Testing Library

+

Playwright

+

MSW

+

ESLint

+

GitHub Actions

This stack covers every testing level.

---

# 4. Testing Philosophy

Test behavior

Not implementation.

Tests should describe

What users observe

Not

How components work internally.

---

# 5. Testing Pyramid

Preferred ratio

Unit Tests

↓

Component Tests

↓

Integration Tests

↓

End-to-End Tests

Avoid relying exclusively on E2E tests.

---

# 6. Unit Testing

Tool

Vitest

Used for

Utilities

Helpers

Hooks

Business Logic

Validation

Formatting

Pure Functions

---

# 7. Component Testing

Tool

React Testing Library

Verify

Rendering

Interaction

Accessibility

States

Props

Focus on user-visible behavior.

---

# 8. Integration Testing

Verify collaboration between

Components

Hooks

Queries

Forms

Context

Routing

Avoid mocking everything.

---

# 9. End-to-End Testing

Tool

Playwright

Cover

Authentication

Checkout

Payment

Wishlist

Orders

Admin

Only critical user journeys require E2E tests.

---

# 10. API Mocking

Tool

Mock Service Worker (MSW)

Purpose

Stable tests

↓

Offline execution

↓

Backend independence

Avoid mocking fetch manually.

---

# 11. Coverage Goals

Minimum

Lines

80%

Branches

80%

Functions

80%

Statements

80%

Critical business modules should exceed these targets.

---

# 12. Naming Convention

Good

ProductCard.test.tsx

Cart.test.ts

Login.spec.ts

Bad

test.ts

new-test.ts

temp.spec.ts

---

# 13. Folder Structure

Recommended

tests/

unit/

integration/

e2e/

fixtures/

mocks/

setup/

Organize tests by feature when practical.

---

# 14. Test Data

Use deterministic fixtures.

Avoid random values unless intentionally testing randomness.

Test data should be reusable.

---

# 15. Mocking

Mock

External APIs

Time

Browser APIs

Third-party services

Do not mock your own business logic unnecessarily.

---

# 16. Accessibility Testing

Verify

Keyboard navigation

ARIA

Focus management

Labels

Color contrast (where tooling supports it)

Accessibility is part of testing.

---

# 17. Visual Regression

Critical UI should support

Screenshot comparison

Layout verification

Theme verification

Prevent unintended visual changes.

---

# 18. Performance Testing

Verify

Render performance

Bundle impact

Large lists

Expensive components

Avoid unnecessary rendering.

---

# 19. Security Testing

Test

Authorization

Route guards

Permission handling

Sensitive data exposure

Authentication failures

Security is testable.

---

# 20. Error Scenarios

Every feature should test

Loading

Empty

Error

Retry

Offline

Timeout

Cancellation

Success

---

# 21. Forms

Verify

Validation

Submission

Error messages

Reset

Accessibility

Focus movement

---

# 22. Routing

Verify

Navigation

Protected routes

404

Redirects

Breadcrumbs

Deep links

---

# 23. Authentication

Verify

Login

Logout

Refresh token

Expired session

Unauthorized access

Permission changes

---

# 24. TanStack Query

Verify

Caching

Invalidation

Retries

Optimistic updates

Loading states

Error recovery

---

# 25. Dark Mode

Verify

Light Theme

Dark Theme

Theme switching

Contrast

Focus visibility

---

# 26. Responsive Testing

Verify

Mobile

Tablet

Desktop

Large screens

Landscape mode

---

# 27. Snapshot Testing

Allowed only

For stable presentational components.

Avoid snapshot testing for highly dynamic interfaces.

---

# 28. Continuous Integration

Every Pull Request must execute

Lint

↓

Type Check

↓

Unit Tests

↓

Integration Tests

↓

Build

↓

Coverage

↓

E2E (where configured)

No direct merge without passing checks.

---

# 29. Flaky Tests

Flaky tests are treated as defects.

Fix

or

Remove

Never ignore unstable tests.

---

# 30. Test Speed

Unit tests should complete quickly.

Avoid slow network-dependent tests.

Keep feedback fast for developers.

---

# 31. AI Agent Rules

Generated code MUST

Include tests

Cover edge cases

Mock external services correctly

Verify accessibility

Follow naming conventions

Avoid implementation-based assertions

---

# 32. Best Practices

✔ Test behavior

✔ Small focused tests

✔ Reusable fixtures

✔ MSW for API mocking

✔ High coverage

✔ Accessible components

✔ Stable assertions

✔ Fast execution

---

# 33. Anti Patterns

❌ Testing implementation details

❌ Massive E2E suites

❌ Random test data

❌ Network-dependent tests

❌ Snapshot abuse

❌ Sleeping with arbitrary timeouts

❌ Ignoring flaky tests

❌ Low coverage on critical code

---

# 34. Review Checklist

Before Merge

✓ Unit tests added

✓ Component tests added

✓ Integration verified

✓ Critical E2E updated

✓ Coverage maintained

✓ Accessibility checked

✓ Responsive verified

✓ Mocks reviewed

✓ CI passing

---

# 35. Consequences

Positive

Higher confidence

Safer refactoring

Reduced regressions

Improved maintainability

Better release quality

Negative

Additional development effort

Requires discipline to maintain tests

---

# 36. Future Evolution

Prepared for

Visual Regression Automation

Mutation Testing

Contract Testing

Performance Budgets

Cross-browser Automation

AI-assisted Test Generation

---

# 37. Decision Summary

The Phone Store Frontend officially adopts a comprehensive testing strategy based on Vitest, React Testing Library, Playwright, and MSW.

Testing is mandatory for business-critical features and follows the Testing Pyramid. Every feature must validate behavior, accessibility, performance, and error handling while maintaining high confidence through automated CI pipelines.