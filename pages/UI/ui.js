require('dotenv').config();

class CartPage {
  constructor(page, selectors) {
    this.page = page;
    this.selectors = selectors;
  }

    async addSauceLabsBackpackToCart() {
    const backpacks = await this.page.locator(this.selectors.userInterface.sauceLabsBackpackAddToCart);
    await this.page.click(this.selectors.userInterface.sauceLabsBackpackAddToCart);
    }

    async addSauceLabsBikeLightToCart() {
    const tshirt = await this.page.locator(this.selectors.userInterface.sauceLabsBikeLightAddToCart);
    await this.page.click(this.selectors.userInterface.sauceLabsBikeLightAddToCart);
    }

    async addSauceLabsBoltTshirtToCart() {
    const boltTshirt = await this.page.locator(this.selectors.userInterface.sauceLabsBoltTshirtAddToCart);
    await this.page.click(this.selectors.userInterface.sauceLabsBoltTshirtAddToCart);
    }

    async addSauceLabsFleeceJacket() {
    const jacket = await this.page.locator(this.selectors.userInterface.sauceLabsFleeceJacketAddToCart);
    await this.page.click(this.selectors.userInterface.sauceLabsFleeceJacketAddToCart);
    }

    async  addSauceLabsOnsieToCart() {
    const onesie = await this.page.locator(this.selectors.userInterface.sauceLabsOnesieAddToCart);
    await this.page.click(this.selectors.userInterface.sauceLabsOnesieAddToCart);
    }


  async  addSauceLabsRedTshirtToCart() {
    const redTshirt = await this.page.locator(this.selectors.userInterface.sauceLabsRedTshirtAddToCart);
    await this.page.click(this.selectors.userInterface.sauceLabsRedTshirtAddToCart);
    }

  
  async verifyCartBadge(expectedCount) {
    const badge = await this.page.locator(this.selectors.userInterface.shoppingCartBadge).textContent();
    //await badge.waitFor({ state: 'visible' });
    const count = await badge.match(/\d+/)[0];;
    return count === expectedCount.toString();
  }

  async verifyItemInCart() {
    const cartItem = await this.page.locator(this.selectors.cart.cartItem);
    return await cartItem.isVisible();
  }
}

module.exports = { CartPage };