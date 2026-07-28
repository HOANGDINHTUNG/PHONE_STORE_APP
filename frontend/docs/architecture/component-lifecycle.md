# docs/architecture/component-lifecycle.md

Version: 1.0

Status: Production Ready

Audience

- Frontend Developers
- Software Architects
- AI Agents
- Code Reviewers

---

# 1. Purpose

This document defines the complete lifecycle of every React component used inside the Phone Store Frontend.

It explains

- How a component is born
- How it renders
- How it updates
- How it communicates
- How it is destroyed
- How React 19 optimizes rendering
- Best practices
- Common mistakes

Every component inside this project MUST follow these lifecycle rules.

---

# 2. React Component Lifecycle

Although React Hooks replaced lifecycle methods, every component still has a lifecycle.

The lifecycle contains six major phases.

Initialization

↓

Rendering

↓

Commit

↓

Interaction

↓

Updating

↓

Unmounting

---

# 3. Initialization Phase

A component starts when React decides it should appear.

Example

User opens

/products

↓

Router matches

↓

ProductPage created

↓

Child components created

↓

Render begins

Nothing is displayed yet.

---

# 4. Rendering Phase

React executes every component function.

Example

function ProductCard(){

...

return (...)

}

Rendering means

Executing JavaScript

NOT

Updating the DOM.

This distinction is extremely important.

---

# 5. Virtual DOM

React creates

Virtual DOM

↓

Compare

↓

Previous Tree

↓

Next Tree

↓

Find Difference

↓

Commit Changes

Never assume every render updates the browser.

Most renders never touch the DOM.

---

# 6. Commit Phase

Only after React finishes reconciliation.

React updates

DOM

↓

Attributes

↓

Text

↓

Events

↓

Refs

Now users can see the UI.

---

# 7. Browser Paint

After commit

Browser paints pixels.

Screen becomes visible.

Heavy synchronous work before paint causes

Slow UI

Jank

Poor UX

---

# 8. User Interaction

User

↓

Click

↓

Keyboard

↓

Touch

↓

Input

↓

Scroll

↓

Hover

↓

Drag

↓

Drop

These interactions trigger updates.

---

# 9. Update Phase

A component updates when

Props change

State changes

Context changes

Query updates

Parent renders

Theme changes

Language changes

Route changes

Not every render causes DOM changes.

---

# 10. Unmount Phase

Component removed.

Examples

Leave page

Close dialog

Delete item

Logout

Cleanup happens here.

---

# 11. Complete Lifecycle

Route

↓

Component Created

↓

Render

↓

Virtual DOM

↓

Commit

↓

Paint

↓

Interaction

↓

Update

↓

Render Again

↓

Commit

↓

Unmount

↓

Cleanup

---

# 12. Component Creation Rules

A component must

Have one responsibility

Receive data through props

Avoid side effects

Remain predictable

Support testing

Never fetch API directly inside presentational components.

---

# 13. Render Function

Render must be

Pure

Deterministic

Fast

Given identical props

↓

Produce identical UI.

Never mutate external state.

---

# 14. Pure Components

Good

Price

↓

UI only

Bad

Price

↓

Fetch API

↓

Write Local Storage

↓

Navigate

Rendering should never perform side effects.

---

# 15. Re-render

Re-render is normal.

It is NOT a bug.

Example

Theme changes

↓

Button renders again

This is expected.

Only unnecessary renders should be optimized.

---

# 16. Why Components Re-render

React re-renders because

State changed

Props changed

Context changed

Parent rendered

Query updated

Never blame React.

Understand why it happened.

---

# 17. Parent Render

Parent

↓

Child

↓

Child

↓

Child

Every child executes again unless optimized.

React Compiler reduces unnecessary work.

---

# 18. Props

Props are read-only.

Component never changes props.

Parent owns props.

---

# 19. State

State belongs only to its owner.

Example

ProductGallery

owns

Selected Image

Other components receive it through props.

---

# 20. Component Communication

Preferred direction

Parent

↓

Child

Avoid

Child controlling parent.

Use callback functions instead.

---

# 21. Effects

Effects synchronize with external systems.

Examples

API

Timer

Socket

DOM

Browser

Analytics

Do NOT use Effect for ordinary calculations.

---

# 22. Cleanup

Every effect that subscribes must unsubscribe.

Examples

removeEventListener

clearTimeout

clearInterval

socket.close()

observer.disconnect()

Failure causes memory leaks.

---

# 23. Refs

Refs store mutable values.

Use for

DOM

Focus

Scroll

Measurements

Animation

Never use Ref as hidden state.

---

# 24. Conditional Rendering

Good

Loading

↓

Skeleton

↓

Content

↓

Empty

↓

Error

Each state clearly separated.

Avoid nested ternary operators.

---

# 25. Component Tree

App

↓

Layout

↓

Product Page

↓

Gallery

↓

Image

↓

Price

↓

Review

↓

Recommendation

Every component should remain independent.

---

# 26. AI Agent Rules

When generating a component

AI MUST

Keep render pure

Separate business logic

Avoid side effects

Prefer composition

Avoid unnecessary state

Add cleanup

Respect lifecycle

---

# 27. Anti Patterns

❌ API inside render

❌ State mutation

❌ Props mutation

❌ Infinite useEffect

❌ DOM manipulation

❌ Hidden side effects

❌ Large components

❌ Deep prop drilling without reason

---

# 28. Checklist

Before merging

✓ Render is pure

✓ Cleanup exists

✓ State ownership correct

✓ Props immutable

✓ No unnecessary effects

✓ No memory leaks

✓ Easy to test

✓ Easy to reuse

---

# Part 1 Complete

The next section will cover

- React Compiler Lifecycle
- Memoization Strategy
- useMemo
- useCallback
- useRef Advanced
- useEffect Deep Dive
- useLayoutEffect
- useInsertionEffect
- Suspense Lifecycle
- Error Boundary Lifecycle
- Concurrent Rendering
- Transition
- Deferred Rendering
- Hydration
- Server Components
- Performance Optimization
- Debugging Lifecycle
- Enterprise Best Practices
