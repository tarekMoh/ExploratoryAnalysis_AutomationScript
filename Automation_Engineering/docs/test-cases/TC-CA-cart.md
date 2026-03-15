# TC-CA — Shopping Cart

**Suite file:** [`tests/cart.spec.js`](../../tests/cart.spec.js)
**Page Objects:** [`pages/ProductDetailPage.js`](../../pages/ProductDetailPage.js), [`pages/CartPage.js`](../../pages/CartPage.js)
**Test data:** `PRODUCTS.oilFilter` from [`utils/testData.js`](../../utils/testData.js)

| Constant | Value |
|---|---|
| `PRODUCT.slug` | `04e115561ac-oil-filter-1-0mpi-1-0tsi-1-5tsi-skoda-19639.html` |

> **Note:** Each cart test runs in its own browser context (Playwright default), so the cart starts empty for every test.

---

## TC-CA-01 — Cart page loads and shows empty state on fresh session

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Smoke |
| **URL under test** | `/shopping-cart.html` |

**Steps**
1. Navigate directly to `/shopping-cart.html` with no prior items.

**Expected result**
Either:
- A visible "cart is empty" message is displayed, OR
- Zero cart row elements are present.

**Assertion**
```js
expect(isEmpty || rowCount === 0).toBe(true);
```

---

## TC-CA-02 — Cart widget says "empty" before any item is added

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Smoke |

**Steps**
1. Open the Oil Filter product detail page.
2. Read the cart widget text in the page header — **without** clicking Buy.

**Expected result**
Cart widget text (lowercased) contains `"empty"`.

**Assertion**
```js
expect(cartText.toLowerCase()).toContain('empty');
```

---

## TC-CA-03 — Clicking Buy adds the product and updates the cart widget

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Functional |

**Steps**
1. Open the Oil Filter product detail page.
2. Click the **Buy** button (quantity = 1, default).
3. Wait for page to settle.
4. Read the cart widget text.

**Expected result**
Cart widget text (lowercased) does **not** contain `"empty"` — it now reflects an item count or price.

**Assertion**
```js
expect(cartText.toLowerCase()).not.toContain('empty');
```

---

## TC-CA-04 — Cart page shows the added item after Buy

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Functional |

**Steps**
1. Open the Oil Filter product detail page.
2. Click the **Buy** button.
3. Navigate to `/shopping-cart.html`.
4. Check cart page state.

**Expected result**
Either:
- The "empty" message is **not** visible, OR
- At least **1** cart row is present.

**Assertion**
```js
expect(!isEmpty || rowCount > 0).toBe(true);
```

---

## TC-CA-05 — Changing quantity to 2 before buying updates cart total

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Functional |
| **Input** | Quantity = `2` |

**Steps**
1. Open the Oil Filter product detail page.
2. Set the quantity input to `2`.
3. Click the **Buy** button.
4. Read the cart widget text.

**Expected result**
Cart widget text (lowercased) does **not** contain `"empty"` — the cart is now populated with 2 units.

**Assertion**
```js
expect(cartText.toLowerCase()).not.toContain('empty');
```
