# Checkout Feature — Observations
**Scope:** Cart page → Order page → Submission flow

---

## OBS-C01 — No Explicit Consent Checkbox Before Order Submission
The order page displays this text just above the "Order now" button:
> *"By placing an order, you agree with our Terms and Conditions and with our Personal Data Processing Policy."*
There is no checkbox the user must tick. Consent is assumed the moment they click "Order now."

### Suggested Fix
A mandatory checkbox that the user must explicitly tick before the "Order now" button becomes active, for example:
> ☐ *I have read and agree to the Terms and Conditions and Personal Data Processing Policy.*

**Risk: Medium — Legal/Compliance**

---

## OBS-C02 — Checkout Button Appears Briefly and Is Hard to Click
On the product detail page, the "Buy" / add-to-cart button and the checkout action share proximity or the checkout button appears momentarily after adding an item, making it easy to accidentally click "Buy" again instead of proceeding to checkout. This can silently increase the item quantity.

### Suggested Fix
The post-add confirmation state should remain visible until the user takes a deliberate action (navigating away or dismissing). The "View cart / Checkout" button should be a stable, clearly distinct element that does not disappear quickly.

**Risk: Medium — Usability / Unintended purchases**

---

## OBS-C03 — Orders Allowed for Items with Unknown Availability
An item in the cart shows a **blank availability cell** — no "In Stock" badge, no "Out of Stock" message, no "Currently unavailable" warning. The user can proceed to checkout and place an order for this item without any indication of whether it can be fulfilled.

### Expected
- Unknown availability should be explicitly labelled (e.g. "Availability unknown" or "Currently unavailable")
- On the order page, availability should remain visible in the cart summary so users have full information at the point of decision
- Ideally, if availability is unknown, a warning banner should appear before the user can submit: *"One or more items in your cart has unknown availability. Your order may be delayed."*

### Suggested Fix
Replace blank availability with an explicit status. Offer a "Notify me when available" option as an alternative to blind ordering for unknown-stock items.

**Risk: Medium — Order fulfilment trust / Customer expectations**

---

## OBS-C04 — Validation Errors Only Appear After Full Page Reload to a New URL
When the user clicks "Order now" without filling in the required fields, the form does **not** validate inline. Instead, the browser navigates to a new URL (`/order/send.html`) and the full page reloads, showing all errors in a single red block at the top.
All field values the user had entered are **preserved** (the form re-renders with data). However, the navigation interrupts the experience and the error message is disconnected from the fields it refers to — there is no inline highlighting, no red border on empty fields, no scroll to the first error.

### Suggested Fix
- Validation should fire **inline**, before any navigation, highlighting the first invalid field and scrolling to it
- Each field should show its own error message immediately below it (e.g. *"Name is required"*)
- The "Order now" button should remain on the same page — no URL change should occur for a failed submission

**Additional note:** The error message contains two typos:
- *"fill in you ZIP code"* → should be *"fill in your ZIP code"*
- *"enter you e-mail address"* → should be *"enter your e-mail address"*

**Risk: High — Checkout abandonment / UX**

---

## OBS-C05 — Payment Method Is Required But Hidden Until Delivery Is Selected
The validation error message explicitly requires the user to "choose a payment option." However, the Payment section is **never visible** on the order page in its default state. It only appears after the user selects a country AND then selects a delivery method. Users who proceed without first choosing a country have no indication that a payment step even exists.

### Suggested Fix
- The payment section should be visible from the beginning, even if greyed-out or locked until delivery is chosen, so users know it exists
- Alternatively, a clear step indicator at the top of the page should show the user where they are: **Step 1: Details → Step 2: Delivery → Step 3: Payment → Confirm**
- The validation error "choose a payment option" should not appear for steps the user was never shown

### Why It Matters
A user who fills in all contact/address fields and clicks "Order now" receives an error for a step they were never shown. This is a **hidden requirement** — the form asks for something it never displayed. This is confusing and breaks user trust.

The total sequence a user must discover by trial and error is:
1. Fill in address → 2. Select country (delivery appears) → 3. Select delivery type (payment appears) → 4. Select payment → 5. Order now

None of this progression is communicated to the user upfront.

**Risk: High — Checkout abandonment / Discoverability**