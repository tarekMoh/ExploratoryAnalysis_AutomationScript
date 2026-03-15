const { BasePage } = require('./BasePage');

/**
 * SearchResultsPage – the page rendered after submitting a search query.
 * The site renders results on the same layout as ProductListPage but with
 * a search-result heading. This PO wraps its specific elements.
 */
class SearchResultsPage extends BasePage {
  constructor(page) {
    super(page);

    this.heading        = page.getByRole('heading', { level: 1 });
    this.resultCards    = page.locator('ul li h3 a');
    this.noResultsMsg   = page.locator('text=/no results|nothing found|0 results/i');
    this.paginationInfo = page.locator('text=/Showing items/');
  }

  /** Count of result cards currently visible. */
  async getResultCount() {
    return this.resultCards.count();
  }

  /** True if the page shows a "no results" message. */
  async hasNoResults() {
    return this.noResultsMsg.isVisible({ timeout: 5_000 }).catch(() => false);
  }

  /** All result titles on the page. */
  async getAllResultTitles() {
    const count = await this.resultCards.count();
    const titles = [];
    for (let i = 0; i < count; i++) {
      titles.push((await this.resultCards.nth(i).innerText()).trim());
    }
    return titles;
  }
}

module.exports = { SearchResultsPage };
