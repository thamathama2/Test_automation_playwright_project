require('dotenv').config();

class CheckoutPage {
  constructor(page, selectors) {
    this.page = page;
    this.selectors = selectors;
  }

  async startCheckout() {
    await this.page.click(this.selectors.checkout.checkoutButton);
  }

  async enterCheckoutInformation(firstName, lastName, postalCode) {
    await this.page.fill(this.selectors.checkout.firstNameInput, firstName);
    await this.page.fill(this.selectors.checkout.lastNameInput, lastName);
    await this.page.fill(this.selectors.checkout.postalCodeInput, postalCode);
  }

  async continueCheckout() {
    await this.page.click(this.selectors.checkout.continueButton);
  }

  async finishCheckout() {
    await this.page.click("//button[@id='finish']");
  }

  async getOrderConfirmationText() {
    return await this.page.locator(".complete-header").textContent();
  }
  async determineTotalAmount() {
  // Get all prices as numbers from items on the page
  const prices = await this.page.$$eval(
    '[data-test="inventory-item-price"]',
    items => items.map(item => parseFloat(item.textContent.replace('$', '')))
  );

  // Sum all prices
  const aggregatePrice = prices.reduce((sum, price) => sum + price, 0);

  // Get subtotal text and parse subtotal amount

  // Optionally log or return the calculated values for further assertions
  console.log('Aggregate price:', aggregatePrice);

  return  aggregatePrice;
}
}
module.exports = { CheckoutPage };