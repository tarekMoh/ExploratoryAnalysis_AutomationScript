# Skoda-Parts.com – Playwright Test Automation Framework

A modular, maintainable end-to-end test suite for [skoda-parts.com](https://www.skoda-parts.com), built with [Playwright](https://playwright.dev) and the Page Object Model pattern.

---

## Project Structure

```
test_script/
├── package.json               # Dependencies and npm scripts
├── playwright.config.js       # Playwright configuration (reporters, timeouts, browser)
│
├── pages/                     # Page Object Models
│   ├── BasePage.js            # Shared selectors: nav bar, search, cart widget, cookies
│   ├── HomePage.js            # Store landing page – model grid, category links
│   ├── CatalogPage.js         # Model-level catalog (e.g. /catalog/octavia-3.html)
│   ├── ProductListPage.js     # Category listing pages with product cards
│   ├── ProductDetailPage.js   # Individual spare part page
│   ├── CartPage.js            # Shopping cart (/shopping-cart.html)
│   └── SearchResultsPage.js   # Search results wrapper
│
├── tests/                     # Test specifications (one file per domain area)
│   ├── homepage.spec.js       # 7 checks – title, model grid, nav, cart widget
│   ├── search.spec.js         # 5 checks – keyword search, model filter, no-results
│   ├── catalog-browse.spec.js # 7 checks – model → category → listing navigation
│   ├── product-detail.spec.js # 10 checks – title, part#, price, stock, buy, alternatives
│   └── cart.spec.js           # 5 checks – empty state, add to cart, qty update
│
├── utils/
│   ├── testData.js            # Centralised constants (models, products, search terms)
│   └── helpers.js             # Shared utilities: cookie accept, price parsing, screenshot
│
└── reporters/
    └── custom-html-reporter.js  # Custom reporter → reports/custom-summary.html
```

---

## Installation

**Prerequisites:** Node.js ≥ 18

```bash
cd C:\Testing\CV\test_script

# Install dependencies
npm install

# Install Playwright browsers (Chromium only needed)
npx playwright install chromium
```

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests headlessly, generate both reports |
| `npm run test:headed` | Run with visible browser window |
| `npm run test:debug` | Step-through debugger with Playwright Inspector |
| `npx playwright test tests/homepage.spec.js` | Run a single spec file |
| `npx playwright test --grep "TC-PD"` | Run tests matching a tag pattern |
| `npm run test:report` | Open the built-in Playwright HTML report |

After each run, two reports are written:

- **`reports/html/index.html`** – Playwright's built-in rich HTML report (includes screenshots, videos, traces)
- **`reports/custom-summary.html`** – Custom dark-theme summary with per-failure root cause analysis

---

## Coverage Strategy

### Automation Ideas (flow level)

**Navigation & Discovery**
- Homepage model grid renders all 20+ Škoda models
- Top navigation bar links (Store, Shipping, Contact) resolve correctly
- Breadcrumb trail updates as the user drills deeper into categories

**Search**
- Keyword search returns relevant results
- Model-scoped search narrows results to selected car line
- Searching a nonsense string surfaces an empty/no-results state
- Search dropdown pre-selects the correct model on catalog pages

**Catalog Browse**
- Model catalog page lists both Service and Spare part category groups
- Category link navigates to a subcategory listing (e.g. Filters → Oil Filter)
- Product listing shows correct item count and pagination metadata
- Switching model via dropdown re-navigates to the new model catalog

**Product Detail**
- OEM Škoda part number is displayed
- Price is shown in EUR, is numeric and positive
- Stock availability label is present
- Alternative parts (OE / aftermarket) are listed with price and availability
- "You will also need" cross-sell block appears
- Quantity stepper increments/decrements correctly

**Cart**
- Cart widget defaults to "empty" on a fresh session
- Adding a product via "Buy" updates the widget text immediately
- Cart page reflects added item(s)
- Adjusting quantity before Buy sends correct quantity to cart

**User Account (future)**
- Sign-up form validation (email format, required fields)
- Login with valid credentials and virtual garage access
- Chassis-number compatibility check after sign-in

**Footer / Static Pages**
- Terms & Conditions, Privacy Policy, Delivery pages load (HTTP 200)
- Newsletter subscription form accepts a valid email

---

## Tool & Architecture Rationale

### Why Playwright?
- Native support for Chromium/Firefox/WebKit with a single API
- Built-in auto-waits eliminate most explicit `waitForTimeout` calls
- First-class support for traces, screenshots, and video on failure
- Fast, parallel-capable test execution

### Why Page Object Model?
- Decouples selectors from test logic – one selector change, one file to edit
- `BasePage` captures cross-cutting site-wide elements (nav bar, cookie banner, cart widget) so every page object inherits them for free
- Test files read like plain English specifications

### Why a Custom Reporter?
Playwright's built-in HTML reporter is rich but generic. The custom reporter adds:
- **Root cause analysis** – maps Playwright error patterns (timeout, strict-mode violation, network error, assertion failure) to human-readable diagnoses and suggested fixes
- **Embedded failure screenshots** so reviewers see exactly what the browser showed at the moment of failure without hunting through the trace viewer
- **Dark-theme dashboard** with pass/fail/skip counts at a glance

### Why Centralised `testData.js`?
Skoda-parts.com is a real, live site. Prices, stock levels, and part numbers change. Keeping all magic strings in one place means a broken assertion can be fixed in seconds without touching test logic.

### Retry & Timeout Strategy
- `retries: 1` in `playwright.config.js` means a single transient network hiccup won't fail the build
- `workers: 1` avoids hammering a live e-commerce site with parallel sessions
- `actionTimeout: 10 s` / `navigationTimeout: 20 s` are generous enough for a real production site on a European CDN

---

## Reports

```
reports/
├── html/                  # Playwright HTML report (npx playwright show-report)
│   └── index.html
├── custom-summary.html    # Custom dark-theme report with RCA
├── screenshots/           # Manual evidence screenshots (helpers.screenshot())
└── test-results/          # Raw Playwright artefacts (traces, videos, screenshots)
```

> Failure screenshots are embedded directly in `custom-summary.html` for zero-click evidence review.
