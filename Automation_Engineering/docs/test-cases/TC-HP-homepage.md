# TC-HP — Homepage

**Suite file:** [`tests/homepage.spec.js`](../../tests/homepage.spec.js)
**Page Object:** [`pages/HomePage.js`](../../pages/HomePage.js)
**Pre-condition (beforeEach):** Navigate to `/online-store.html` and accept the cookie banner.

---

## TC-HP-01 — Page title contains "Škoda spare parts"

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Smoke |
| **URL under test** | `https://www.skoda-parts.com/online-store.html` |

**Steps**
1. Open the store homepage.

**Expected result**
The browser tab title matches the pattern `/Škoda spare parts/i`.

**Assertion**
```js
await expect(page).toHaveTitle(/Škoda spare parts/i);
```

---

## TC-HP-02 — H1 heading is visible on homepage

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Smoke |

**Steps**
1. Open the store homepage.
2. Locate the `<h1>` element.

**Expected result**
- The `<h1>` is visible in the viewport.
- Its text (lowercased) contains `"skoda-parts"`.

**Assertion**
```js
await expect(home.pageHeading).toBeVisible();
expect(text.toLowerCase()).toContain('skoda-parts');
```

---

## TC-HP-03 — Model grid shows at least 20 car models

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Functional |

**Steps**
1. Open the store homepage.
2. Count all anchor links inside the "Škoda spare parts by model" grid.

**Expected result**
At least **20** model links are rendered (the site lists 26 models).

**Assertion**
```js
expect(count).toBeGreaterThanOrEqual(20);
```

---

## TC-HP-04 — Primary navigation links are visible and have correct hrefs

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Functional |

**Steps**
1. Open the store homepage.
2. Inspect the three top-nav links: **Store**, **Shipping and Delivery**, **Contact**.

**Expected result**
- All three links are visible.
- `Store` href contains `online-store`.
- `Shipping and Delivery` href contains `delivery`.
- `Contact` href contains `contact`.

**Assertion**
```js
await expect(home.navStore).toHaveAttribute('href', /online-store/);
await expect(home.navShipping).toHaveAttribute('href', /delivery/);
await expect(home.navContact).toHaveAttribute('href', /contact/);
```

---

## TC-HP-05 — Shopping cart widget shows "empty" on fresh visit

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Functional |

**Steps**
1. Open the store homepage in a new browser context (no cookies, no session).
2. Read the cart widget text.

**Expected result**
Cart widget text (lowercased) contains `"empty"`.

**Assertion**
```js
expect(cartText.toLowerCase()).toContain('empty');
```

---

## TC-HP-06 — "Why shop with us" section has at least 5 trust points

| Field | Value |
|---|---|
| **Priority** | Low |
| **Type** | Content |

**Steps**
1. Open the store homepage.
2. Count `<li>` elements inside the "Why shop with us" list.

**Expected result**
At least **5** trust points are rendered (e.g. Low prices, Fast delivery…).

**Assertion**
```js
expect(count).toBeGreaterThanOrEqual(5);
```

---

## TC-HP-07 — Service interval parts quick-links are present

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Content |

**Steps**
1. Open the store homepage.
2. Count anchor links inside the "Service interval parts" section.

**Expected result**
At least **5** category links are present (Filters, Oils, Wipers, Bulbs, etc.).

**Assertion**
```js
expect(count).toBeGreaterThanOrEqual(5);
```
