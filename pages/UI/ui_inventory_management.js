require('dotenv').config();

class InventoryPage {
  constructor(page, selectors) {
    this.page = page;
    this.selectors = selectors;
  }

  async invetoryAddToCart() {
    const addToCart = await this.page.locator(this.selectors.userInterface.inventoryItemAddToCartButton);
    await this.page.click(this.selectors.userInterface.inventoryItemAddToCartButton);
  }

  async backToProducts() {
    const backTo = await this.page.locator(this.selectors.userInterface.inventoryBackToProductsButton);
    await this.page.click(this.selectors.userInterface.inventoryBackToProductsButton);
  }  

  async selectSauceLabBackpack() {
    const backpack = await this.page.locator(this.selectors.userInterface.manageSauceLabsBackpack);
    await this.page.click(this.selectors.userInterface.manageSauceLabsBackpack);
  }

  async selectSauceLabsBikeLight() {
    const bikeLight = await this.page.locator(this.selectors.userInterface.manageSauceLabsBikeLight);
    await this.page.click(this.selectors.userInterface.manageSauceLabsBikeLight);
  }

  async selectLogout() {
    const menu = await this.page.locator(this.selectors.userInterface.menuButton);
    await this.page.click(this.selectors.userInterface.menuButton);
    const logout = await this.page.locator(this.selectors.userInterface.menuLogout);
    await this.page.click(this.selectors.userInterface.menuLogout);
  }

  async selectSauceLabsBoltTshirt() {
    const tshirt = await this.page.locator(this.selectors.userInterface.manageSauceLabsBoltTshirt);
    await this.page.click(this.selectors.userInterface.manageSauceLabsBoltTshirt);
  }

  async selectSauceLabsFleeceJacket() {
    const jacket = await this.page.locator(this.selectors.userInterface.manageSauceLabsFleeceJacket);
    await this.page.click(this.selectors.userInterface.manageSauceLabsFleeceJacket);
  }

  async selectSauceLabsSauceLabsOnesie() {
    const onesie = await this.page.locator(this.selectors.userInterface.manageSauceLabsOnesie);
    await this.page.click(this.selectors.userInterface.manageSauceLabsOnesie);
  }

  async selectSauceLabsRedTshirt() {
    const redTshirt = await this.page.locator(this.selectors.userInterface.manageSauceLabsRedTshirt);
    await this.page.click(this.selectors.userInterface.manageSauceLabsRedTshirt);
  }

  async selectCart() {
    const cart = await this.page.locator(this.selectors.userInterface.cartButton);
    await this.page.click(this.selectors.userInterface.cartButton);
  }

  async selectContinueShopping() {
    const continueShopping = await this.page.locator(this.selectors.userInterface.continueShoppingButton);
    await this.page.click(this.selectors.userInterface.continueShoppingButton);
  }

  // async selectRemoveItem() {
  //   const itemRemoveButton = await this.page.locator(this.selectors.userInterface.inventoryItemRemoveButton);
  //   await this.page.click(this.selectors.userInterface.inventoryItemRemoveButton);
  // }

  async getInventoryCount() {
    const inventoryList = await this.page.locator(this.selectors.userInterface.inventoryList);
    const items = await inventoryList.locator(this.selectors.inventory_Management.inventoryItem).count();
    return items;
  }     

  async addBackpackToCart() {
    await this.page.click(this.selectors.userInterface.addBackpackButton);
  }

  async removeFromCart(itemlocator) {
    const removeBtn = await this.page.locator(itemlocator);
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
    }
  }

  async selectFilter(optionText) {
    await this.page.selectOption(this.selectors.userInterface.filterDropdown, { label: optionText });
  }

  async getFirstItemName() {
    return await this.page.textContent(this.selectors.userInterface.firstInventoryItemName);
  }
  async returnToInventory() {
    const menu = await this.page.locator(this.selectors.userInterface.menuButton);
    const allItemsPage = await this.page.locator(this.selectors.userInterface.allItemsPage);
    await this.page.click(menu);
    await this.page.click(allItemsPage);

  }
  

  async selectFilter(optionValue) {
    await this.filterDropdown.selectOption(optionValue);
  }
   
  async getProductNames() {
    const names = await this.page.locator(this.selectors.userInterface.productNames).allTextContents();
    return names.map(name => name.trim());
    return names;
}

  async getProductPrices() {
    const prices = await this.page.locator(this.selectors.userInterface.productPrices).allTextContents();
    return prices.map(p => parseFloat(p.trim().replace('$', '')));
}

}
module.exports = { InventoryPage};