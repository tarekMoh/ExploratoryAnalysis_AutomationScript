/**
 * homepage.spec.js
 * ─────────────────────────────────────────────────────────────────────────
 * Verifies core homepage content:
 *   • Page title and H1 heading
 *   • Model grid completeness
 *   • Primary navigation links
 *   • Cart widget default state
 *   • "Why shop with us" trust section
 */

const { test, expect } = require('@playwright/test');
const { HomePage } = require('../pages/HomePage');

test.describe('Homepage', () => {

  test.beforeEach(async ({ page }) => {
    const home = new HomePage(page);
    await home.open();
  });

  // ── TC-HP-01 ────────────────────────────────────────────────────────────
  test('TC-HP-01 | Page title contains "Škoda spare parts"', async ({ page }) => {
    await expect(page).toHaveTitle(/Škoda spare parts/i);
  });

  // ── TC-HP-02 ────────────────────────────────────────────────────────────
  test('TC-HP-02 | H1 heading is visible on homepage', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.pageHeading).toBeVisible();
    const text = await home.pageHeading.innerText();
    expect(text.toLowerCase()).toContain('skoda-parts');
  });

  // ── TC-HP-03 ────────────────────────────────────────────────────────────
  test('TC-HP-03 | Model grid shows at least 20 car models', async ({ page }) => {
    const home = new HomePage(page);
    const count = await home.getModelCount();
    expect(count).toBeGreaterThanOrEqual(20);
  });

  // ── TC-HP-04 ────────────────────────────────────────────────────────────
  test('TC-HP-04 | Primary navigation links are visible and have correct hrefs', async ({ page }) => {
    const home = new HomePage(page);
    await expect(home.navStore).toBeVisible();
    await expect(home.navShipping).toBeVisible();
    await expect(home.navContact).toBeVisible();

    await expect(home.navStore).toHaveAttribute('href', /online-store/);
    await expect(home.navShipping).toHaveAttribute('href', /delivery/);
    await expect(home.navContact).toHaveAttribute('href', /contact/);
  });

  // ── TC-HP-05 ────────────────────────────────────────────────────────────
  test('TC-HP-05 | Shopping cart widget shows "empty" on fresh visit', async ({ page }) => {
    const home = new HomePage(page);
    const cartText = await home.getCartText();
    expect(cartText.toLowerCase()).toContain('empty');
  });

  // ── TC-HP-06 ────────────────────────────────────────────────────────────
  test('TC-HP-06 | "Why shop with us" section has at least 5 trust points', async ({ page }) => {
    const home = new HomePage(page);
    const count = await home.whyShopList.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  // ── TC-HP-07 ────────────────────────────────────────────────────────────
  test('TC-HP-07 | Service interval parts quick-links are present', async ({ page }) => {
    const home = new HomePage(page);
    const count = await home.servicePartsLinks.count();
    expect(count).toBeGreaterThanOrEqual(5);   // Filters, Oils, Wipers etc.
  });

});
