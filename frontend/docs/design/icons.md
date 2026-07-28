# docs/design-system/icons.md

Version: 1.0

Status: Production Ready

Audience

- UI Designers
- UX Designers
- Frontend Developers
- Design System Engineers
- AI Agents

---

# 1. Purpose

This document defines the official icon system for the Phone Store Frontend.

Icons improve

- Recognition
- Navigation
- Accessibility
- Visual hierarchy
- User experience
- Consistency

Icons support content.

Icons never replace meaningful text.

---

# 2. Design Philosophy

Icons should be

Simple

↓

Recognizable

↓

Consistent

↓

Accessible

↓

Scalable

Every icon should communicate one clear action or meaning.

---

# 3. Official Icon Library

Primary Library

Lucide React

Reason

- Lightweight
- Tree Shaking
- React Native Support
- SVG Based
- Excellent TypeScript Support
- Active Community

Alternative libraries require architecture approval.

---

# 4. Icon Style

Preferred

Outline Icons

Avoid mixing

Outline

Filled

Rounded

Sharp

3D

inside the same interface.

---

# 5. Icon Sizes

Official Tokens

icon-xs

12px

icon-sm

16px

icon-md

20px

icon-lg

24px

icon-xl

32px

icon-2xl

48px

Never use arbitrary icon sizes.

---

# 6. Stroke Width

Default

2

Compact UI

1.5

Large Marketing Graphics

2.5

Maintain consistent stroke weight.

---

# 7. Color Rules

Icons inherit color from text tokens.

Examples

text-primary

text-secondary

text-muted

text-success

text-warning

text-danger

Never hardcode icon colors.

---

# 8. Semantic Usage

Success

Check

Warning

Triangle Alert

Error

Circle X

Information

Info

Loading

Loader

Search

Search

Close

X

Always use the same icon for the same meaning.

---

# 9. Navigation Icons

Home

Shopping Bag

Shopping Cart

Heart

User

Settings

Package

Chart

Notification

Navigation icons remain consistent across desktop and mobile.

---

# 10. Product Icons

Phone

Tablet

Laptop

Watch

Headphones

Battery

Camera

Chip

Memory

Storage

These icons describe products, not actions.

---

# 11. Action Icons

Create

Plus

Edit

Pencil

Delete

Trash

Copy

Copy

Share

Share

Download

Download

Upload

Upload

Actions should always include a tooltip if icon-only.

---

# 12. Button Rules

Text + Icon

Preferred

Icon Only

Allowed for common actions

Icon buttons require

Accessible Label

Tooltip

Visible Focus Ring

---

# 13. Accessibility

Decorative Icon

aria-hidden="true"

Interactive Icon

Accessible Name Required

Screen readers should understand icon purpose.

---

# 14. Spacing

Icon

↓

Text

8px

Multiple Icons

12px

Toolbar

16px

Use spacing tokens only.

---

# 15. Icon Alignment

Icons align with

Text Baseline

Button Center

Input Center

Card Header

Never manually offset icons.

---

# 16. Input Icons

Search

Search

Password

Eye

Calendar

Calendar

Email

Mail

Phone

Phone

Validation

Circle Check

Maintain consistent placement.

---

# 17. Status Icons

Available

Check

Unavailable

Circle X

Pending

Clock

Shipping

Truck

Delivered

Package Check

Cancelled

Ban

Status icons reinforce semantic colors.

---

# 18. Loading Icons

Spinner

Loader

Skeleton

Preferred for page loading

Progress Bar

Long operations

Avoid spinning every icon.

---

# 19. Empty States

Every empty state should include

Meaningful Icon

Title

Description

Primary Action

Icons should support messaging.

---

# 20. Notification Icons

Success

Circle Check

Warning

Triangle Alert

Error

Circle X

Info

Info

Notification Center remains visually consistent.

---

# 21. Dark Mode

Icons inherit theme colors.

No separate icon assets are required.

Contrast must remain accessible.

---

# 22. Responsive Rules

Desktop

24px

Tablet

20px

Mobile

20px

Do not shrink icons below readability.

---

# 23. Performance

Icons should be

SVG

Tree-shaken

Lazy Loaded when appropriate

Avoid bitmap images for interface icons.

---

# 24. Design Tokens

Preferred Tokens

icon-xs

icon-sm

icon-md

icon-lg

icon-xl

icon-primary

icon-muted

icon-danger

icon-success

Avoid inline styles.

---

# 25. Tailwind Mapping

Size

w-4 h-4

w-5 h-5

w-6 h-6

Color

text-primary

text-muted

text-red-500

text-green-500

Business components should consume semantic utility classes.

---

# 26. Component Mapping

Button

↓

Icon + Label

Input

↓

Leading Icon

Card

↓

Optional Icon

Navbar

↓

Navigation Icon

Sidebar

↓

Navigation Icon

Toast

↓

Status Icon

Modal

↓

Optional Header Icon

---

# 27. AI Agent Rules

AI-generated interfaces MUST

Use Lucide React

Use design tokens

Provide accessible labels

Avoid decorative overload

Reuse existing icons

Never mix icon libraries

Follow semantic meaning

---

# 28. Best Practices

✔ One library only

✔ SVG icons

✔ Semantic meaning

✔ Consistent sizing

✔ Accessible labels

✔ Responsive scaling

✔ Token-based colors

✔ Tooltip for icon-only buttons

---

# 29. Anti Patterns

❌ Multiple icon libraries

❌ Emoji replacing icons

❌ Raster image icons

❌ Hardcoded colors

❌ Tiny icons

❌ Giant icons

❌ Missing accessibility labels

❌ Decorative icons everywhere

---

# 30. Review Checklist

Before Release

✓ Lucide React used

✓ Correct semantic icons

✓ Token-based sizing

✓ Accessible labels

✓ Dark mode verified

✓ Responsive sizing

✓ Tooltips present

✓ No mixed icon styles

---

# 31. Future Evolution

Prepared for

Animated Icons

Custom Brand Icons

Dynamic Icon Packs

RTL Layout Support

AI-generated Icons

Theme-aware Icons

Enterprise Icon Registry

---

# Summary

The Phone Store Frontend icon system is based on a single, consistent SVG icon library with reusable design tokens.

Icons should enhance usability, remain accessible, scale across devices, and always reinforce—not replace—clear textual communication.