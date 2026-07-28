# docs/design-system/animation.md

Version: 1.0

Status: Production Ready

Audience

- Frontend Developers
- UI Designers
- UX Engineers
- Design System Engineers
- AI Agents

---

# 1. Purpose

This document defines the official animation system used throughout the Phone Store Frontend.

Animations should improve

- User Experience
- Feedback
- Navigation
- Perceived Performance
- Accessibility
- Visual Consistency

Animation should never distract users.

---

# 2. Animation Philosophy

Animation exists to

Guide

↓

Explain

↓

Confirm

↓

Delight

↓

Never Distract

Every animation should have a clear purpose.

---

# 3. Design Principles

Animations should be

Fast

↓

Smooth

↓

Predictable

↓

Consistent

↓

Accessible

Avoid unnecessary movement.

---

# 4. Animation Categories

Hover Animation

↓

Focus Animation

↓

Loading Animation

↓

Page Transition

↓

Modal Animation

↓

Drawer Animation

↓

Toast Animation

↓

Skeleton Animation

---

# 5. Duration Tokens

motion-instant

75ms

motion-fast

150ms

motion-normal

250ms

motion-slow

350ms

motion-extra-slow

500ms

Never exceed 700ms for UI interactions.

---

# 6. Easing Tokens

Linear

Loading

Ease-Out

Enter

Ease-In

Exit

Ease-In-Out

General Transition

Spring

Interactive Components

Use predefined easing tokens only.

---

# 7. Hover Animation

Duration

150ms

Effects

Background Color

Border Color

Shadow

Opacity

Scale (Maximum 1.02)

Hover should feel responsive.

---

# 8. Focus Animation

Focus appears immediately.

Animated properties

Outline

Shadow

Border

Never animate focus excessively.

Accessibility has priority.

---

# 9. Active Animation

Pressed components should

Reduce shadow

Slightly decrease scale

Maximum

0.98

Duration

75ms

Simulate physical interaction.

---

# 10. Button Animation

Hover

↓

Background Transition

↓

Shadow

↓

Cursor

Pressed

↓

Small Scale

↓

Reduced Shadow

---

# 11. Input Animation

Animate

Border Color

Focus Ring

Placeholder Position

Validation State

Avoid moving input fields.

---

# 12. Card Animation

Hover

Shadow Increase

Small Lift

Duration

200ms

Avoid floating effects larger than 4px.

---

# 13. Modal Animation

Open

Fade

+

Scale Up

Close

Fade

+

Scale Down

Duration

250ms

Never slide full-screen dialogs unnecessarily.

---

# 14. Drawer Animation

Open

Slide In

Close

Slide Out

Duration

300ms

Respect screen direction.

---

# 15. Dropdown Animation

Fade

↓

Expand

↓

Visible

Close

↓

Collapse

↓

Fade

Fast and lightweight.

---

# 16. Tooltip Animation

Fade

+

Small Translate

Duration

150ms

Tooltips should appear instantly.

---

# 17. Toast Animation

Enter

Slide Up

Fade In

Exit

Fade Out

Slide Down

Maximum visibility

5 seconds

---

# 18. Accordion Animation

Expand

Height

Opacity

Collapse

Height

Opacity

Avoid layout jumping.

---

# 19. Tabs Animation

Indicator

Slide

Content

Fade

Duration

200ms

Navigation remains responsive.

---

# 20. Page Transition

Fade

Preferred

Slide

Optional

Scale

Rare

Avoid dramatic transitions.

---

# 21. Loading Animation

Spinner

Short Operations

Skeleton

Page Loading

Progress Bar

Long Operations

Always indicate progress.

---

# 22. Skeleton Animation

Preferred

Shimmer

Alternative

Pulse

Never use spinner for entire page loading.

---

# 23. Image Loading

Placeholder

↓

Blur

↓

Image

↓

Fade In

Improve perceived performance.

---

# 24. List Animation

New Item

Fade In

Delete

Fade Out

Reorder

Smooth Position Transition

Avoid sudden layout shifts.

---

# 25. Notification Animation

Appear

Fade + Slide

Disappear

Fade

Notifications should not interrupt workflow.

---

# 26. Error Animation

Shake

Allowed

Only

Validation Error

Avoid repeated shaking.

---

# 27. Success Animation

Small Scale

Fade

Check Icon

Keep success animations subtle.

---

# 28. Responsive Rules

Desktop

Full Animation

Tablet

Reduced Animation

Mobile

Lightweight Animation

Optimize for battery life.

---

# 29. Accessibility

Support

prefers-reduced-motion

Disable

Large Motion

Parallax

Infinite Decorative Animations

Users control motion preferences.

---

# 30. Performance

Animate

Opacity

Transform

Avoid animating

Width

Height

Top

Left

Margin

These trigger expensive layout recalculations.

---

# 31. CSS Properties

Preferred

transform

opacity

filter (limited)

Avoid

box-shadow animation

large blur animation

layout properties

---

# 32. Tailwind Mapping

duration-150

duration-200

duration-300

ease-in

ease-out

ease-in-out

transition-all

transition-colors

transition-opacity

Prefer utility classes over custom CSS.

---

# 33. Design Tokens

motion-fast

motion-normal

motion-slow

ease-standard

ease-emphasized

animation-hover

animation-modal

animation-toast

Never hardcode durations.

---

# 34. Component Mapping

Button

↓

Hover Animation

Input

↓

Focus Animation

Modal

↓

Fade + Scale

Drawer

↓

Slide

Toast

↓

Fade

Tooltip

↓

Fade

Accordion

↓

Height Transition

---

# 35. AI Agent Rules

Generated UI MUST

Use animation tokens

Respect reduced motion

Avoid unnecessary movement

Use transform instead of layout animation

Keep durations consistent

Follow accessibility guidelines

---

# 36. Best Practices

✔ Fast animations

✔ Consistent timing

✔ Accessible motion

✔ Token-based durations

✔ Smooth transitions

✔ GPU-friendly properties

✔ Subtle effects

---

# 37. Anti Patterns

❌ Infinite decorative animations

❌ Slow transitions

❌ Bounce everywhere

❌ Large scaling effects

❌ Flashing elements

❌ Layout animations

❌ Different durations everywhere

❌ Ignoring reduced motion

---

# 38. Review Checklist

Before Release

✓ Animation tokens used

✓ Consistent duration

✓ Smooth transitions

✓ Reduced motion supported

✓ Performance verified

✓ No layout animation

✓ GPU-friendly properties

✓ Accessible interactions

---

# 39. Future Evolution

Prepared for

Motion Tokens

View Transitions API

Shared Element Transitions

Spring Physics

Gesture Animations

Adaptive Motion

AI-generated Motion

---

# Summary

The Phone Store Frontend animation system uses consistent motion tokens, reusable transition patterns, and accessibility-first principles.

Animations should enhance clarity, provide meaningful feedback, and improve perceived performance without distracting users or reducing application responsiveness.