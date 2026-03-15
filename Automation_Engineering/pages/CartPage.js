const { BasePage } = require('./BasePage');

/**
 * CartPage – /shopping-cart.html
 * Displays cart contents, quantities, totals, and checkout entry.
 */
class CartPage extends BasePage {
  constructor(page) {
    super(page);

    this.heading       = page.getByRole('heading', { level: 1 });
    this.emptyMsg      = page.locator('text=/cart is empty/i');
    this.cartRows      = page.locator('table tbody tr, ul.cart-items li');
    this.totalPrice    = page.locator('strong').filter({ hasText: /\d+,\d+\s*€/ }).last();
    this.checkoutBtn   = page.getByRole('link', { name: /Order|Checkout/i });
    this.removeButtons = page.getByRole('link', { name: /remove|delete|×/i });
  }

  /** Navigate to the cart page. */
  async open() {
    await this.goto('/shopping-cart.html');
  }

  /** True if the cart shows an empty message. */
  async isEmpty() {
    return this.emptyMsg.isVisible();
  }

  /** Number of distinct line-items in the cart. */
  async getRowCount() {
    return this.cartRows.count();
  }
}

module.exports = { CartPage };
