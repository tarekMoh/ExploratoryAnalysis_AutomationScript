const { BasePage } = require('./BasePage');

/**
 * ProductListPage – a category listing page that shows product cards.
 * e.g. /catalog/octavia-3/service-interval-parts/filters-628.html
 */
class ProductListPage extends BasePage {
  constructor(page) {
    super(page);

    this.heading       = page.getByRole('heading', { level: 1 });
    this.productCards  = page.locator('ul li h3 a');
    this.productItems  = page.locator('ul li').filter({ has: page.locator('h3') });
    this.paginationInfo = page.locator('text=/Showing items/');
    this.subCategoryLinks = page.locator('ul li a').filter({ hasText: /\[\d+\]/ });

    // Sort control
    this.sortDropdown  = page.locator('select').last();
  }

  /**
   * Navigate directly to a category listing URL.
   * @param {string} path  relative path
   */
  async openPath(path) {
    await this.goto(path);
  }

  /** Return the number of visible product cards on the page. */
  async getProductCount() {
    return this.productCards.count();
  }

  /**
   * Click the first product card and wait for navigation.
   * @returns {string} The URL of the product detail page.
   */
  async openFirstProduct() {
    const href = await this.productCards.first().getAttribute('href');
    await this.productCards.first().click();
    await this.page.waitForLoadState('domcontentloaded');
    return href;
  }

  /**
   * Click a specific product card by partial title text.
   * @param {string} titleText
   */
  async openProductByTitle(titleText) {
    await this.productCards.filter({ hasText: titleText }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Return all product titles on the current page. */
  async getAllProductTitles() {
    const count = await this.productCards.count();
    const titles = [];
    for (let i = 0; i < count; i++) {
      titles.push((await this.productCards.nth(i).innerText()).trim());
    }
    return titles;
  }
}

module.exports = { ProductListPage };
