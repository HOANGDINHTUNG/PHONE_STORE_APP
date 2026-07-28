# docs/design-system/accessibility.md

Version: 1.0

Status: Production Ready

Audience

- Frontend Developers
- UX Designers
- QA Engineers
- Product Designers
- AI Agents

---

# 1. Purpose

Accessibility (A11y) ensures every user can successfully use the Phone Store Frontend regardless of ability, device, or assistive technology.

Accessibility is not an optional feature.

It is a fundamental quality requirement.

Every feature must be accessible before it is considered complete.

---

# 2. Accessibility Goals

The application should support

- Keyboard Users
- Screen Readers
- Low Vision Users
- Color Blind Users
- Motor Disabilities
- Cognitive Disabilities
- Temporary Disabilities
- Mobile Users

Accessibility benefits everyone.

---

# 3. Compliance

Minimum Target

WCAG 2.2 AA

Recommended

WCAG AAA whenever practical

Follow

- Semantic HTML
- WAI-ARIA
- HTML Living Standard

---

# 4. POUR Principles

Accessibility follows four principles.

Perceivable

↓

Operable

↓

Understandable

↓

Robust

Every interface must satisfy all four.

---

# 5. Semantic HTML

Always prefer

button

nav

header

footer

main

section

article

label

table

form

Never replace semantic elements with generic div containers unless absolutely necessary.

---

# 6. Keyboard Navigation

Every interactive element must be reachable using

Tab

Shift + Tab

Enter

Space

Escape

Arrow Keys

No mouse should be required.

---

# 7. Focus Management

Focus must

Always be visible

↓

Move logically

↓

Never disappear

↓

Never become trapped

Exceptions

Modal

Drawer

Dialog

These intentionally trap focus until closed.

---

# 8. Focus Order

Focus order must follow

Top

↓

Left

↓

Right

↓

Bottom

Avoid unexpected jumps.

---

# 9. Focus Indicator

Every focusable element requires

Visible Focus Ring

Minimum contrast

WCAG AA

Never remove

outline

unless replaced with an equivalent accessible indicator.

---

# 10. Skip Navigation

Provide

Skip to Content

before navigation.

Keyboard users should bypass repetitive menus quickly.

---

# 11. Color Contrast

Normal Text

Minimum

4.5 : 1

Large Text

Minimum

3 : 1

Interactive Components

Minimum

3 : 1

Never communicate information using color alone.

---

# 12. Text Accessibility

Minimum body size

16px

Avoid

Tiny Fonts

Low Contrast

Dense Paragraphs

Use sufficient line height.

---

# 13. Images

Decorative Images

aria-hidden="true"

Informative Images

Meaningful alt text

Product Images

Describe product

Avoid

image123.jpg

---

# 14. Icons

Decorative

Hidden from Screen Readers

Interactive

Accessible Name Required

Never use icons as the only label.

---

# 15. Forms

Every input requires

Visible Label

Placeholder (optional)

Helper Text

Validation Message

Associated Error

Required Indicator

Never rely on placeholders as labels.

---

# 16. Labels

Correct

<label for="email">

Incorrect

Placeholder Only

Screen readers require explicit labels.

---

# 17. Validation

Errors should

Identify Field

Explain Problem

Suggest Solution

Focus First Invalid Input

Use

aria-invalid

when appropriate.

---

# 18. Buttons

Buttons require

Visible Label

Accessible Name

Keyboard Support

Focus State

Disabled State

Loading State

Never use generic labels like

Click Here

---

# 19. Links

Links should clearly describe destination.

Correct

View Order History

Incorrect

Click Here

Open

Read More

without context.

---

# 20. Tables

Tables require

Caption

Header Cells

Scope

Logical Reading Order

Avoid tables for layout.

---

# 21. Dialogs

Dialogs must

Trap Focus

Restore Focus

Support Escape

Announce Title

Announce Description

Use

aria-modal="true"

---

# 22. Notifications

Toast messages should

Announce automatically

Not steal focus

Remain dismissible

Use

aria-live

appropriately.

---

# 23. Loading States

Loading indicators require

Accessible Label

Progress Description

Long operations require progress updates.

---

# 24. Motion Accessibility

Respect

prefers-reduced-motion

Disable

Parallax

Large Motion

Decorative Animation

Critical information must remain visible.

---

# 25. Responsive Accessibility

Zoom

200%

without breaking layout.

Touch Targets

Minimum

44 × 44px

Support landscape and portrait.

---

# 26. Screen Readers

Support

NVDA

JAWS

VoiceOver

TalkBack

Narrator

Never assume visual context.

---

# 27. ARIA Guidelines

Use ARIA only when native HTML cannot express semantics.

Examples

aria-label

aria-labelledby

aria-describedby

aria-expanded

aria-controls

aria-live

Avoid unnecessary ARIA.

Native HTML is preferred.

---

# 28. Error Prevention

Critical actions should require confirmation.

Examples

Delete Account

Payment

Refund

Reset Password

Prevent irreversible mistakes.

---

# 29. Time Limits

Warn users before

Session Expiration

Payment Timeout

Authentication Timeout

Allow extension whenever possible.

---

# 30. Accessibility Testing

Every release should include

Keyboard Testing

↓

Screen Reader Testing

↓

Contrast Validation

↓

Zoom Testing

↓

Mobile Accessibility

↓

Automated Accessibility Scan

---

# 31. Recommended Tools

Development

ESLint Accessibility Rules

Testing

axe DevTools

Lighthouse

Accessibility Insights

Manual

Keyboard

Screen Reader

Color Contrast Checker

---

# 32. AI Agent Rules

Generated code MUST

Use semantic HTML

Provide labels

Support keyboard

Respect WCAG

Generate ARIA only when needed

Never remove focus indicators

Support screen readers

Generate accessible forms

---

# 33. Best Practices

✔ Semantic HTML

✔ Visible Focus

✔ Logical Navigation

✔ Proper Labels

✔ Accessible Forms

✔ Keyboard Support

✔ Screen Reader Friendly

✔ High Contrast

✔ Reduced Motion Support

✔ Accessible Validation

---

# 34. Anti Patterns

❌ Clickable div

❌ Placeholder as label

❌ Missing alt text

❌ Hidden focus

❌ Mouse-only interaction

❌ Color-only feedback

❌ Generic button text

❌ Broken keyboard navigation

❌ Auto-playing animations

❌ ARIA everywhere

---

# 35. Accessibility Checklist

Before Release

✓ WCAG AA satisfied

✓ Keyboard accessible

✓ Focus visible

✓ Screen reader verified

✓ Images have alt text

✓ Forms labelled

✓ Error messages accessible

✓ Color contrast validated

✓ Touch targets verified

✓ Reduced motion supported

---

# 36. Future Evolution

Prepared for

WCAG 3.0

Voice Interfaces

AI Assistants

Eye Tracking

Switch Devices

Spatial Computing

Adaptive Accessibility

Automatic Accessibility Validation

---

# Summary

The Phone Store Frontend accessibility system follows WCAG 2.2 AA principles and prioritizes inclusive design from the beginning of development.

Every feature must be keyboard accessible, screen reader friendly, semantically correct, visually perceivable, and operable without relying on a specific device or ability.

Accessibility is a quality requirement, not an enhancement.