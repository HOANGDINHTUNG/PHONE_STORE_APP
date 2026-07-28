# docs/design-system/colors.md

Version: 1.0

Status: Production Ready

Audience

- UI Designers
- Frontend Developers
- Design System Engineers
- AI Agents

---

# 1. Purpose

This document defines the official color system used throughout the Phone Store Frontend.

Every interface, component, page, dashboard, and future feature MUST use colors defined in this document.

Goals

- Visual consistency
- Accessibility
- Brand identity
- Dark mode support
- Scalable design tokens
- AI-generated UI consistency

---

# 2. Design Principles

The color system follows five principles.

Consistency

↓

Accessibility

↓

Semantic Meaning

↓

Scalability

↓

Maintainability

Colors are never chosen randomly.

Every color communicates meaning.

---

# 3. Color Hierarchy

Brand Colors

↓

Semantic Colors

↓

Neutral Colors

↓

Surface Colors

↓

Border Colors

↓

Text Colors

↓

Interactive Colors

---

# 4. Brand Palette

Primary

Blue

Purpose

Main Brand Identity

Used for

Buttons

Links

Navigation

Highlights

Primary Actions

---

Secondary

Slate

Purpose

Supporting UI

Used for

Cards

Containers

Headers

Sidebars

---

Accent

Indigo

Purpose

Attention

Used for

Promotions

Feature Highlights

Special Badges

---

# 5. Semantic Colors

Success

Green

Meaning

Completed

Approved

Available

Healthy

---

Warning

Amber

Meaning

Needs Attention

Pending

Limited Stock

Validation Warning

---

Error

Red

Meaning

Failure

Validation Error

Payment Failed

Deleted

Unavailable

---

Info

Sky Blue

Meaning

Information

Notification

Guidance

Help

---

# 6. Neutral Palette

Neutral colors build layouts.

50

100

200

300

400

500

600

700

800

900

950

Used for

Background

Border

Text

Disabled States

Cards

---

# 7. Surface Colors

Application Background

↓

Page

↓

Section

↓

Card

↓

Modal

↓

Popover

↓

Tooltip

Every elevation level should have a different surface color.

---

# 8. Text Colors

Primary Text

Highest contrast

Secondary Text

Supporting information

Muted Text

Descriptions

Disabled Text

Unavailable content

Inverse Text

Dark surfaces

---

# 9. Border Colors

Border colors separate content.

Examples

Input Border

Card Border

Divider

Table Border

Modal Border

Avoid heavy borders.

Prefer subtle separation.

---

# 10. Interactive Colors

Primary Button

Hover

Active

Focus

Disabled

Loading

Every interactive component must define every state.

---

# 11. Button Color Rules

Primary

Brand Color

Secondary

Neutral

Danger

Red

Success

Green

Ghost

Transparent

Outline

Border Only

Never invent button colors.

---

# 12. Link Colors

Normal

Hover

Visited

Active

Focus

Links should remain recognizable.

Never remove visual feedback.

---

# 13. Form Colors

Input

Hover

Focus

Disabled

Error

Success

Read Only

Validation colors must match semantic colors.

---

# 14. Badge Colors

Success Badge

Green

Warning Badge

Amber

Error Badge

Red

Info Badge

Blue

Neutral Badge

Gray

Badges communicate status only.

---

# 15. Product Status Colors

In Stock

Green

Low Stock

Orange

Out of Stock

Gray

Discount

Red

New Arrival

Blue

Best Seller

Purple

Limited Edition

Gold

---

# 16. Order Status Colors

Pending

Amber

Confirmed

Blue

Shipping

Indigo

Delivered

Green

Cancelled

Red

Refunded

Gray

---

# 17. Payment Status

Waiting

Amber

Paid

Green

Failed

Red

Refunding

Orange

Refunded

Gray

---

# 18. Accessibility

Minimum Contrast

WCAG AA

Normal Text

4.5 : 1

Large Text

3 : 1

Never use low-contrast text.

---

# 19. Dark Mode

Every color requires

Light Variant

Dark Variant

Avoid simply inverting colors.

Design specifically for dark environments.

---

# 20. Color Tokens

Never use raw colors directly.

Correct

color-primary

color-success

color-danger

surface-card

text-primary

Incorrect

#4285F4

rgb(...)

hsl(...)

Tokens improve maintainability.

---

# 21. Tailwind Mapping

Every token maps into Tailwind Theme.

Example

primary

secondary

success

warning

danger

surface

background

foreground

No hardcoded utilities inside business components.

---

# 22. Component Mapping

Button

↓

Primary Token

Card

↓

Surface Token

Badge

↓

Semantic Token

Alert

↓

Status Token

Input

↓

Border Token

Every component consumes design tokens.

---

# 23. Charts

Recommended palette

Blue

Green

Amber

Purple

Pink

Cyan

Avoid using semantic red/green unless representing status.

---

# 24. AI Agent Rules

AI-generated components MUST

Use Design Tokens

Support Dark Mode

Respect Semantic Colors

Never Hardcode Colors

Follow Accessibility

Reuse Existing Palette

---

# 25. Best Practices

✔ Use semantic tokens

✔ Keep contrast high

✔ Support dark mode

✔ Reuse colors

✔ Avoid decorative overload

✔ Maintain brand consistency

✔ Validate accessibility

---

# 26. Anti Patterns

❌ Hardcoded hex values

❌ Random colors

❌ Neon UI

❌ Low contrast

❌ Multiple primary colors

❌ Gradient everywhere

❌ Inconsistent status colors

❌ Different button colors for same action

---

# 27. Checklist

Before Release

✓ Uses design tokens

✓ Supports dark mode

✓ WCAG compliant

✓ Consistent semantic colors

✓ No hardcoded colors

✓ Brand colors respected

✓ Hover states defined

✓ Focus states defined

---

# 28. Future Evolution

The color system is prepared for

High Contrast Mode

Custom Themes

Brand White Labeling

Seasonal Themes

Enterprise Theme Packs

Dynamic Theme Switching

---

# Summary

The Phone Store Frontend color system is based on

- Brand Colors
- Semantic Colors
- Neutral Palette
- Design Tokens
- Accessibility
- Dark Mode

All UI elements must consume design tokens instead of raw color values to ensure consistency, scalability, and maintainability.