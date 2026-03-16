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

### Suggested Fix
Add a lightweight client-side guard that prevents submission when the field is empty and displays an inline message directly below the search field:
"Please enter a search term to find parts."
The Search button can also be visually disabled (greyed out) until at least one character is typed, making the required action self-evident without any additional instruction.

**Risk: Low — Usability / Minor UX gap**

---

**OBS-S02 — Typeahead autocomplete activates on a single character**  
The autocomplete feature activates when the user enters a single character, "a," into the search field. This activates a rich autocomplete dropdown with product name suggestions and category links. The matching characters are highlighted in bold. This is a good feature, although it might be a problem for the backend to query all products with such a limited number of characters. No delay was observed, and it's not tested if there's a rate limit.

### Suggested Fix
Introduce a minimum character threshold of 2–3 characters before the autocomplete fires, combined with a debounce delay of 250–300ms after the user stops typing. This reduces server requests significantly while keeping the experience fast enough to feel instant. A placeholder hint in the input field — "Type at least 2 characters…" — sets the right expectation upfront.
Recommend to perform a load test on the GET API that retrieves autocomplete results to validate how the endpoint behaves under concurrent user sessions.

**Risk: Low — Backend performance / Scalability under load**

---

**OBS-S03 — Search results are scoped to the selected car model**  
The model is pre-selected to "Octavia 3" from a previous session or by default. A user who owns a Fabia (or any other model) may not notice this, type their query, and receive a silently reduced set of results — without being told *why* results are fewer or that their search was filtered.

### Suggested Fix
Display a sticky, clearly visible banner or callout *in the search bar area* showing the active model with a quick-change link:
 [Filtering for: Octavia 3]    [Change car]
This persists above or beside the search field so users see it before they type, not after.

**Risk: Medium — Discoverability / Lost conversions from incorrect model filter**

---

**OBS-S04 — Price range filter label is in Czech on an English-language page (localisation bug)**  
The price range filter on the search results page displays the label "cenové rozpětí" — Czech for "price range" — instead of the English equivalent. The rest of the page renders in English, making this an isolated, untranslated string that stands out immediately to any non-Czech visitor.

###Suggested Fix
Add the missing translation key to the English localisation file so the label renders as "Price range". As a preventive measure, run an automated i18n audit as part of the CI pipeline to flag any untranslated strings before they reach production. A visual regression scan across supported locales would catch similar issues across the full page.

**Risk: Low — Localisation / Credibility for international users**

---

**OBS-S05 — No-results page offers a spare parts inquiry form**  
When a nonsense query is entered, the page shows a helpful fallback form allowing users to request the part manually (fields: Car model, Chassis type, Engine type, VIN, Name, Email, Phone, Requested spare part). This is a good recovery pattern. However, the Car model and Chassis type fields in the form are dropdowns that appear empty/unpopulated — it is unclear whether they are functional or decorative.

When a user searches for something that doesn't exist in the catalog, the site shows a **"no results" page**. Instead of just displaying an error, it offers a helpful fallback: a **Spare Parts Inquiry Form** where the user can manually describe the part they need, and the store staff will search for it and reply.

### Suggested Fix
On page load, auto-populate the two highest-value fields from existing context using a few lines of JavaScript:
Car model--> pre-fill from the active session model (e.g. "Škoda Octavia 3")
Requested spare part--> pre-fill from the search query (e.g. "xyznonexistentpart999")
This eliminates re-typing, reduces form abandonment, and removes post-submission uncertainty.

**Risk: Medium — Conversion / User trust on the most critical recovery path**

---

**OBS-S06 — Query string embedded in URL path, not query parameter**  
The search URL pattern is `/spare-parts/octavia-3/brake%20pad.html` — the query is part of the path rather than a `?q=` parameter. This is an unusual convention. It means special characters in searches could produce malformed paths. It also raises SEO implications: every unique search creates a distinct URL that search engines might index.

### Suggested Fix
Migrate to a standard query parameter pattern such as /search?model=octavia-3&q=brake+pad. This is the recognised convention for search result pages across the industry, is handled correctly by all HTTP infrastructure, and makes it straightforward to apply noindex meta tags or robots.txt rules to prevent search engine crawling of result pages. Proper redirects from the old URL structure should be in place during any migration to preserve existing links.
Risk: Medium — SEO health / URL robustness with special characters

**Risk: Medium — SEO health / URL robustness with special characters**

---

**OBS-S07 — Search Icon Requires Two Interactions on Mobile/Compact View
When site switches to a compact/mobile layout. In this layout, the search bar is **hidden by default** behind a magnifying glass icon. Clicking the icon. it only reveals the search bar and it is invisible to first-time users.

### Suggested Fix
- On mobile: add an accessible label/tooltip to the icon, and change the icon to an X when the bar is open.
- When the autocomplete is open: ensure the Search button click event calls `event.preventDefault()` and submits the form directly, bypassing the dropdown close logic.

**Risk: Medium — Mobile usability / Accessibility / Increased drop-off on small screens**

---

**OBS-S08 — Special Character Input (Security Check)
entering <script>alert(1)</script> as a query term navigated to a search results page without triggering an XSS alert. The payload was not reflected in the DOM as executable content. Positive finding.
Result:
The website did not execute the code
So the site appears protected against XSS in the search field

**Risk: None currently detected — Positive security signal; maintain through regression testing**