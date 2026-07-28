# docs/design-system/shadows.md

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

This document defines the official shadow system used throughout the Phone Store Frontend.

Shadows communicate

- Elevation
- Layer Hierarchy
- Interaction
- Focus
- Depth
- Accessibility

Every shadow must originate from predefined design tokens.

Never invent custom shadows.

---

# 2. Design Philosophy

Shadow exists to indicate

Elevation

↓

Hierarchy

↓

Interaction

↓

Focus

↓

Depth

Not decoration.

The UI should remain clean and modern.

---

# 3. Elevation Model

Layer 0

Background

↓

Layer 1

Card

↓

Layer 2

Dropdown

↓

Layer 3

Popover

↓

Layer 4

Modal

↓

Layer 5

Notification

↓

Layer 6

Tooltip

Higher elevation always appears above lower elevation.

---

# 4. Shadow Principles

Shadows should be

Subtle

↓

Consistent

↓

Reusable

↓

Accessible

↓

Predictable

Avoid dramatic shadows.

---

# 5. Shadow Tokens

shadow-none

No shadow

shadow-xs

Minimal elevation

shadow-sm

Small components

shadow-md

Cards

shadow-lg

Dropdown

shadow-xl

Modal

shadow-2xl

Overlay

shadow-focus

Keyboard focus

Every component uses tokens only.

---

# 6. Layer 0

Examples

Application Background

Page

Section

Canvas

Shadow

None

---

# 7. Layer 1

Examples

Card

Statistic Card

Information Panel

Product Card

Recommended Token

shadow-sm

---

# 8. Layer 2

Examples

Dropdown

Select

Autocomplete

Menu

Recommended Token

shadow-md

---

# 9. Layer 3

Examples

Popover

Date Picker

Calendar

Context Menu

Recommended Token

shadow-lg

---

# 10. Layer 4

Examples

Dialog

Modal

Image Viewer

Checkout Confirmation

Recommended Token

shadow-xl

---

# 11. Layer 5

Examples

Toast

Notification

Floating Banner

Assistant Widget

Recommended Token

shadow-xl

---

# 12. Layer 6

Examples

Tooltip

Help Bubble

Quick Preview

Recommended Token

shadow-2xl

---

# 13. Interactive Shadows

Default

↓

Hover

↓

Active

↓

Focus

↓

Disabled

Every interactive component defines all states.

---

# 14. Hover Elevation

Hover should

Increase elevation slightly.

Never create dramatic jumps.

Purpose

Visual Feedback

Not animation.

---

# 15. Active State

When pressed

Shadow becomes smaller.

Component appears closer to the surface.

Creates tactile feedback.

---

# 16. Focus Ring

Keyboard navigation must NOT rely on shadow.

Always combine

Focus Ring

+

Focus Shadow

Accessibility first.

---

# 17. Cards

Cards use

shadow-sm

Hover

shadow-md

Interactive cards may elevate one level.

---

# 18. Buttons

Primary

shadow-sm

Hover

shadow-md

Pressed

shadow-xs

Disabled

No elevation change.

---

# 19. Floating Action Button

Floating Button

shadow-lg

Hover

shadow-xl

Pressed

shadow-md

---

# 20. Navigation

Top Navigation

Minimal shadow

Sidebar

No shadow

Floating Sidebar

shadow-lg

---

# 21. Tables

Tables

No shadow

Table Container

shadow-sm

Floating Table

shadow-md

Avoid shadows on every row.

---

# 22. Inputs

Default

No shadow

Focus

shadow-focus

Error

Border Color

Not red shadow.

---

# 23. Modal Overlay

Modal

shadow-xl

Overlay

Separate Layer

Never rely only on shadow.

Always use overlay.

---

# 24. Dark Mode

Dark Mode shadows are softer.

Reduce opacity.

Increase blur.

Avoid heavy black shadows.

---

# 25. Mobile

Mobile shadows should be lighter.

Heavy shadows reduce perceived performance.

Use fewer elevation levels.

---

# 26. Performance

Large blur radius

↓

Higher GPU cost

Avoid unnecessary shadows on large lists.

Virtualized lists should minimize elevation.

---

# 27. Accessibility

Shadow must never communicate information alone.

Always combine with

Border

Color

Typography

Icon

---

# 28. Design Tokens

Preferred

shadow-xs

shadow-sm

shadow-md

shadow-lg

shadow-xl

shadow-2xl

shadow-focus

Avoid inline box-shadow values.

---

# 29. Tailwind Mapping

shadow-xs

↓

shadow-sm

shadow-sm

↓

shadow

shadow-md

↓

shadow-md

shadow-lg

↓

shadow-lg

shadow-xl

↓

shadow-xl

Tailwind configuration should map directly to design tokens.

---

# 30. Component Mapping

Card

↓

shadow-sm

Dropdown

↓

shadow-md

Popover

↓

shadow-lg

Dialog

↓

shadow-xl

Tooltip

↓

shadow-2xl

Button Hover

↓

shadow-md

---

# 31. AI Agent Rules

Generated UI MUST

Use shadow tokens

Respect elevation hierarchy

Avoid inline shadows

Support dark mode

Use focus shadows correctly

Avoid decorative shadows

---

# 32. Best Practices

✔ Minimal elevation

✔ Consistent hierarchy

✔ Semantic shadows

✔ Responsive depth

✔ Accessible focus

✔ Dark mode support

✔ Performance friendly

---

# 33. Anti Patterns

❌ Heavy shadows

❌ Multiple shadow styles

❌ Random box-shadow values

❌ Shadow on every component

❌ Shadow replacing borders

❌ Neon glow

❌ Decorative effects

---

# 34. Review Checklist

Before Release

✓ Shadow tokens used

✓ Elevation hierarchy respected

✓ Hover states correct

✓ Focus visible

✓ Dark mode verified

✓ Performance acceptable

✓ No inline box-shadow

---

# 35. Future Evolution

Prepared for

Material Design 3

Glassmorphism

Soft UI

Adaptive Elevation

Dynamic Themes

AI-generated Components

Design Token Level 2

---

# Summary

The Phone Store Frontend shadow system establishes a predictable elevation hierarchy using reusable design tokens.

Every component should communicate depth through predefined shadow levels rather than custom visual effects, ensuring consistency, accessibility, maintainability, and high-quality user experience.