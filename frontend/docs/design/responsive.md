# docs/design-system/responsive.md

Version: 1.0

Status: Production Ready

Audience

- Frontend Developers
- UI Designers
- UX Designers
- QA Engineers
- AI Agents

---

# 1. Purpose

This document defines the responsive design standards used throughout the Phone Store Frontend.

Responsive design ensures the application delivers an optimal experience across

- Mobile Phones
- Tablets
- Laptops
- Desktop Monitors
- Ultra-wide Displays
- Foldable Devices

The interface should adapt naturally without requiring separate implementations.

---

# 2. Responsive Philosophy

Responsive Design should be

Accessible

↓

Flexible

↓

Adaptive

↓

Predictable

↓

Maintainable

The same codebase should serve all supported devices.

---

# 3. Mobile First

The project follows

Mobile First

Workflow

Mobile

↓

Tablet

↓

Laptop

↓

Desktop

↓

Large Desktop

Every component should be designed for the smallest screen first.

---

# 4. Official Breakpoints

Extra Small

0px

Small

640px

Medium

768px

Large

1024px

Extra Large

1280px

2XL

1536px

Never invent custom breakpoints unless approved.

---

# 5. Tailwind Mapping

xs

Default

sm

640px

md

768px

lg

1024px

xl

1280px

2xl

1536px

Use Tailwind breakpoint utilities whenever possible.

---

# 6. Layout Width

Content Container

Maximum

1280px

Large Marketing Pages

1440px

Dashboard

Fluid

Avoid excessively wide reading areas.

---

# 7. Content Width

Readable content should remain

60–80 characters per line

Avoid full-width paragraphs on large monitors.

---

# 8. Grid System

Desktop

12 Columns

Tablet

8 Columns

Mobile

4 Columns

Spacing follows Design System tokens.

---

# 9. Responsive Spacing

Spacing decreases gradually.

Desktop

32px

Tablet

24px

Mobile

16px

Never remove spacing entirely.

---

# 10. Typography Scaling

Heading sizes scale progressively.

Body text

Minimum

16px

Large headings should shrink on smaller devices.

Never reduce readability.

---

# 11. Responsive Images

Images should

Resize automatically

Maintain aspect ratio

Lazy load

Support multiple resolutions

Avoid oversized downloads.

---

# 12. Image Formats

Preferred

AVIF

↓

WebP

↓

JPEG

Use responsive srcset where appropriate.

---

# 13. Responsive Components

Every component should define behavior for

Desktop

Tablet

Mobile

Do not rely on browser scaling.

---

# 14. Navigation

Desktop

Horizontal Navigation

Tablet

Collapsed Navigation

Mobile

Hamburger Menu

Navigation should remain intuitive.

---

# 15. Sidebar

Desktop

Persistent

Tablet

Collapsible

Mobile

Drawer

Avoid permanently visible sidebars on phones.

---

# 16. Tables

Desktop

Full Table

Tablet

Horizontal Scroll

Mobile

Cards

Never force users to zoom.

---

# 17. Forms

Desktop

Multiple Columns

Tablet

Two Columns

Mobile

Single Column

Forms should remain easy to complete.

---

# 18. Product Grid

Desktop

4–5 Products

Tablet

2–3 Products

Mobile

1–2 Products

Maintain consistent spacing.

---

# 19. Product Detail

Desktop

Gallery + Information

Tablet

Stacked Columns

Mobile

Single Column

The purchase flow must remain clear.

---

# 20. Checkout

Desktop

Two Columns

Tablet

Stacked

Mobile

Single Column

Users should never lose progress.

---

# 21. Dashboard

Desktop

Multiple Widgets

Tablet

Reduced Columns

Mobile

Vertical Layout

Charts should remain readable.

---

# 22. Dialogs

Desktop

Centered Modal

Tablet

Medium Modal

Mobile

Full-screen Dialog

Avoid tiny dialogs on mobile devices.

---

# 23. Touch Targets

Minimum

44 × 44px

Buttons

Links

Icons

Checkboxes

Radio Buttons

Touch interaction is mandatory.

---

# 24. Gestures

Support

Tap

Swipe

Long Press (where appropriate)

Never rely exclusively on gestures.

Every action should have a visible alternative.

---

# 25. Orientation

Support

Portrait

Landscape

Foldable

The layout should adapt automatically.

---

# 26. Container Queries

Use Container Queries

when component size depends on its parent instead of viewport size.

Preferred for

Cards

Widgets

Reusable Components

Avoid viewport-only logic.

---

# 27. Fluid Layout

Prefer

Flexbox

CSS Grid

Gap

Avoid fixed pixel positioning.

Layouts should stretch naturally.

---

# 28. Overflow

Prevent

Horizontal Scroll

Unexpected Clipping

Overflowing Text

Use wrapping where appropriate.

---

# 29. Performance

Load

Smaller Images

↓

Lazy Components

↓

Deferred Data

↓

Code Splitting

Responsive performance matters as much as layout.

---

# 30. Accessibility

Zoom

200%

Landscape Support

Keyboard Navigation

Screen Readers

Touch Targets

Responsive layouts must remain fully accessible.

---

# 31. AI Agent Rules

Generated layouts MUST

Be mobile first

Support all breakpoints

Use Tailwind utilities

Respect spacing tokens

Avoid fixed widths

Support touch interaction

Prevent overflow

Use responsive images

---

# 32. Best Practices

✔ Mobile First

✔ Fluid Layouts

✔ Responsive Typography

✔ Responsive Images

✔ Adaptive Components

✔ Accessible Touch Targets

✔ Container Queries

✔ Performance Optimized

---

# 33. Anti Patterns

❌ Fixed Width Layouts

❌ Pixel-perfect Positioning

❌ Horizontal Scroll

❌ Tiny Buttons

❌ Desktop-only Navigation

❌ Large Tables on Mobile

❌ Unoptimized Images

❌ Ignoring Landscape Mode

---

# 34. Review Checklist

Before Release

✓ Mobile verified

✓ Tablet verified

✓ Desktop verified

✓ Large monitor verified

✓ No horizontal scrolling

✓ Responsive images working

✓ Forms usable

✓ Navigation adaptive

✓ Touch targets verified

✓ Lighthouse Mobile acceptable

---

# 35. Future Evolution

Prepared for

Container Query Level 2

Viewport Units (dvh, svh, lvh)

Foldable Devices

Dynamic Island Layouts

Adaptive Navigation

Responsive Design Tokens

AI-generated Adaptive Layouts

---

# Summary

The Phone Store Frontend responsive system follows a mobile-first strategy with standardized breakpoints, adaptive layouts, responsive components, and accessibility-first principles.

Every page and component should provide a consistent, performant, and intuitive experience across all supported devices without requiring separate implementations.