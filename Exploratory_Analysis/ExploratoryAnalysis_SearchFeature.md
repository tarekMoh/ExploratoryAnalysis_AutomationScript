# Exploratory Analysis: skoda-parts.com
**Tester:** Exploratory Session  
**Features Explored:** Search Feature, Checkout Feature

---

## Prioritization Rationale

**Why Search first, then Checkout:**

For users with a known need, search is the primary entry point. It consumes the most traffic and has the largest amount of surface area (query input, model filter, autocomplete, empty states, results page) Defects at this point are felt by all users before they get a product. Checkout was prioritized second because it carries the most business risk — failures there directly block revenue and can erode customer trust. Since both features give you data risk and trust risk, with these two features we have the scope that makes for what I would consider the highest impact session.

Inside each feature, I prioritized boundary conditions and edge cases first(empty input, 0 quantity, invalid email etc).

---

## Observations

### Search Feature

**OBS-S01 — Empty search submits and returns the store homepage (ambiguous behavior)**  
The empty search field and clicking on the button did not direct us to any page. There are no validation messages such as "Please enter a search term." The problem with this page is that there are no guards. This is a minor problem.

### Severity
**Low**: Empty search input has no validation guard

### Suggested Fix


**OBS-S02 — Typeahead autocomplete activates on a single character**  
The autocomplete feature activates when the user enters a single character, "a," into the search field. This activates a rich autocomplete dropdown with product name suggestions and category links. The matching characters are highlighted in bold. This is a good feature, although it might be a problem for the backend to query all products with such a limited number of characters. No delay was observed, and it's not tested if there's a rate limit.

### Severity
**Low**: Autocomplete fires on single character — load risk

### Suggested Fix


**OBS-S03 — Search results are scoped to the selected car model**  
The model is pre-selected to "Octavia 3" from a previous session or by default. A user who owns a Fabia (or any other model) may not notice this, type their query, and receive a silently reduced set of results — without being told *why* results are fewer or that their search was filtered.

### Severity
**Medium**: affects discoverability and efficiency, especially for mobile users and users who rely on mouse-click rather than keyboard (Enter).

### Suggested Fix
Display a sticky, clearly visible banner or callout *in the search bar area* showing the active model with a quick-change link:
 [Filtering for: Octavia 3]    [Change car]
This persists above or beside the search field so users see it before they type, not after.

**OBS-S04 — Price range filter label is in Czech on an English-language page (localisation bug)**  
The filter label reads "cenové rozpětí" instead of "price range." This is a clear untranslated string — a low-severity but visible localisation defect.

### Severity
**Low**: Czech label "cenové rozpětí" on English page

### Suggested Fix

**OBS-S05 — No-results page offers a spare parts inquiry form**  
When a nonsense query is entered, the page shows a helpful fallback form allowing users to request the part manually (fields: Car model, Chassis type, Engine type, VIN, Name, Email, Phone, Requested spare part). This is a good recovery pattern. However, the Car model and Chassis type fields in the form are dropdowns that appear empty/unpopulated — it is unclear whether they are functional or decorative.

When a user searches for something that doesn't exist in the catalog, the site shows a **"no results" page**. Instead of just displaying an error, it offers a helpful fallback: a **Spare Parts Inquiry Form** where the user can manually describe the part they need, and the store staff will search for it and reply.

### Severity
**Medium**: The form exists, which is a good idea — but the interaction has several friction points that make it confusing and unreliable to complete.

### Suggested Fix
Auto-Populate from Context
Car model:             auto-fill with "Skoda Octavia 3" (from active session)
Requested spare part:  auto-fill with "xyznonexistentpart999" (from search query)
This requires only a few lines of JavaScript on page load. It saves the user the most time and reduces drop-off from the form.

**OBS-S06 — Query string embedded in URL path, not query parameter**  
The search URL pattern is `/spare-parts/octavia-3/brake%20pad.html` — the query is part of the path rather than a `?q=` parameter. This is an unusual convention. It means special characters in searches could produce malformed paths. It also raises SEO implications: every unique search creates a distinct URL that search engines might index.

### Severity - Medium: 
Query in URL path — special chars / SEO risk

### Suggested Fix


**OBS-S07 — Search Icon Requires Two Interactions on Mobile/Compact View
When site switches to a compact/mobile layout. In this layout, the search bar is **hidden by default** behind a magnifying glass icon. Clicking the icon. it only reveals the search bar and it is invisible to first-time users.

### Severity - Medium
 — affects discoverability and efficiency, especially for mobile users and users who rely on mouse-click rather than keyboard (Enter).

### Suggested Fix
- On mobile: add an accessible label/tooltip to the icon, and change the icon to an X when the bar is open.
- When the autocomplete is open: ensure the Search button click event calls `event.preventDefault()` and submits the form directly, bypassing the dropdown close logic.

**OBS-S08 — Special Character Input (Security Check)
entering <script>alert(1)</script> as a query term navigated to a search results page without triggering an XSS alert. The payload was not reflected in the DOM as executable content. Positive finding.
You tested if the search box can run malicious code.

Result:

The website did not execute the code
So the site appears protected against XSS in the search field