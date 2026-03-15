# TC-CB — Catalog Browse

**Suite file:** [`tests/catalog-browse.spec.js`](../../tests/catalog-browse.spec.js)
**Page Objects:** [`pages/CatalogPage.js`](../../pages/CatalogPage.js), [`pages/ProductListPage.js`](../../pages/ProductListPage.js)
**Test data:** `MODELS`, `CATEGORIES` from [`utils/testData.js`](../../utils/testData.js)

| Constant | Value |
|---|---|
| `MODELS.octavia3.slug` | `"octavia-3"` |
| `MODELS.fabia3.name` | `"Fabia 3"` |
| `MODELS.fabia3.slug` | `"fabia-3"` |
| `CATEGORIES.filters.path` | `/catalog/octavia-3/service-interval-parts/filters-628.html` |
| `CATEGORIES.filters.minProducts` | `5` |

---

## TC-CB-01 — Octavia 3 model page loads with correct heading

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Smoke |
| **URL under test** | `/catalog/octavia-3.html` |

**Steps**
1. Navigate directly to the Octavia 3 catalog page.
2. Locate the `<h1>` heading.

**Expected result**
- `<h1>` is visible.
- Heading text (lowercased) contains `"octavia 3"`.

**Assertion**
```js
await expect(catalog.heading).toBeVisible();
expect(text.toLowerCase()).toContain('octavia 3');
```

---

## TC-CB-02 — Model catalog lists both service and spare part categories

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Functional |
| **URL under test** | `/catalog/octavia-3.html` |

**Steps**
1. Navigate to the Octavia 3 catalog page.
2. Count links under "Service interval parts".
3. Count links under "Spare parts".

**Expected result**
- Service interval parts: ≥ **5** links (Filters, Oils, Wipers, Bulbs, Timing Kits…).
- Spare parts: ≥ **8** links (Engine, Body, Brakes, Clutch…).

**Assertion**
```js
expect(serviceCount).toBeGreaterThanOrEqual(5);
expect(spareCount).toBeGreaterThanOrEqual(8);
```

---

## TC-CB-03 — Navigating into Filters category shows product listing

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Functional |
| **URL under test** | `/catalog/octavia-3/service-interval-parts/filters-628.html` |

**Steps**
1. Navigate directly to the Octavia 3 → Filters category page.
2. Count product cards (`h3 > a`).

**Expected result**
At least **5** product cards are rendered.

**Assertion**
```js
expect(count).toBeGreaterThanOrEqual(CATEGORIES.filters.minProducts);
```

---

## TC-CB-04 — Product listing page shows pagination info

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Functional |
| **URL under test** | `/catalog/octavia-3/service-interval-parts/filters-628.html` |

**Steps**
1. Navigate to the Octavia 3 → Filters category page.
2. Locate the pagination summary element.

**Expected result**
- Pagination info element is visible.
- Text matches the pattern `"Showing items"`.

**Assertion**
```js
await expect(listing.paginationInfo).toBeVisible();
expect(infoText).toMatch(/Showing items/i);
```

---

## TC-CB-05 — Clicking a product card from listing navigates to detail page

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Functional |
| **URL under test** | `/catalog/octavia-3/service-interval-parts/filters-628.html` |

**Steps**
1. Navigate to the Filters category listing page.
2. Click the **first** product card link.

**Expected result**
The browser URL contains `/spare-part/`, confirming arrival on a product detail page.

**Assertion**
```js
expect(currentUrl).toContain('/spare-part/');
```

---

## TC-CB-06 — Model dropdown on catalog page reflects correct selected model

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | UI State |
| **URL under test** | `/catalog/octavia-3.html` |

**Steps**
1. Navigate to the Octavia 3 catalog page.
2. Read the current value of the model filter `<select>`.

**Expected result**
The selected option value (lowercased) contains `"octavia 3"`.

**Assertion**
```js
expect(selected.toLowerCase()).toContain('octavia 3');
```

---

## TC-CB-07 — Changing model dropdown navigates to new model catalog

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Functional |
| **Input** | Change model dropdown from "Octavia 3" → "Fabia 3" |

**Steps**
1. Navigate to the Octavia 3 catalog page.
2. Select **"Fabia 3"** from the model dropdown.
3. Click **Search**.

**Expected result**
The browser URL contains `"fabia-3"`, confirming the model context has changed.

**Assertion**
```js
expect(page.url()).toContain(MODELS.fabia3.slug);
```
