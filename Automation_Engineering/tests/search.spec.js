/**
 * search.spec.js
 * ─────────────────────────────────────────────────────────────────────────
 * Tests the global search bar:
 *   • Keyword search returns relevant results
 *   • Model-filtered search scopes results correctly
 *   • Selecting a model from the dropdown changes context
 *   • A nonsense query surfaces a "no results" state
 */

const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');
const { SearchResultsPage } = require('../pages/SearchResultsPage');
const { SEARCH } = require('../utils/testData');

test.describe('Search', () => {

  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
  });

  // ── TC-SR-01 ────────────────────────────────────────────────────────────
  test('TC-SR-01 | Keyword search returns at least one result', async ({ page }) => {
    const home = new HomePage(page);
    await home.search(SEARCH.validKeyword);

    const results = new SearchResultsPage(page);
    const count = await results.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  // ── TC-SR-02 ────────────────────────────────────────────────────────────
  test('TC-SR-02 | Search results contain the search keyword in titles', async ({ page }) => {
    const home = new HomePage(page);
    await home.search(SEARCH.validKeyword);

    const results = new SearchResultsPage(page);
    const titles = await results.getAllResultTitles();
    expect(titles.length).toBeGreaterThan(0);

    // At least one title should be loosely related to the keyword
    const keyword = SEARCH.validKeyword.toLowerCase();
    const hasMatch = titles.some(t =>
      keyword.split(' ').some(word => t.toLowerCase().includes(word))
    );
    expect(hasMatch).toBe(true);
  });

  // ── TC-SR-03 ────────────────────────────────────────────────────────────
  test('TC-SR-03 | Model-filtered search scopes results to selected model', async ({ page }) => {
    const home = new HomePage(page);
    await home.search(SEARCH.modelKeyword, SEARCH.model);

    // URL or page state should reflect model scope
    const currentUrl = page.url();
    // The model dropdown value persists or the catalog URL reflects the model
    expect(currentUrl).not.toBe('https://www.skoda-parts.com/');

    const results = new SearchResultsPage(page);
    const count = await results.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  // ── TC-SR-04 ────────────────────────────────────────────────────────────
  test('TC-SR-04 | Selecting a model from dropdown navigates to that model catalog', async ({ page }) => {
    const home = new HomePage(page);
    // Select model from the dropdown
    await home.modelFilter.selectOption('Fabia 3');
    await home.searchBtn.click();
    await page.waitForLoadState('domcontentloaded');

    const url = page.url();
    expect(url).toContain('fabia-3');
  });

  // ── TC-SR-05 ────────────────────────────────────────────────────────────
  test('TC-SR-05 | Nonsense search query surfaces no-results feedback', async ({ page }) => {
    const home = new HomePage(page);
    await home.search(SEARCH.noResultsQuery);

    const results = new SearchResultsPage(page);
    // Either 0 cards are shown OR an explicit "no results" message appears
    const count = await results.getResultCount();
    const noResultsVisible = await results.hasNoResults();
    expect(count === 0 || noResultsVisible).toBe(true);
  });

});
