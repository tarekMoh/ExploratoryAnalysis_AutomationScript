const { BasePage } = require('./BasePage');

/**
 * HomePage – the main store landing page (/online-store.html).
 * Covers the model grid, category quick-links, and testimonials.
 */
class HomePage extends BasePage {
  constructor(page) {
    super(page);

    // ── Model grid ────────────────────────────────────────────────────────
    this.modelGrid    = page.locator('ul li a img').first().locator('..').locator('..').locator('..');
    this.modelLinks   = page.locator('h2:has-text("Škoda spare parts by model") + ul li a');
    this.pageHeading  = page.getByRole('heading', { level: 1 });

    // ── Category sections ─────────────────────────────────────────────────
    this.servicePartsLinks = page.locator('h2:has-text("Service interval parts") + ul li a');
    this.sparePartsLinks   = page.locator('h2:has-text("Spare parts") + ul li a');

    // ── Trust section ─────────────────────────────────────────────────────
    this.whyShopList  = page.locator('h2:has-text("Why shop with us") + ul li');
    this.testimonials = page.locator('blockquote');
  }

  /** Navigate to the homepage and accept cookies. */
  async open() {
    await this.goto('/online-store.html');
  }

  /** Return count of model links in the grid. */
  async getModelCount() {
    return this.modelLinks.count();
  }

  /** Click a model by display name (e.g. 'Octavia 3'). */
  async clickModel(modelName) {
    await this.modelLinks
      .filter({ hasText: modelName })
      .first()
      .click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}

module.exports = { HomePage };
