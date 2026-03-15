# TC-SR — Search

**Suite file:** [`tests/search.spec.js`](../../tests/search.spec.js)
**Page Objects:** [`pages/HomePage.js`](../../pages/HomePage.js), [`pages/SearchResultsPage.js`](../../pages/SearchResultsPage.js)
**Test data:** `SEARCH` constant in [`utils/testData.js`](../../utils/testData.js)
**Pre-condition (beforeEach):** Navigate to `/online-store.html` and accept the cookie banner.

| Constant | Value |
|---|---|
| `SEARCH.validKeyword` | `"oil filter"` |
| `SEARCH.modelKeyword` | `"air filter"` |
| `SEARCH.model` | `"Octavia 3"` |
| `SEARCH.noResultsQuery` | `"xyznonexistentpart12345"` |

---

## TC-SR-01 — Keyword search returns at least one result

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Smoke |

**Steps**
1. Open the homepage.
2. Enter `"oil filter"` in the search box.
3. Click **Search**.

**Expected result**
At least **1** product card (`h3 > a`) is displayed on the results page.

**Assertion**
```js
expect(count).toBeGreaterThan(0);
```

---

## TC-SR-02 — Search results contain the search keyword in titles

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Functional |

**Steps**
1. Open the homepage.
2. Search for `"oil filter"`.
3. Collect all result card titles.

**Expected result**
- Result list is non-empty.
- At least one title contains a word from the keyword (`"oil"` or `"filter"`).

**Assertion**
```js
const hasMatch = titles.some(t =>
  keyword.split(' ').some(word => t.toLowerCase().includes(word))
);
expect(hasMatch).toBe(true);
```

---

## TC-SR-03 — Model-filtered search scopes results to selected model

| Field | Value |
|---|---|
| **Priority** | High |
| **Type** | Functional |

**Steps**
1. Open the homepage.
2. Select **"Octavia 3"** from the model dropdown.
3. Enter `"air filter"` in the search box.
4. Click **Search**.

**Expected result**
- The resulting URL is not the bare homepage URL.
- At least **1** product card is displayed.

**Assertion**
```js
expect(currentUrl).not.toBe('https://www.skoda-parts.com/');
expect(count).toBeGreaterThan(0);
```

---

## TC-SR-04 — Selecting a model from dropdown navigates to that model catalog

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Functional |
| **Input** | Model dropdown → `"Fabia 3"` |

**Steps**
1. Open the homepage.
2. Select **"Fabia 3"** from the model dropdown (do not type a keyword).
3. Click **Search**.

**Expected result**
The browser URL contains `"fabia-3"`, confirming navigation to the Fabia 3 catalog.

**Assertion**
```js
expect(url).toContain('fabia-3');
```

---

## TC-SR-05 — Nonsense search query surfaces no-results feedback

| Field | Value |
|---|---|
| **Priority** | Medium |
| **Type** | Negative |
| **Input** | `"xyznonexistentpart12345"` |

**Steps**
1. Open the homepage.
2. Enter the nonsense string in the search box.
3. Click **Search**.

**Expected result**
Either:
- **0** product cards are rendered, OR
- A visible "no results" / "nothing found" message appears.

**Assertion**
```js
expect(count === 0 || noResultsVisible).toBe(true);
```
