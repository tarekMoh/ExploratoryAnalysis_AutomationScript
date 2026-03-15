const { BasePage } = require('./BasePage');

/**
 * CatalogPage – model-level catalog page, e.g. /catalog/octavia-3.html
 * Lists "Service interval parts" and "Spare parts" category groups.
 */
class CatalogPage extends BasePage {
  constructor(page) {
    super(page);

    this.heading             = page.getByRole('heading', { level: 1 });
    this.breadcrumb          = page.locator('ol, ul').filter({ has: page.locator('li a[href="/"]') }).first();
    this.servicePartLinks    = page.locator('h2:has-text("Service interval parts") + ul li a');
    this.sparePartLinks      = page.locator('h2:has-text("Spare parts") + ul li a');
    this.modelChangeBtn      = page.locator('text=change car');
  }

  /**
   * Navigate to a model catalog page.
   * @param {string} modelSlug  e.g. 'octavia-3'
   */
  async openModel(modelSlug) {
    await this.goto(`/catalog/${modelSlug}.html`);
  }

  /**
   * Click a category link inside "Service interval parts".
   * @param {string} categoryName  e.g. 'Filters'
   */
  async openServiceCategory(categoryName) {
    await this.servicePartLinks.filter({ hasText: categoryName }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Click a category link inside "Spare parts".
   * @param {string} categoryName  e.g. 'Engine'
   */
  async openSpareCategory(categoryName) {
    await this.sparePartLinks.filter({ hasText: categoryName }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  /** Return all breadcrumb item texts. */
  async getBreadcrumbTexts() {
    const items = this.breadcrumb.locator('li');
    const texts = [];
    const count = await items.count();
    for (let i = 0; i < count; i++) {
      texts.push((await items.nth(i).innerText()).trim());
    }
    return texts;
  }
}

module.exports = { CatalogPage };
