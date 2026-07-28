# docs/design-system/motion.md

Version: 1.0

Status: Production Ready

Audience

- UX Designers
- UI Designers
- Frontend Developers
- Product Designers
- AI Agents

---

# 1. Purpose

This document defines the motion language used throughout the Phone Store Frontend.

Motion should communicate

- Context
- Navigation
- Relationship
- Feedback
- Focus
- Continuity

Motion is a communication tool.

It is not decoration.

---

# 2. Motion Philosophy

Motion should

Guide

↓

Explain

↓

Focus

↓

Confirm

↓

Reduce Cognitive Load

Users should understand interface changes naturally.

---

# 3. Core Principles

Every motion must be

Meaningful

↓

Natural

↓

Consistent

↓

Accessible

↓

Fast

If motion has no purpose, remove it.

---

# 4. Motion Hierarchy

Micro Motion

↓

Component Motion

↓

Layout Motion

↓

Navigation Motion

↓

Page Motion

↓

Application Motion

Higher-level motion should occur less frequently.

---

# 5. User Attention

Motion directs user attention.

Priority

Primary Action

↓

New Content

↓

Validation

↓

Notifications

↓

Background Updates

Never animate everything simultaneously.

---

# 6. Spatial Continuity

Elements should appear to come from somewhere.

Examples

Dropdown

↓

Originates from button

Modal

↓

Originates from page center

Drawer

↓

Originates from screen edge

Tooltip

↓

Originates from trigger

Users should understand spatial relationships.

---

# 7. Navigation Motion

Moving between pages should preserve orientation.

Preferred

Fade

↓

Slide

↓

Content Transition

Avoid disorienting animations.

---

# 8. Hierarchy Motion

Large Layout

↓

Small Component

↓

Single Element

Large structural changes should animate before small details.

---

# 9. Cause and Effect

Every motion should have a clear trigger.

User Click

↓

Button Feedback

↓

Loading

↓

Success

↓

Result

Motion without interaction creates confusion.

---

# 10. User Feedback

Motion confirms

Click

Save

Delete

Upload

Download

Payment

Login

Every important interaction deserves visual feedback.

---

# 11. Loading Motion

Short Tasks

Spinner

Medium Tasks

Skeleton

Long Tasks

Progress Indicator

Never leave users uncertain.

---

# 12. Focus Motion

When focus changes

Scroll if necessary

Highlight target

Reveal hidden content

Avoid excessive movement.

---

# 13. Error Motion

Errors should attract attention.

Examples

Shake

↓

Highlight

↓

Focus Input

↓

Explain Error

Motion should guide correction.

---

# 14. Success Motion

Success should feel satisfying.

Examples

Checkmark

↓

Fade

↓

Subtle Scale

↓

Notification

Keep celebrations brief.

---

# 15. Empty States

Motion should encourage action.

Illustration

↓

Fade

↓

Primary Action

↓

Guidance

Never leave empty screens lifeless.

---

# 16. Progressive Disclosure

Reveal information gradually.

Basic Information

↓

Advanced Options

↓

Expert Settings

Avoid overwhelming users.

---

# 17. Expansion

Expandable content should

Grow naturally

↓

Preserve nearby layout

↓

Avoid sudden jumps

Examples

Accordion

FAQ

Filters

Product Specifications

---

# 18. Collection Motion

Lists

Grids

Tables

Search Results

Items should enter consistently.

Avoid random stagger timings.

---

# 19. Checkout Flow

Cart

↓

Shipping

↓

Payment

↓

Review

↓

Confirmation

Motion reinforces progress.

---

# 20. Authentication Flow

Login

↓

Verification

↓

Success

↓

Dashboard

Transitions should reassure users.

---

# 21. Product Browsing

Category

↓

Product Grid

↓

Product Detail

↓

Gallery

↓

Zoom

Every transition should maintain context.

---

# 22. Responsive Motion

Desktop

Rich Motion

Tablet

Reduced Motion

Mobile

Efficient Motion

Respect limited screen space.

---

# 23. Accessibility

Support

prefers-reduced-motion

Users may disable motion.

Critical information must remain visible without animation.

---

# 24. Motion Tokens

Use predefined tokens

motion-enter

motion-exit

motion-hover

motion-focus

motion-overlay

motion-loading

Never invent custom patterns.

---

# 25. Performance

Motion should use

Transform

Opacity

Avoid

Width

Height

Margin

Padding

Top

Left

Maintain 60 FPS whenever possible.

---

# 26. Consistency

Buttons behave identically.

Dialogs behave identically.

Dropdowns behave identically.

Consistency reduces learning effort.

---

# 27. Emotional Design

Motion should feel

Professional

↓

Modern

↓

Confident

↓

Helpful

Avoid playful motion in enterprise workflows.

---

# 28. Dark Mode

Motion behavior remains unchanged.

Only colors and shadows adapt.

Interaction patterns remain identical.

---

# 29. AI Agent Rules

Generated interfaces MUST

Use approved motion patterns

Maintain navigation continuity

Support reduced motion

Avoid unnecessary movement

Follow motion hierarchy

Respect accessibility

---

# 30. Best Practices

✔ Motion has purpose

✔ Guide user attention

✔ Reinforce navigation

✔ Confirm actions

✔ Preserve context

✔ Support accessibility

✔ Maintain consistency

---

# 31. Anti Patterns

❌ Decorative motion

❌ Infinite movement

❌ Flashing elements

❌ Random transitions

❌ Motion without interaction

❌ Excessive scaling

❌ Delayed feedback

❌ Motion overload

---

# 32. Review Checklist

Before Release

✓ Motion communicates purpose

✓ Navigation remains understandable

✓ Reduced motion supported

✓ Motion tokens used

✓ Performance verified

✓ Consistent interaction

✓ Accessible experience

✓ No distracting effects

---

# 33. Future Evolution

Prepared for

Shared Element Transitions

View Transitions API

Gesture Navigation

Adaptive Motion

Spatial Computing

Foldable Devices

AI-generated Motion Systems

---

# Summary

The Phone Store Frontend motion system establishes a unified motion language that guides users, reinforces navigation, communicates relationships, and improves usability.

Motion should always have purpose, preserve spatial continuity, support accessibility, and strengthen the overall user experience without becoming a distraction.