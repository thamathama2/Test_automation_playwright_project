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
    await this.page.click(this.selectors.checkout.finishButton);
  }

  async getOrderConfirmationText() {
    return await this.page.textContent(this.selectors.checkout.orderConfirmation);
  }
}

module.exports = { CheckoutPage };