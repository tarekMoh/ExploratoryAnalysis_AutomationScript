/**
 * helpers.js – reusable utility functions for tests.
 */

/**
 * Accept the cookie consent banner if it is visible.
 * Safe to call when the banner is already dismissed.
 *
 * @param {import('@playwright/test').Page} page
 */
async function acceptCookies(page) {
  const btn = page.getByRole('link', { name: 'I accept' });
  try {
    await btn.click({ timeout: 5_000 });
  } catch {
    // banner not present – that's fine
  }
}

/**
 * Wait for at least one product card (h3 > a) to be visible.
 * Throws if no products appear within the timeout.
 *
 * @param {import('@playwright/test').Page} page
 * @param {number} [timeout=10000]
 */
async function waitForProductCards(page, timeout = 10_000) {
  await page.locator('ul li h3 a').first().waitFor({ state: 'visible', timeout });
}

/**
 * Extract a numeric price value from a price string like "15,68 €".
 * Returns a float (e.g. 15.68).
 *
 * @param {string} priceText
 * @returns {number}
 */
function parsePriceEur(priceText) {
  const cleaned = priceText.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleaned);
}

/**
 * Take a full-page screenshot and return its path.
 * Useful for manual evidence capture inside tests.
 *
 * @param {import('@playwright/test').Page} page
 * @param {string} name  Screenshot file name (without extension)
 * @returns {Promise<string>}
 */
async function screenshot(page, name) {
  const path = `reports/screenshots/${name}-${Date.now()}.png`;
  await page.screenshot({ path, fullPage: true });
  return path;
}

/**
 * Retry an async operation up to `attempts` times.
 * Useful for intermittent network hiccups during real-site testing.
 *
 * @param {() => Promise<T>} fn
 * @param {number} [attempts=3]
 * @returns {Promise<T>}
 */
async function retry(fn, attempts = 3) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr;
}

module.exports = { acceptCookies, waitForProductCards, parsePriceEur, screenshot, retry };
