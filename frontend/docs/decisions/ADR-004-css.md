# docs/decisions/ADR-004-css.md

Status: Accepted

Date: 2026-07-28

Decision Makers

- Frontend Architect
- UI Architect
- UX Designer
- Tech Lead

Related Documents

- docs/design-system/colors.md
- docs/design-system/typography.md
- docs/design-system/component-guidelines.md
- docs/design-system/dark-mode.md
- docs/design-system/responsive.md

---

# ADR-004

CSS Architecture & Design System Strategy

---

# 1. Context

The Phone Store Frontend is a long-term enterprise application.

The project contains

- Customer Website
- Admin Dashboard
- Checkout
- CMS
- Authentication
- Reports
- User Portal

Thousands of UI components will be developed.

A scalable styling strategy is required.

---

# 2. Problem

Without a CSS architecture the project will gradually suffer from

Duplicate styles

↓

Inconsistent spacing

↓

Different colors

↓

Poor Dark Mode

↓

Unmaintainable CSS

↓

Large bundle size

↓

UI inconsistency

---

# 3. Decision

The project officially adopts

Tailwind CSS v4

+

CSS Variables

+

Design Tokens

+

shadcn/ui

+

Radix UI

Components consume semantic tokens only.

---

# 4. Objectives

The styling system must provide

Consistency

↓

Maintainability

↓

Accessibility

↓

Theme Support

↓

Scalability

↓

Performance

↓

Developer Productivity

---

# 5. Alternatives Considered

CSS Modules

Pros

Component isolation

Cons

Large maintenance cost

No design language

---

SCSS

Pros

Flexible

Cons

High duplication

Naming complexity

Poor scalability

---

Styled Components

Pros

Dynamic styling

Cons

Runtime overhead

Large bundle

Harder optimization

---

Emotion

Pros

Flexible

Cons

Runtime CSS

Rejected.

---

Vanilla CSS

Rejected.

Reason

Not scalable enough.

---

# 6. Decision Rationale

Tailwind CSS v4 provides

Atomic utilities

↓

Excellent performance

↓

Predictable styling

↓

Smaller CSS

↓

Developer productivity

↓

Modern architecture

---

# 7. Design Tokens

Every visual value comes from

Color

Spacing

Typography

Radius

Shadow

Opacity

Border

Motion

Never hardcode values inside components.

---

# 8. CSS Variables

Semantic variables include

--background

--foreground

--surface

--primary

--secondary

--danger

--warning

--success

--border

Components consume variables instead of fixed colors.

---

# 9. Utility-first Strategy

Use Tailwind utilities as the default styling approach.

Benefits

Minimal CSS files

↓

Reusable patterns

↓

Fast development

↓

Predictable results

---

# 10. Component Library

Official libraries

shadcn/ui

Radix UI

Lucide React

Avoid introducing multiple overlapping UI libraries.

---

# 11. Component Styling

Components should

Consume tokens

Remain theme-aware

Avoid inline colors

Avoid duplicated utilities

Support variants

---

# 12. Variant System

Reusable components expose

variant

size

state

Examples

Primary

Secondary

Outline

Ghost

Danger

Success

Variants should never duplicate JSX.

---

# 13. Responsive Styling

Follow

Mobile First

Use official Tailwind breakpoints.

Avoid custom media queries unless justified.

---

# 14. Dark Mode

Dark Mode uses

CSS Variables

Theme Provider

Semantic Tokens

Components require zero code changes.

---

# 15. Layout

Preferred

CSS Grid

↓

Flexbox

Avoid float-based layouts.

Avoid absolute positioning for page layout.

---

# 16. Spacing

Spacing must use

Design Tokens

Tailwind spacing scale

Never use arbitrary spacing throughout the project without justification.

---

# 17. Typography

Typography uses

Official font scale

Line height

Font weight

Semantic headings

Avoid custom font sizes in individual components.

---

# 18. Icons

Official icon library

Lucide React

Avoid mixing Heroicons, Font Awesome, Material Icons and others without approval.

---

# 19. Animations

Animation follows

design-system/animation.md

Motion follows

design-system/motion.md

Never invent custom animation behavior for common interactions.

---

# 20. Accessibility

Styling must preserve

Focus visibility

Contrast

Touch targets

Keyboard usability

Accessibility takes precedence over aesthetics.

---

# 21. Performance

Goals

Minimal CSS output

Tree shaking

Low runtime overhead

Fast rendering

Avoid unused utilities.

---

# 22. Folder Structure

Recommended

styles/

theme/

tokens/

components/

layouts/

shared/

Feature-specific styles remain inside feature folders.

---

# 23. Naming

Semantic names only.

Good

bg-background

text-foreground

border-border

Bad

bg-gray-900

text-blue-700

border-red-500

inside business components.

---

# 24. Custom CSS

Allowed only when

Tailwind utilities are insufficient

Third-party integration requires it

Performance benefits are measurable

Keep custom CSS minimal.

---

# 25. Inline Styles

Avoid inline styles.

Allowed only for

Dynamic calculations

Canvas

Charts

Third-party libraries

---

# 26. Third-party Components

Wrap third-party components.

Do not scatter vendor-specific styling across the application.

---

# 27. CSS Layers

Recommended order

Base

↓

Tokens

↓

Utilities

↓

Components

↓

Overrides

Overrides should be rare.

---

# 28. Browser Support

Support officially targeted browsers.

Use progressive enhancement.

Avoid browser-specific hacks.

---

# 29. AI Agent Rules

Generated UI MUST

Use Tailwind utilities

Use semantic tokens

Support dark mode

Support responsive design

Avoid inline CSS

Avoid duplicate styling

Reuse design-system rules

---

# 30. Best Practices

✔ Utility-first

✔ Design Tokens

✔ CSS Variables

✔ Theme-aware

✔ Mobile First

✔ Accessible

✔ Variant-based components

✔ Minimal custom CSS

---

# 31. Anti Patterns

❌ Hardcoded colors

❌ Magic spacing values

❌ Massive CSS files

❌ Duplicate utilities

❌ Inline styling

❌ Global overrides

❌ !important abuse

❌ Multiple UI libraries

---

# 32. Review Checklist

Before Merge

✓ Semantic tokens used

✓ Responsive verified

✓ Dark Mode verified

✓ Accessibility preserved

✓ No duplicate CSS

✓ Tailwind utilities preferred

✓ Custom CSS justified

✓ Component variants reviewed

---

# 33. Consequences

Positive

Unified visual language

Improved maintainability

Faster development

Smaller CSS bundles

Better accessibility

Scalable theming

Negative

Requires discipline

Developers must learn design tokens

---

# 34. Future Evolution

Prepared for

Tailwind CSS future releases

CSS Nesting

Container Queries

View Transitions

Design Token automation

Multi-brand themes

White-label products

---

# 35. Decision Summary

The Phone Store Frontend officially adopts Tailwind CSS v4, CSS Variables, Design Tokens, shadcn/ui, and Radix UI as the unified styling architecture.

All visual styles must be token-driven, responsive, accessible, theme-aware, and reusable. Custom CSS is the exception, not the default.