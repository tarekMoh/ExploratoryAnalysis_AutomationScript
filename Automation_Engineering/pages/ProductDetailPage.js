const { BasePage } = require('./BasePage');

/**
 * ProductDetailPage – individual spare part page.
 * e.g. /spare-part/04e115561ac-oil-filter-...html
 * Contains part number, price, stock, quantity selector, buy button,
 * alternative parts, and a product Q&A form.
 */
class ProductDetailPage extends BasePage {
  constructor(page) {
    super(page);

    this.heading          = page.getByRole('heading', { level: 1 });
    this.breadcrumb       = page.locator('ol, ul').filter({ has: page.locator('li a[href="/"]') }).first();

    // ── Part information ──────────────────────────────────────────────────
    this.partNumbers      = page.locator('strong:has-text("Škoda part number:") + ul li');
    this.description      = page.locator('p').nth(1);   // first meaningful paragraph
    this.stockStatus      = page.locator('li:has-text("In Stock"), text=/IN STOCK/').first();

    // ── Pricing ───────────────────────────────────────────────────────────
    this.priceEl          = page.locator('strong').filter({ hasText: /\d+,\d+\s*€/ }).first();
    this.vatLabel         = page.locator('text=incl. VAT').first();

    // ── Purchase controls ─────────────────────────────────────────────────
    this.qtyInput         = page.locator('input[value="1"]');
    this.qtyPlus          = page.getByRole('link', { name: '+' });
    this.qtyMinus         = page.getByRole('link', { name: '-' });
    this.buyBtn           = page.getByRole('button', { name: 'Buy' });

    // ── Alternatives ──────────────────────────────────────────────────────
    this.alternativeLinks = page.locator('h2:has-text("Alternative parts") + ul li a');
    this.youWillNeedLinks = page.locator('h2:has-text("You will also need") + ul li a');

    // ── Q&A form ──────────────────────────────────────────────────────────
    this.qaQuestion       = page.locator('textarea[placeholder*="Question"], input[placeholder*="Question"]').first();
    this.qaEmail          = page.locator('input[placeholder*="E-mail"], label:has-text("E-mail") + input').first();
    this.qaSubmit         = page.getByRole('button', { name: /Ask question/i });
  }

  /**
   * Navigate directly to a product detail page.
   * @param {string} slug  e.g. '04e115561ac-oil-filter-...'
   */
  async openProduct(slug) {
    await this.goto(`/spare-part/${slug}`);
  }

  /** Return the displayed price string (e.g. '15,68 €'). */
  async getPrice() {
    return (await this.priceEl.innerText()).trim();
  }

  /** Return all listed Škoda part numbers. */
  async getPartNumbers() {
    const count = await this.partNumbers.count();
    const nums = [];
    for (let i = 0; i < count; i++) {
      nums.push((await this.partNumbers.nth(i).innerText()).trim());
    }
    return nums;
  }

  /** Click the Buy button and wait for the cart to update. */
  async addToCart() {
    await this.buyBtn.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Set the quantity field to a specific value. */
  async setQuantity(qty) {
    await this.qtyInput.fill(String(qty));
  }

  /** Return count of listed alternative parts. */
  async getAlternativeCount() {
    return this.alternativeLinks.count();
  }
}

module.exports = { ProductDetailPage };
