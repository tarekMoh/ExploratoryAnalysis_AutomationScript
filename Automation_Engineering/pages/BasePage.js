/**
 * BasePage – shared selectors and actions inherited by every page object.
 * All cross-cutting concerns (cookie banner, navigation bar, cart widget)
 * live here so individual page objects stay focused on their own content.
 */
class BasePage {
  constructor(page) {
    this.page = page;

    // ── Cookie banner ─────────────────────────────────────────────────────
    this.cookieAcceptBtn = page.getByRole('link', { name: 'I accept' });

    // ── Top navigation bar ────────────────────────────────────────────────
    this.navStore     = page.getByRole('link', { name: 'Store' }).first();
    this.navShipping  = page.getByRole('link', { name: 'Shipping and Delivery' }).first();
    this.navContact   = page.getByRole('link', { name: 'Contact' }).first();

    // ── Search bar ────────────────────────────────────────────────────────
    this.modelFilter  = page.locator('select').first();
    this.searchInput  = page.locator('input[placeholder="rs"], input[placeholder="r"], input[placeholder=""]').first();
    this.searchBtn    = page.getByRole('button', { name: 'Search' });

    // ── Shopping cart widget ──────────────────────────────────────────────
    this.cartWidget   = page.getByRole('link', { name: /Shopping cart/ });
    this.cartStatus   = page.locator('div.cart-status, .cart .status').first();
  }

  /** Dismiss cookie banner when present (idempotent). */
  async acceptCookies() {
    try {
      await this.cookieAcceptBtn.click({ timeout: 5_000 });
    } catch {
      // banner already gone
    }
  }

  /**
   * Navigate to a URL relative to baseURL and accept the cookie banner.
   * @param {string} path  e.g. '/online-store.html'
   */
  async goto(path = '/online-store.html') {
    await this.page.goto(path);
    await this.acceptCookies();
  }

  /**
   * Search for a keyword using the global search bar.
   * Optionally pre-select a car model from the dropdown.
   *
   * @param {string} keyword
   * @param {string|null} model  e.g. 'Octavia 3'
   */
  async search(keyword, model = null) {
    if (model) {
      await this.modelFilter.selectOption(model);
    }
    await this.searchInput.fill(keyword);
    await this.searchBtn.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Return the visible text of the cart widget. */
  async getCartText() {
    return this.cartWidget.innerText();
  }
}

module.exports = { BasePage };
