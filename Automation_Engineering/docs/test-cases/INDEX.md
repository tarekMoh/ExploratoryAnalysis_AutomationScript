# Test Case Index — skoda-parts.com Automation Suite

**Site under test:** https://www.skoda-parts.com
**Framework:** Playwright (JavaScript) · Page Object Model
**Total automated checks:** 34

---

## Suites

| Suite | File | Checks | Coverage area |
|---|---|:---:|---|
| [TC-HP — Homepage](TC-HP-homepage.md) | `tests/homepage.spec.js` | 7 | Page title, model grid, nav links, cart widget, trust section |
| [TC-SR — Search](TC-SR-search.md) | `tests/search.spec.js` | 5 | Keyword search, model-filtered search, no-results path |
| [TC-CB — Catalog Browse](TC-CB-catalog-browse.md) | `tests/catalog-browse.spec.js` | 7 | Model catalog, category listing, pagination, model switching |
| [TC-PD — Product Detail](TC-PD-product-detail.md) | `tests/product-detail.spec.js` | 10 | Title, part number, price, stock, buy button, alternatives, qty stepper |
| [TC-CA — Shopping Cart](TC-CA-cart.md) | `tests/cart.spec.js` | 5 | Empty state, add to cart, quantity, cart page reflection |

---

## All Test Cases

### TC-HP — Homepage

| ID | Title | Priority | Type |
|---|---|---|---|
| TC-HP-01 | Page title contains "Škoda spare parts" | High | Smoke |
| TC-HP-02 | H1 heading is visible on homepage | High | Smoke |
| TC-HP-03 | Model grid shows at least 20 car models | High | Functional |
| TC-HP-04 | Primary navigation links are visible and have correct hrefs | High | Functional |
| TC-HP-05 | Shopping cart widget shows "empty" on fresh visit | Medium | Functional |
| TC-HP-06 | "Why shop with us" section has at least 5 trust points | Low | Content |
| TC-HP-07 | Service interval parts quick-links are present | Medium | Content |

### TC-SR — Search

| ID | Title | Priority | Type |
|---|---|---|---|
| TC-SR-01 | Keyword search returns at least one result | High | Smoke |
| TC-SR-02 | Search results contain the search keyword in titles | High | Functional |
| TC-SR-03 | Model-filtered search scopes results to selected model | High | Functional |
| TC-SR-04 | Selecting a model from dropdown navigates to that model catalog | Medium | Functional |
| TC-SR-05 | Nonsense search query surfaces no-results feedback | Medium | Negative |

### TC-CB — Catalog Browse

| ID | Title | Priority | Type |
|---|---|---|---|
| TC-CB-01 | Octavia 3 model page loads with correct heading | High | Smoke |
| TC-CB-02 | Model catalog lists both service and spare part categories | High | Functional |
| TC-CB-03 | Navigating into Filters category shows product listing | High | Functional |
| TC-CB-04 | Product listing page shows pagination info | Medium | Functional |
| TC-CB-05 | Clicking a product card from listing navigates to detail page | High | Functional |
| TC-CB-06 | Model dropdown on catalog page reflects correct selected model | Medium | UI State |
| TC-CB-07 | Changing model dropdown navigates to new model catalog | Medium | Functional |

### TC-PD — Product Detail Page

| ID | Title | Priority | Type |
|---|---|---|---|
| TC-PD-01 | Page title contains product name | High | Smoke |
| TC-PD-02 | H1 heading is visible and contains product name | High | Smoke |
| TC-PD-03 | Škoda part number is displayed correctly | High | Functional |
| TC-PD-04 | Price is visible and is a positive EUR value | High | Functional |
| TC-PD-05 | Stock status is shown on the page | High | Functional |
| TC-PD-06 | Buy button is visible and enabled | High | Smoke |
| TC-PD-07 | Alternative parts section lists at least the expected count | Medium | Functional |
| TC-PD-08 | "You will also need" cross-sell block is present | Low | Content |
| TC-PD-09 | Quantity field defaults to 1 | Medium | UI State |
| TC-PD-10 | Qty "+" button increments the quantity field | Medium | Functional |

### TC-CA — Shopping Cart

| ID | Title | Priority | Type |
|---|---|---|---|
| TC-CA-01 | Cart page loads and shows empty state on fresh session | High | Smoke |
| TC-CA-02 | Cart widget says "empty" before any item is added | High | Smoke |
| TC-CA-03 | Clicking Buy adds the product and updates the cart widget | High | Functional |
| TC-CA-04 | Cart page shows the added item after Buy | High | Functional |
| TC-CA-05 | Changing quantity to 2 before buying updates cart total | Medium | Functional |

---

## Priority Distribution

| Priority | Count |
|---|:---:|
| High | 21 |
| Medium | 10 |
| Low | 3 |

## Type Distribution

| Type | Count |
|---|:---:|
| Smoke | 8 |
| Functional | 21 |
| Negative | 1 |
| UI State | 2 |
| Content | 2 |
