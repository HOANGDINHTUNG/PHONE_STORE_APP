# docs/design-system/border-radius.md

Version: 1.0

Status: Production Ready

Audience

- UI Designers
- Frontend Developers
- UX Engineers
- Design System Engineers
- AI Agents

---

# 1. Purpose

This document defines the official border radius system used throughout the Phone Store Frontend.

Border radius improves

- Visual consistency
- Component recognition
- Accessibility
- Modern appearance
- Reusability
- Scalability

Every component must use predefined radius tokens.

Never hardcode border radius values.

---

# 2. Design Philosophy

Border radius communicates

Friendliness

↓

Modern Design

↓

Hierarchy

↓

Touch Comfort

↓

Consistency

Different components should not invent different corner styles.

---

# 3. Radius Principles

A radius should be

Consistent

↓

Predictable

↓

Reusable

↓

Responsive

↓

Accessible

Corner radius is part of the design language.

---

# 4. Radius Scale

Official Radius Tokens

radius-none

0px

radius-xs

2px

radius-sm

4px

radius-md

6px

radius-lg

8px

radius-xl

12px

radius-2xl

16px

radius-3xl

24px

radius-full

9999px

Never introduce custom values.

---

# 5. Component Hierarchy

Small Controls

↓

Inputs

↓

Buttons

↓

Cards

↓

Dialogs

↓

Sheets

↓

Full Screen Layouts

Larger surfaces generally use larger radii.

---

# 6. Buttons

Primary Button

radius-lg

Secondary Button

radius-lg

Ghost Button

radius-lg

Icon Button

radius-full

Floating Button

radius-full

Buttons across the application must remain identical.

---

# 7. Inputs

Text Input

radius-lg

Textarea

radius-lg

Select

radius-lg

Search Bar

radius-xl

OTP Input

radius-md

---

# 8. Cards

Product Card

radius-xl

Information Card

radius-xl

Dashboard Card

radius-xl

Statistic Card

radius-lg

Cards should appear soft but not overly rounded.

---

# 9. Images

Product Image

radius-lg

Avatar

radius-full

Gallery Thumbnail

radius-md

Banner

radius-xl

---

# 10. Dialogs

Modal

radius-2xl

Alert Dialog

radius-xl

Confirmation Dialog

radius-xl

Drawer

radius-2xl

Large overlays require softer corners.

---

# 11. Navigation

Navbar

radius-none

Sidebar

radius-none

Dropdown

radius-lg

Context Menu

radius-lg

Popover

radius-xl

---

# 12. Tables

Container

radius-xl

Header

radius-none

Rows

radius-none

Empty State Card

radius-xl

Avoid rounded table rows.

---

# 13. Badges

Status Badge

radius-full

Discount Badge

radius-full

Label Badge

radius-full

Notification Count

radius-full

Badges should always appear pill-shaped.

---

# 14. Chips

Suggestion Chip

radius-full

Filter Chip

radius-full

Category Chip

radius-full

Tag Chip

radius-full

---

# 15. Checkboxes

Checkbox

radius-sm

Switch

radius-full

Radio Button

radius-full

Maintain familiar interaction patterns.

---

# 16. Product Components

Product Card

radius-xl

Price Badge

radius-full

Promotion Banner

radius-lg

Wishlist Button

radius-full

Color Selector

radius-full

---

# 17. Mobile Design

Touch-friendly controls require

radius-lg

or

radius-xl

Avoid tiny sharp corners.

---

# 18. Responsive Rules

Desktop

↓

Tablet

↓

Mobile

Radius generally remains unchanged.

Do not increase radius excessively on small screens.

---

# 19. Accessibility

Border radius must never reduce

Clickable Area

Focus Visibility

Component Recognition

Rounded corners should not hide focus outlines.

---

# 20. Dark Mode

Corner radius remains identical.

Only colors and shadows change.

The geometry of components should stay consistent.

---

# 21. Design Tokens

Preferred Tokens

radius-none

radius-xs

radius-sm

radius-md

radius-lg

radius-xl

radius-2xl

radius-3xl

radius-full

Never use raw pixel values in components.

---

# 22. Tailwind Mapping

radius-none

↓

rounded-none

radius-sm

↓

rounded-sm

radius-md

↓

rounded-md

radius-lg

↓

rounded-lg

radius-xl

↓

rounded-xl

radius-2xl

↓

rounded-2xl

radius-full

↓

rounded-full

Tailwind configuration should expose the same token names.

---

# 23. CSS Variables

Recommended Variables

--radius-xs

--radius-sm

--radius-md

--radius-lg

--radius-xl

--radius-2xl

--radius-full

Business components should consume CSS variables through design tokens.

---

# 24. Component Mapping

Button

↓

radius-lg

Input

↓

radius-lg

Card

↓

radius-xl

Modal

↓

radius-2xl

Avatar

↓

radius-full

Badge

↓

radius-full

Dropdown

↓

radius-lg

---

# 25. Interaction States

Hover

No radius change

Focus

No radius change

Pressed

No radius change

Disabled

No radius change

State changes should rely on color and shadow, not geometry.

---

# 26. AI Agent Rules

AI-generated components MUST

Use radius tokens

Reuse existing geometry

Avoid inline border-radius

Support dark mode

Respect component hierarchy

Never invent custom radii

---

# 27. Best Practices

✔ Reuse tokens

✔ Consistent geometry

✔ Large surfaces use larger radii

✔ Small controls use smaller radii

✔ Pill shape only where appropriate

✔ CSS variables everywhere

✔ Tailwind token mapping

---

# 28. Anti Patterns

❌ Random radius values

❌ Mixing sharp and rounded styles

❌ Fully rounded cards

❌ Sharp buttons

❌ Decorative corner styles

❌ Inline border-radius

❌ Different radius for identical components

---

# 29. Review Checklist

Before Release

✓ Radius tokens used

✓ Tailwind classes follow tokens

✓ Components visually consistent

✓ Dialogs correctly rounded

✓ Cards consistent

✓ Buttons identical

✓ Inputs identical

✓ No hardcoded values

---

# 30. Future Evolution

Prepared for

Adaptive Radius

Brand Themes

Glassmorphism

Material Design 3

Dynamic Design Tokens

White-label Products

AI-generated Design Systems

---

# Summary

The Phone Store Frontend border radius system provides a consistent corner language through reusable design tokens.

Every component must use predefined radius tokens instead of hardcoded values to ensure visual consistency, accessibility, maintainability, and scalability across the application.