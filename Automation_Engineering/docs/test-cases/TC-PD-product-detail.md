# TC-PD — Product Detail Page

**Suite file:** [`tests/product-detail.spec.js`](../../tests/product-detail.spec.js)
**Page Object:** [`pages/ProductDetailPage.js`](../../pages/ProductDetailPage.js)
**Helper:** `parsePriceEur` from [`utils/helpers.js`](../../utils/helpers.js)
**Test data:** `PRODUCTS.oilFilter` from [`utils/testData.js`](../../utils/testData.js)

**Pre-condition (beforeEach):** Navigate directly to the Oil Filter product page and accept cookies.

| Constant | Value |
|---|---|
| `PRODUCT.slug` | `04e115561ac-oil-filter-1-0mpi-1-0tsi-1-5tsi-skoda-19639.html` |
| `PRODUCT.title` | `"Oil Filter 1.0MPI, 1.0TSI - 1.5TSI"` |
| `PRODUCT.partNumber` | `"04E 115 561 AC"` |
| `PRODUCT.minAlternatives` | `4` |

**URL under test:** `/spare-part/04e115561ac-oil-filter-1-0mpi-1-0tsi-1-5tsi-skoda-19639.html`

---

## TC-PD-01 — Page title contains product name

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Smoke |

**Steps**
1. Open the Oil Filter product page.
2. Read the browser tab title.

**Expected result**
Title matches the pattern `/Oil Filter/i` (first word of `PRODUCT.title`).

**Assertion**
```js
await expect(page).toHaveTitle(new RegExp(PRODUCT.title.split(' ')[0], 'i'));
```

---

## TC-PD-02 — H1 heading is visible and contains product name

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Smoke |

**Steps**
1. Open the product page.
2. Locate the `<h1>` element.

**Expected result**
- `<h1>` is visible.
- Text contains `"Oil Filter 1.0MPI, 1.0TSI - 1.5TSI"`.

**Assertion**
```js
await expect(detail.heading).toBeVisible();
expect(text).toContain(PRODUCT.title);
```

---

## TC-PD-03 — Škoda part number is displayed correctly

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Functional |

**Steps**
1. Open the product page.
2. Locate the list under "Škoda part number:".
3. Collect all listed part numbers.

**Expected result**
- At least **1** part number is listed.
- The list includes `"04E 115 561 AC"`.

**Assertion**
```js
expect(partNums.length).toBeGreaterThan(0);
expect(partNums).toContain(PRODUCT.partNumber);
```

---

## TC-PD-04 — Price is visible and is a positive EUR value

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Functional |

**Steps**
1. Open the product page.
2. Locate the price element.
3. Parse its text to a float.

**Expected result**
- Price element is visible.
- Text contains `"€"`.
- Parsed numeric value is `> 0`.

**Assertion**
```js
expect(priceText).toMatch(/€/);
expect(value).toBeGreaterThan(0);
```

---

## TC-PD-05 — Stock status is shown on the page

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Functional |

**Steps**
1. Open the product page.
2. Look for any element with text matching `/In Stock|IN STOCK|in stock/`.

**Expected result**
At least one stock-status element is visible.

**Assertion**
```js
await expect(stockLocator).toBeVisible();
```

---

## TC-PD-06 — Buy button is visible and enabled

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Smoke |

**Steps**
1. Open the product page.
2. Locate the **Buy** button.

**Expected result**
- Button is visible.
- Button is not disabled.

**Assertion**
```js
await expect(detail.buyBtn).toBeVisible();
await expect(detail.buyBtn).toBeEnabled();
```

---

## TC-PD-07 — Alternative parts section lists at least the expected count

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Functional |

**Steps**
1. Open the product page.
2. Count anchor links inside the "Alternative parts" section.

**Expected result**
At least **4** alternatives are listed (e.g. China, EU, Filtron, Bosch, Mann).

**Assertion**
```js
expect(altCount).toBeGreaterThanOrEqual(PRODUCT.minAlternatives);
```

---

## TC-PD-08 — "You will also need" cross-sell block is present

| Field | Value |
|---|---|
| **Priority** | Low |
| **Type** | Content |

**Steps**
1. Open the product page.
2. Count anchor links inside the "You will also need" section.

**Expected result**
At least **1** cross-sell item is present (e.g. drain plug screw).

**Assertion**
```js
expect(crossSellCount).toBeGreaterThanOrEqual(1);
```

---

## TC-PD-09 — Quantity field defaults to 1

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | UI State |

**Steps**
1. Open the product page.
2. Read the value of the quantity `<input>`.

**Expected result**
The quantity input is visible and its value is `"1"`.

**Assertion**
```js
await expect(detail.qtyInput).toBeVisible();
expect(value).toBe('1');
```

---

## TC-PD-10 — Qty "+" button increments the quantity field

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Functional |

**Steps**
1. Open the product page.
2. Click the **"+"** stepper button once.
3. Read the quantity input value.

**Expected result**
Quantity input value is `≥ 2` (incremented from the default of 1).

**Assertion**
```js
expect(Number(value)).toBeGreaterThanOrEqual(2);
```
