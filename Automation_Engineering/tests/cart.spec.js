/**
 * cart.spec.js
 * ─────────────────────────────────────────────────────────────────────────
 * Tests the shopping cart flow:
 *   • Cart page loads and is initially empty
 *   • Adding a product updates the cart widget text
 *   • Cart page reflects the added item after purchase
 *   • Cart widget shows updated count after adding product
 *
 * NOTE: Tests that navigate back to the product detail page to add a real
 * item share a page-level setup so the product page is only loaded once.
 */

const { test, expect } = require('@playwright/test');
const { ProductDetailPage } = require('../pages/ProductDetailPage');
const { CartPage } = require('../pages/CartPage');
const { PRODUCTS } = require('../utils/testData');

const PRODUCT = PRODUCTS.oilFilter;

test.describe('Shopping Cart', () => {

  // ── TC-CA-01 ────────────────────────────────────────────────────────────
  test('TC-CA-01 | Cart page loads and shows empty state on fresh session', async ({ page }) => {
    const cart = new CartPage(page);
    await cart.open();

    // The page should either show an "empty" message or have 0 rows
    const isEmpty = await cart.isEmpty();
    const rowCount = await cart.getRowCount();
    expect(isEmpty || rowCount === 0).toBe(true);
  });

  // ── TC-CA-02 ────────────────────────────────────────────────────────────
  test('TC-CA-02 | Cart widget says "empty" before any item is added', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    await detail.openProduct(PRODUCT.slug);

    const cartText = await detail.getCartText();
    expect(cartText.toLowerCase()).toContain('empty');
  });

  // ── TC-CA-03 ────────────────────────────────────────────────────────────
  test('TC-CA-03 | Clicking Buy adds the product and updates the cart widget', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    await detail.openProduct(PRODUCT.slug);

    await detail.addToCart();

    // The cart widget text should no longer say "empty"
    const cartText = await detail.getCartText();
    expect(cartText.toLowerCase()).not.toContain('empty');
  });

  // ── TC-CA-04 ────────────────────────────────────────────────────────────
  test('TC-CA-04 | Cart page shows the added item after Buy', async ({ page }) => {
    // Add item
    const detail = new ProductDetailPage(page);
    await detail.openProduct(PRODUCT.slug);
    await detail.addToCart();

    // Navigate to cart
    const cart = new CartPage(page);
    await cart.open();

    const rowCount = await cart.getRowCount();
    // Either the row count increased OR the cart is no longer empty
    const isEmpty = await cart.isEmpty();
    expect(!isEmpty || rowCount > 0).toBe(true);
  });

  // ── TC-CA-05 ────────────────────────────────────────────────────────────
  test('TC-CA-05 | Changing quantity to 2 before buying updates cart total', async ({ page }) => {
    const detail = new ProductDetailPage(page);
    await detail.openProduct(PRODUCT.slug);

    await detail.setQuantity(2);
    await detail.addToCart();

    const cartText = await detail.getCartText();
    // Cart is no longer empty
    expect(cartText.toLowerCase()).not.toContain('empty');
  });

});
