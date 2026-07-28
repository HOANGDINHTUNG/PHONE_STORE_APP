# docs/design-system/dark-mode.md

Version: 1.0

Status: Production Ready

Audience

- Frontend Developers
- UI Designers
- UX Designers
- Design System Engineers
- AI Agents

---

# 1. Purpose

This document defines the official theming strategy for the Phone Store Frontend.

The application supports

- Light Theme
- Dark Theme

The architecture must also be extensible for future themes.

Theme switching must not require component rewrites.

---

# 2. Theme Philosophy

Themes change appearance.

They do not change

Business Logic

↓

Component Structure

↓

Interaction

↓

Accessibility

↓

Navigation

Only visual design changes.

---

# 3. Theme Architecture

Application

↓

Theme Provider

↓

CSS Variables

↓

Tailwind Tokens

↓

Components

↓

User Interface

Components never read colors directly.

---

# 4. Design Tokens

Every visual value comes from design tokens.

Examples

Color

Spacing

Shadow

Radius

Border

Typography

Opacity

Motion

Never hardcode theme values.

---

# 5. CSS Variable Strategy

Preferred

--background

--foreground

--surface

--card

--border

--primary

--secondary

--muted

--success

--warning

--danger

Components consume variables only.

---

# 6. Theme Provider

The application should expose

ThemeContext

ThemeProvider

useTheme()

ThemeSwitcher

Theme provider manages

Current Theme

Persistence

System Theme

---

# 7. Supported Themes

Official

Light

Dark

Future

AMOLED

High Contrast

Brand Themes

Seasonal Themes

White Label Themes

---

# 8. Theme Selection Priority

User Preference

↓

Stored Preference

↓

Operating System

↓

Default Theme

User choice always wins.

---

# 9. System Theme

Support

prefers-color-scheme

Automatically detect

Light

Dark

Users may override manually.

---

# 10. Persistence

Persist theme

Local Storage

or

Cookie

Preferred Key

theme

Reloading the application should preserve theme.

---

# 11. Background Colors

Use semantic tokens

Background

Surface

Elevated Surface

Overlay

Avoid absolute black unless AMOLED theme.

---

# 12. Text Colors

Primary Text

Secondary Text

Muted Text

Disabled Text

Inverse Text

Maintain WCAG AA contrast.

---

# 13. Border Colors

Borders use semantic tokens.

Never use raw gray values.

Support

Cards

Inputs

Tables

Dialogs

Dropdowns

---

# 14. Buttons

Buttons inherit semantic colors.

Primary

Secondary

Outline

Ghost

Danger

Success

Theme switching must require zero component changes.

---

# 15. Forms

Inputs

Checkboxes

Radio

Textarea

Select

Validation

Focus Ring

All use theme tokens.

---

# 16. Navigation

Navbar

Sidebar

Breadcrumb

Tabs

Menus

Navigation remains recognizable across themes.

---

# 17. Product Cards

Card Background

Border

Price

Discount

Rating

Wishlist

All use semantic tokens.

---

# 18. Shadows

Dark Mode uses

Lower Opacity

Higher Blur

Reduced Contrast

Avoid heavy shadows.

---

# 19. Icons

Icons inherit

Current Text Color

Status Icons

Use Semantic Colors

Never create duplicate icon assets.

---

# 20. Images

Product Images remain unchanged.

Decorative illustrations may have

Dark Variant

Brand Variant

if required.

---

# 21. Charts

Charts require

Theme-aware Palette

Accessible Contrast

Readable Labels

Never rely on default chart colors.

---

# 22. Tables

Headers

Rows

Hover

Selected

Borders

Empty States

All consume semantic tokens.

---

# 23. Dialogs

Background

Overlay

Header

Footer

Buttons

Use consistent theme variables.

---

# 24. Notifications

Success

Warning

Error

Information

Backgrounds and icons adapt automatically.

---

# 25. Skeleton Loading

Skeleton colors differ by theme.

Maintain subtle contrast.

Avoid bright flashes.

---

# 26. Code Blocks

Support

Background

Border

Syntax Highlight

Selection

Scrollbar

Use dedicated code tokens.

---

# 27. Scrollbars

Support themed scrollbars.

Desktop only.

Maintain visibility.

Avoid oversized scrollbars.

---

# 28. Accessibility

Dark mode must satisfy

WCAG 2.2 AA

Minimum Contrast

Readable Typography

Visible Focus

Accessible States

Dark mode is not an accessibility substitute.

---

# 29. Performance

Theme switching should

Avoid full page reload

Avoid layout shift

Avoid flicker

Prefer CSS variable updates.

---

# 30. Tailwind Integration

Use semantic utilities.

Example

bg-background

text-foreground

border-border

bg-card

text-primary

Avoid

bg-gray-900

text-white

inside business components.

---

# 31. Component Rules

Every component must

Consume theme tokens

Support both themes

Avoid hardcoded colors

Remain visually identical

Business logic never changes.

---

# 32. AI Agent Rules

Generated code MUST

Use semantic tokens

Support Light Mode

Support Dark Mode

Use CSS Variables

Avoid hardcoded colors

Respect accessibility

Be theme independent

---

# 33. Best Practices

✔ Semantic colors

✔ CSS Variables

✔ Theme Provider

✔ Automatic system detection

✔ Persistent user preference

✔ Accessible contrast

✔ Zero component duplication

✔ Token-based design

---

# 34. Anti Patterns

❌ Hardcoded colors

❌ Duplicate components

❌ Theme-specific business logic

❌ Black backgrounds everywhere

❌ White text everywhere

❌ Inline styles

❌ Manual color switching

❌ Ignoring system theme

---

# 35. Review Checklist

Before Release

✓ Light theme verified

✓ Dark theme verified

✓ Theme switching works

✓ No flickering

✓ Components use tokens

✓ Contrast verified

✓ Charts themed

✓ Forms themed

✓ Dialogs themed

✓ Accessibility validated

---

# 36. Future Evolution

Prepared for

AMOLED Theme

High Contrast Theme

Brand Themes

White Label Products

Dynamic Color

Material You

Multi Tenant Theme System

Enterprise Theme Packs

---

# Summary

The Phone Store Frontend theme system is built on semantic design tokens, CSS variables, and a centralized Theme Provider.

All components must remain theme-independent, consume reusable tokens, support automatic system preferences, and provide a consistent, accessible experience across Light and Dark modes while remaining extensible for future themes.