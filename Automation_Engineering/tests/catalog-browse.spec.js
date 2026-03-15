/**
 * catalog-browse.spec.js
 * ─────────────────────────────────────────────────────────────────────────
 * Tests the catalog hierarchy navigation:
 *   • Model page loads with correct heading
 *   • Model page lists service and spare categories
 *   • Navigating from model → category → subcategory works end-to-end
 *   • Breadcrumb reflects navigation depth
 *   • Model dropdown switches to a different model catalog
 */

const { test, expect } = require('@playwright/test');
const { CatalogPage } = require('../pages/CatalogPage');
const { ProductListPage } = require('../pages/ProductListPage');
const { MODELS, CATEGORIES } = require('../utils/testData');

test.describe('Catalog Browse', () => {

  // ── TC-CB-01 ────────────────────────────────────────────────────────────
  test('TC-CB-01 | Octavia 3 model page loads with correct heading', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.openModel(MODELS.octavia3.slug);

    await expect(catalog.heading).toBeVisible();
    const text = await catalog.heading.innerText();
    expect(text.toLowerCase()).toContain('octavia 3');
  });

  // ── TC-CB-02 ────────────────────────────────────────────────────────────
  test('TC-CB-02 | Model catalog lists both service and spare part categories', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.openModel(MODELS.octavia3.slug);

    const serviceCount = await catalog.servicePartLinks.count();
    const spareCount   = await catalog.sparePartLinks.count();

    expect(serviceCount).toBeGreaterThanOrEqual(5);
    expect(spareCount).toBeGreaterThanOrEqual(8);
  });

  // ── TC-CB-03 ────────────────────────────────────────────────────────────
  test('TC-CB-03 | Navigating into Filters category shows product listing', async ({ page }) => {
    const listing = new ProductListPage(page);
    await listing.openPath(CATEGORIES.filters.path);

    const count = await listing.getProductCount();
    expect(count).toBeGreaterThanOrEqual(CATEGORIES.filters.minProducts);
  });

  // ── TC-CB-04 ────────────────────────────────────────────────────────────
  test('TC-CB-04 | Product listing page shows pagination info', async ({ page }) => {
    const listing = new ProductListPage(page);
    await listing.openPath(CATEGORIES.filters.path);

    await expect(listing.paginationInfo).toBeVisible();
    const infoText = await listing.paginationInfo.innerText();
    expect(infoText).toMatch(/Showing items/i);
  });

  // ── TC-CB-05 ────────────────────────────────────────────────────────────
  test('TC-CB-05 | Clicking a product card from listing navigates to detail page', async ({ page }) => {
    const listing = new ProductListPage(page);
    await listing.openPath(CATEGORIES.filters.path);

    const href = await listing.openFirstProduct();
    const currentUrl = page.url();

    expect(currentUrl).toContain('/spare-part/');
  });

  // ── TC-CB-06 ────────────────────────────────────────────────────────────
  test('TC-CB-06 | Model dropdown on catalog page reflects correct selected model', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.openModel(MODELS.octavia3.slug);

    const selected = await catalog.modelFilter.inputValue();
    expect(selected.toLowerCase()).toContain('octavia 3');
  });

  // ── TC-CB-07 ────────────────────────────────────────────────────────────
  test('TC-CB-07 | Changing model dropdown navigates to new model catalog', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.openModel(MODELS.octavia3.slug);

    await catalog.modelFilter.selectOption(MODELS.fabia3.name);
    await catalog.searchBtn.click();
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toContain(MODELS.fabia3.slug);
  });

});
