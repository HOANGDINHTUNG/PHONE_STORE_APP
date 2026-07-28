# docs/design-system/spacing.md

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

This document defines the official spacing system used throughout the Phone Store Frontend.

Spacing is one of the most important aspects of visual consistency.

Correct spacing improves

- Readability
- Visual Balance
- User Experience
- Accessibility
- Maintainability
- Scalability

No component should define arbitrary spacing.

---

# 2. Philosophy

Spacing should be

Consistent

↓

Predictable

↓

Reusable

↓

Responsive

↓

Scalable

Developers should always use predefined spacing tokens.

Never guess spacing.

---

# 3. Grid System

The design system uses an **8-point grid**.

Every spacing value is derived from

4px

↓

8px

↓

12px

↓

16px

↓

24px

↓

32px

↓

40px

↓

48px

↓

64px

↓

96px

Avoid random values such as

13px

17px

21px

27px

unless required by typography alignment.

---

# 4. Spacing Scale

Spacing Tokens

space-0

0px

space-1

4px

space-2

8px

space-3

12px

space-4

16px

space-5

20px

space-6

24px

space-8

32px

space-10

40px

space-12

48px

space-16

64px

space-20

80px

space-24

96px

All layouts must use these tokens.

---

# 5. Margin

Margin creates separation

Outside

Components

Sections

Cards

Forms

Dialogs

Margin should never be used to create internal spacing.

---

# 6. Padding

Padding creates space

Inside

Buttons

Cards

Inputs

Containers

Modals

Never replace padding with margin.

---

# 7. Layout Spacing

Desktop

32px

Tablet

24px

Mobile

16px

The outer page padding adapts based on screen size.

---

# 8. Section Spacing

Large Sections

64px

Medium Sections

48px

Small Sections

32px

Never stack sections without spacing.

---

# 9. Card Spacing

Outer Margin

16px

Internal Padding

24px

Gap Between Elements

16px

Cards should feel breathable.

---

# 10. Form Spacing

Label

↓

8px

Input

↓

16px

Helper Text

↓

4px

Next Field

↓

24px

Large forms should be grouped.

---

# 11. Button Spacing

Horizontal Padding

20px

Vertical Padding

12px

Gap Between Icon and Text

8px

Buttons should never feel cramped.

---

# 12. Input Spacing

Internal Padding

12px

Icon Gap

8px

Input Group Gap

16px

Validation Message

4px

---

# 13. Navigation Spacing

Desktop Navigation

24px

Mobile Navigation

16px

Sidebar

20px

Dropdown

12px

Navigation should remain compact but readable.

---

# 14. Table Spacing

Row Height

48px

Header Padding

16px

Cell Padding

16px

Action Buttons

8px

Avoid dense tables unless explicitly required.

---

# 15. List Spacing

List Item

12px

Grouped List

16px

Section Between Lists

32px

Maintain rhythm throughout long pages.

---

# 16. Grid Gap

Small Grid

12px

Default Grid

16px

Large Grid

24px

Dashboard Grid

32px

Use CSS Grid gap instead of margins.

---

# 17. Flex Gap

Preferred

gap

Avoid

margin-right

margin-left

Modern layouts should use gap whenever possible.

---

# 18. Modal Spacing

Outer Padding

32px

Header

24px

Body

24px

Footer

24px

Button Gap

12px

---

# 19. Drawer Spacing

Internal Padding

24px

Sections

24px

Buttons

16px

Drawer width changes with viewport.

---

# 20. Dialog Spacing

Title

↓

Body

16px

Body

↓

Footer

24px

Buttons

8px

---

# 21. Product Card

Image

↓

16px

Title

↓

8px

Price

↓

12px

Rating

↓

8px

Action Button

↓

16px

Product cards should feel balanced.

---

# 22. Checkout Page

Shipping

↓

Payment

32px

Payment

↓

Summary

32px

Summary

↓

Submit Button

24px

---

# 23. Dashboard

Widget Gap

24px

Section Gap

32px

Charts

24px

Cards

16px

---

# 24. Responsive Rules

Desktop

↓

Tablet

↓

Mobile

Spacing decreases gradually.

Never remove spacing entirely.

---

# 25. Density

Comfortable

Default

Compact

Admin Tables

Dense

Data-heavy interfaces only.

---

# 26. Accessibility

Clickable Area

Minimum

44px

Interactive spacing should support touch devices.

---

# 27. Tailwind Mapping

space-1

↓

p-1

m-1

gap-1

space-2

↓

p-2

gap-2

space-4

↓

p-4

gap-4

Developers should use Tailwind spacing utilities.

---

# 28. Design Tokens

Preferred Tokens

space-xs

space-sm

space-md

space-lg

space-xl

space-2xl

Avoid raw pixel values.

---

# 29. AI Agent Rules

AI-generated layouts MUST

Use spacing tokens

Use gap instead of margins

Follow responsive spacing

Support touch devices

Avoid arbitrary spacing

Reuse layout primitives

---

# 30. Best Practices

✔ Use 8pt Grid

✔ Reuse spacing tokens

✔ Prefer gap

✔ Responsive spacing

✔ Consistent rhythm

✔ Separate sections clearly

✔ Maintain whitespace

---

# 31. Anti Patterns

❌ Random spacing

❌ Inline margin hacks

❌ Mixing multiple spacing scales

❌ Crowded forms

❌ No whitespace

❌ Excessive whitespace

❌ Pixel-perfect adjustments everywhere

---

# 32. Component Mapping

Button

↓

space-sm

Card

↓

space-lg

Modal

↓

space-xl

Dashboard

↓

space-2xl

Product Grid

↓

space-md

---

# 33. Review Checklist

Before Release

✓ Uses spacing tokens

✓ Responsive spacing verified

✓ No arbitrary values

✓ Uses gap where possible

✓ Accessible touch targets

✓ Layout rhythm consistent

✓ Cards aligned

✓ Forms readable

---

# 34. Future Evolution

Prepared for

Fluid Spacing

Container Queries

Adaptive Density

Large Screen Layouts

Foldable Devices

Responsive Design Tokens

AI-assisted Layout Optimization

---

# Summary

The Phone Store Frontend spacing system follows an 8-point grid with reusable spacing tokens.

Every layout, component, and page should use predefined spacing values to ensure consistency, readability, accessibility, and long-term maintainability.

Spacing should be treated as a first-class design token, never as an afterthought.