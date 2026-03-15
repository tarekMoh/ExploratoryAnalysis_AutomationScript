/**
 * product-detail.spec.js
 * ─────────────────────────────────────────────────────────────────────────
 * Tests the individual spare part (product detail) page:
 *   • Title and H1 heading are present
 *   • Škoda part number is displayed
 *   • Price is shown with EUR currency
 *   • Stock status is visible
 *   • Buy button is enabled
 *   • Alternative parts are listed
 *   • "You will also need" cross-sell block exists
 *   • Quantity control works
 */

const { test, expect } = require('@playwright/test');
const { ProductDetailPage } = require('../pages/ProductDetailPage');
const { parsePriceEur } = require('../utils/helpers');
const { PRODUCTS } = require('../utils/testData');

const PRODUCT = PRODUCTS.oilFilter;

test.describe('Product Detail Page', () => {

  test.beforeEach(async ({ page }) => {
    const detail = new ProductDetailPage(page);
    await detail.openProduct(PRODUCT.slug);
  });

  // ── TC-PD-01 ────────────────────────────────────────────────────────────
  test('TC-PD-01 | Page title contains product name', async ({ page }) => {
    await expect(page).toHaveTitle(new RegExp(PRODUCT.title.split(' ')[0], 'i'));
  });

  // ── TC-PD-02 ────────────────────────────────────────────────────────────
  test('TC-PD-02 | H1 heading is visible and contains product name', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    await expect(detail.heading).toBeVisible();
    const text = await detail.heading.innerText();
    expect(text).toContain(PRODUCT.title);
  });

  // ── TC-PD-03 ────────────────────────────────────────────────────────────
  test('TC-PD-03 | Škoda part number is displayed correctly', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    const partNums = await detail.getPartNumbers();
    expect(partNums.length).toBeGreaterThan(0);
    expect(partNums).toContain(PRODUCT.partNumber);
  });

  // ── TC-PD-04 ────────────────────────────────────────────────────────────
  test('TC-PD-04 | Price is visible and is a positive EUR value', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    await expect(detail.priceEl).toBeVisible();
    const priceText = await detail.getPrice();
    expect(priceText).toMatch(/€/);
    const value = parsePriceEur(priceText);
    expect(value).toBeGreaterThan(0);
  });

  // ── TC-PD-05 ────────────────────────────────────────────────────────────
  test('TC-PD-05 | Stock status is shown on the page', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    // Either the inline list item "In Stock" or the descriptive dispatch text
    const stockLocator = page.locator('text=/In Stock|IN STOCK|in stock/').first();
    await expect(stockLocator).toBeVisible();
  });

  // ── TC-PD-06 ────────────────────────────────────────────────────────────
  test('TC-PD-06 | Buy button is visible and enabled', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    await expect(detail.buyBtn).toBeVisible();
    await expect(detail.buyBtn).toBeEnabled();
  });

  // ── TC-PD-07 ────────────────────────────────────────────────────────────
  test('TC-PD-07 | Alternative parts section lists at least the expected count', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    const altCount = await detail.getAlternativeCount();
    expect(altCount).toBeGreaterThanOrEqual(PRODUCT.minAlternatives);
  });

  // ── TC-PD-08 ────────────────────────────────────────────────────────────
  test('TC-PD-08 | "You will also need" cross-sell block is present', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    const crossSellCount = await detail.youWillNeedLinks.count();
    expect(crossSellCount).toBeGreaterThanOrEqual(1);
  });

  // ── TC-PD-09 ────────────────────────────────────────────────────────────
  test('TC-PD-09 | Quantity field defaults to 1', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    await expect(detail.qtyInput).toBeVisible();
    const value = await detail.qtyInput.inputValue();
    expect(value).toBe('1');
  });

  // ── TC-PD-10 ────────────────────────────────────────────────────────────
  test('TC-PD-10 | Qty "+" button increments the quantity field', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    await detail.qtyPlus.click();
    const value = await detail.qtyInput.inputValue();
    expect(Number(value)).toBeGreaterThanOrEqual(2);
  });

});
