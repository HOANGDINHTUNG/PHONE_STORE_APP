# docs/design-system/typography.md

Version: 1.0

Status: Production Ready

Audience

- UI Designers
- Frontend Developers
- UX Designers
- Design System Engineers
- AI Agents

---

# 1. Purpose

Typography defines how information is presented across the Phone Store Frontend.

A well-designed typography system improves

- Readability
- Accessibility
- Visual hierarchy
- User experience
- Consistency
- Scalability

Typography should communicate structure before color.

---

# 2. Typography Philosophy

Typography follows

Consistency

↓

Hierarchy

↓

Readability

↓

Accessibility

↓

Responsiveness

↓

Maintainability

Every text element must belong to a predefined typography style.

Never invent font sizes.

---

# 3. Font Family

Primary Font

Inter

Fallback

system-ui

Segoe UI

Roboto

Helvetica Neue

Arial

sans-serif

Monospace

JetBrains Mono

Fallback

Consolas

monospace

---

# 4. Font Loading Strategy

Fonts should

Preload

↓

Cache

↓

Display Immediately

↓

Fallback Gracefully

Use

font-display: swap

Avoid blocking rendering.

---

# 5. Font Weights

100

Thin

200

Extra Light

300

Light

400

Regular

500

Medium

600

Semi Bold

700

Bold

800

Extra Bold

900

Black

Recommended

Body

400

Titles

600

Buttons

500

Numbers

700

---

# 6. Font Sizes

xs

12px

sm

14px

base

16px

lg

18px

xl

20px

2xl

24px

3xl

30px

4xl

36px

5xl

48px

6xl

60px

Never use arbitrary font sizes.

---

# 7. Line Height

Text should breathe.

Recommended

Heading

1.2

Body

1.5

Description

1.6

Large Paragraph

1.8

Avoid cramped text.

---

# 8. Letter Spacing

Headings

Slightly Tight

Body

Normal

Uppercase Labels

Slightly Wide

Never exaggerate tracking.

---

# 9. Text Hierarchy

Display

↓

Heading

↓

Subheading

↓

Title

↓

Body

↓

Caption

↓

Label

↓

Helper Text

Users should immediately recognize importance.

---

# 10. Display Text

Used for

Landing Pages

Hero Banner

Marketing

Empty States

Large Promotions

Avoid using inside forms.

---

# 11. Heading Levels

H1

Page Title

H2

Section

H3

Subsection

H4

Component Title

H5

Card Header

H6

Small Header

Only one H1 per page.

---

# 12. Body Text

Default Reading Size

16px

Purpose

Product Description

Blog

Policy

Documentation

General Content

---

# 13. Caption

Used for

Metadata

Dates

Small Notes

Hints

Image Description

Captions should never replace body text.

---

# 14. Labels

Labels identify

Inputs

Buttons

Dropdowns

Checkboxes

Radio Groups

Every interactive element requires a visible label.

---

# 15. Buttons

Button text

Medium Weight

Centered

Readable

Never use tiny fonts.

---

# 16. Form Typography

Input

16px

Placeholder

Muted

Helper Text

Small

Validation

Small

Readable on mobile devices.

---

# 17. Table Typography

Header

Semi Bold

Body

Regular

Numbers

Tabular Alignment

Descriptions

Muted

---

# 18. Card Typography

Product Name

Heading

Price

Bold

Description

Body

Badge

Label

Card typography must remain compact.

---

# 19. Navigation Typography

Navigation should prioritize clarity.

Desktop

Medium

Mobile

Regular

Active Item

Semi Bold

---

# 20. Number Formatting

Prices

Bold

Ratings

Medium

Statistics

Bold

Large Numbers

Tabular Figures

Ensure digits align vertically.

---

# 21. Responsive Typography

Desktop

↓

Tablet

↓

Mobile

Typography scales smoothly.

Avoid fixed pixel assumptions.

---

# 22. Accessibility

Minimum Size

Body

16px

Minimum Contrast

WCAG AA

Never rely solely on font weight to indicate meaning.

---

# 23. Internationalization

Typography should support

Vietnamese

English

Japanese

Chinese

Korean

Special characters must render correctly.

---

# 24. Dark Mode

Typography colors adapt to theme.

Hierarchy remains unchanged.

Contrast always preserved.

---

# 25. Code Typography

Use Monospace

Examples

API

JSON

TypeScript

Shell Commands

Logs

Never use proportional fonts for code.

---

# 26. Truncation Rules

Use truncation only when necessary.

One Line

Product Name

Two Lines

Card Description

Unlimited

Documentation

Avoid excessive ellipsis.

---

# 27. AI Agent Rules

AI-generated UI MUST

Use predefined typography tokens

Never hardcode font sizes

Maintain hierarchy

Support responsive scaling

Respect accessibility

Reuse design system styles

---

# 28. Best Practices

✔ Consistent hierarchy

✔ Readable spacing

✔ Responsive scaling

✔ Accessible contrast

✔ Semantic headings

✔ Limited font weights

✔ Reusable tokens

---

# 29. Anti Patterns

❌ Random font sizes

❌ Too many font weights

❌ All uppercase paragraphs

❌ Tiny mobile text

❌ Decorative fonts

❌ Hardcoded styles

❌ Inconsistent headings

❌ Poor contrast

---

# 30. Typography Tokens

Never use raw CSS values.

Preferred Tokens

text-display

text-h1

text-h2

text-h3

text-title

text-body

text-caption

text-label

text-helper

Every component references tokens instead of direct values.

---

# 31. Component Mapping

Hero

↓

Display

Page Title

↓

H1

Section

↓

H2

Card Title

↓

H4

Body

↓

Body

Caption

↓

Caption

Input

↓

Label

Helper

↓

Helper Text

---

# 32. Checklist

Before Release

✓ Typography tokens used

✓ Correct heading hierarchy

✓ Responsive scaling verified

✓ WCAG AA compliant

✓ Mobile readability confirmed

✓ No hardcoded font sizes

✓ Code blocks use monospace

✓ International fonts render correctly

---

# 33. Future Evolution

Prepared for

Fluid Typography

Variable Fonts

Adaptive Typography

Accessibility Scaling

High Contrast Mode

Custom Brand Themes

AI-assisted Typography Optimization

---

# Summary

The Phone Store Frontend typography system is built around

- Design Tokens
- Consistent Hierarchy
- Responsive Scaling
- Accessibility
- Semantic Structure
- Internationalization

Every text element should use predefined typography tokens to maintain consistency, readability, and scalability across the application.