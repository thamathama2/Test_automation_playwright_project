import { test, expect } from '@playwright/test';
import utilities from '../utilities/utilities.json';
import { loginApi } from '../pages/API/api_login.js';
import { baseURL, endpoints } from '../pages/API/api.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import { CartPage } from '../pages/UI/ui.js';
import {InventoryPage } from '../pages/UI/ui_inventory_management.js';
import LoginPage from '../pages/UI/ui_login.js';
import { CheckoutPage } from '../pages/UI/ui_checkout.js';
 
const utilitiesPath = path.join(__dirname, '..', 'utilities', 'utilities.json');
 
 
 
require('dotenv').config();
// Set the URL for the login page, if not provided in the envrionment variablesthen default to the Sauce Demo URL 
let URL= process.env.LOGIN_URL || 'https://www.saucedemo.com/';
const users = [
  { username: process.env.USER1_USERNAME, password: process.env.USER1_PASSWORD },
  { username: process.env.USER2_USERNAME, password: process.env.USER2_PASSWORD },
  { username: process.env.USER3_USERNAME, password: process.env.USER3_PASSWORD },
];
 
test.describe('Multi user login', () => {
  users.forEach(({ username, password }) => {
    test(`User login as ${username}`, async ({ page,  }, testInfo) => {
      // Navigate to the login page
      await page.goto(URL);
 
      // Fill in login credentials
      await page.fill('#user-name', username ?? '');
      await page.fill('#password', password ?? '');
 
      // Take screenshot before login
      const screenshotBeforeLogin = await page.screenshot();
      await testInfo.attach('Before Login', {
        body: screenshotBeforeLogin,
        contentType: 'image/png',
      });
 
      // Click login button
      await page.click('#login-button');
 
      // Wait 1 seconds after login
      await page.waitForTimeout(1000);
      //If credentials incorrect , screenshot login error
      if (username === process.env.USER2_USERNAME) {
        const errorScreenshot = await page.screenshot();
        await testInfo.attach('Login Error', {
          body: errorScreenshot,
          contentType: 'image/png',
        });
        await expect(page.locator(utilities.login.errorMessage)).toBeVisible();
      } else {
          // Otherwise, screenshot the inventory list after successful login
        const successScreenshot = await page.screenshot();
        await testInfo.attach('Logged-in', {
          body: successScreenshot,
          contentType: 'image/png',
        });
        await expect(page.locator(utilities.userInterface.homePage)).toBeVisible();
        await page.click(utilities.userInterface.menuButton);
        await page.click(utilities.userInterface.menuLogout);
        // Attach screenshot after logout
        const logoutScreenshot = await page.screenshot();
        await testInfo.attach('After Logout', {
          body: logoutScreenshot,
          contentType: 'image/png',
        });
        
        await expect(page.locator(utilities.login.loginButton)).toBeVisible();
    }
  });  
  });
});
 
test.describe('shopping cart functionality, Inventory management  and checkout process test ', () => {
  test('Shopping cart functionality', async ({ page }, testInfo) => {
    const inventoryPage = new InventoryPage(page, utilities);
    const cartPage = new CartPage(page, utilities);
    const loginPage = new LoginPage(page);

    await loginPage.goto(URL);
    // Login as standard user
    await loginPage.login(process.env.USER1_USERNAME, process.env.USER1_PASSWORD, testInfo);
    await page.click(utilities.login.loginButton);

    const screenshotAfterLogin = await page.screenshot();
    await testInfo.attach('After Login', { body: screenshotAfterLogin, contentType: 'image/png' });

    // Add items to cart and verify cart badge increments accordingly
    await cartPage.addSauceLabsBackpackToCart();
    expect(await cartPage.verifyCartBadge(1)).toBeTruthy();
    const screenshot1 = await page.screenshot();
    await testInfo.attach('After Adding Backpack', { body: screenshot1, contentType: 'image/png' });

    await new Promise(resolve => setTimeout(resolve, 1000));
    await cartPage.addSauceLabsBikeLightToCart();
    expect(await cartPage.verifyCartBadge(2)).toBeTruthy();
    const screenshot2 = await page.screenshot();
    await testInfo.attach('After Adding Bike Light', { body: screenshot2, contentType: 'image/png' });

    await cartPage.addSauceLabsBoltTshirtToCart();
    expect(await cartPage.verifyCartBadge(3)).toBeTruthy();
    const screenshot3 = await page.screenshot();
    await testInfo.attach('After Adding Bolt T-shirt', { body: screenshot3, contentType: 'image/png' });

    await new Promise(resolve => setTimeout(resolve, 1000));

    await cartPage.addSauceLabsFleeceJacket();
    expect(await cartPage.verifyCartBadge(4)).toBeTruthy();
    const screenshot4 = await page.screenshot();
    await testInfo.attach('After Adding Fleece Jacket', { body: screenshot4, contentType: 'image/png' });

    await cartPage.addSauceLabsOnsieToCart();
    expect(await cartPage.verifyCartBadge(5)).toBeTruthy();
    const screenshot5 = await page.screenshot();
    await testInfo.attach('After Adding Onesie', { body: screenshot5, contentType: 'image/png' });

    await new Promise(resolve => setTimeout(resolve, 1000));

    await cartPage.addSauceLabsRedTshirtToCart();
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(await cartPage.verifyCartBadge(6)).toBeTruthy();
    const screenshot6 = await page.screenshot();
    await testInfo.attach('After Adding Red T-shirt', { body: screenshot6, contentType: 'image/png' });

    await inventoryPage.selectCart();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const carttotal = await page.screenshot();
    await testInfo.attach('Cart Page', { body: carttotal, contentType: 'image/png' });

    // Verify all items are in cart
    await expect(page.locator(utilities.userInterface.manageSauceLabsBackpack)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsBikeLight)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsBoltTshirt)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsFleeceJacket)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsOnesie)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsRedTshirt)).toBeVisible();

    // Test removal functionality from cart and verify cart badge decrements accordingly
    expect(await cartPage.verifyCartBadge(6)).toBeTruthy();
    await inventoryPage.removeFromCart(utilities.userInterface.removeBackpackButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const screenshotRemove1 = await page.screenshot();
    await testInfo.attach('After Removing Backpack', { body: screenshotRemove1, contentType: 'image/png' });

    await expect(page.locator(utilities.userInterface.manageSauceLabsBackpack)).not.toBeVisible();
    expect(await cartPage.verifyCartBadge(5)).toBeTruthy();

    await inventoryPage.removeFromCart(utilities.userInterface.removeBikeLightButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const screenshotRemove2 = await page.screenshot();
    await testInfo.attach('After Removing Bike Light', { body: screenshotRemove2, contentType: 'image/png' });

    await expect(page.locator(utilities.userInterface.manageSauceLabsBikeLight)).not.toBeVisible();
    expect(await cartPage.verifyCartBadge(4)).toBeTruthy();

    await inventoryPage.removeFromCart(utilities.userInterface.removeBoltTshirtButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const screenshotRemove3 = await page.screenshot();
    await testInfo.attach('After Removing Bolt T-shirt', { body: screenshotRemove3, contentType: 'image/png' });

    await expect(page.locator(utilities.userInterface.manageSauceLabsBoltTshirt)).not.toBeVisible();
    expect(await cartPage.verifyCartBadge(3)).toBeTruthy();

    await inventoryPage.removeFromCart(utilities.userInterface.removeFleeceJacketButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const screenshotRemove4 = await page.screenshot();
    await testInfo.attach('After Removing Fleece Jacket', { body: screenshotRemove4, contentType: 'image/png' });

    await expect(page.locator(utilities.userInterface.manageSauceLabsFleeceJacket)).not.toBeVisible();
    expect(await cartPage.verifyCartBadge(2)).toBeTruthy();

    await inventoryPage.removeFromCart(utilities.userInterface.removeOnesieButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const screenshotRemove5 = await page.screenshot();
    await testInfo.attach('After Removing Onesie', { body: screenshotRemove5, contentType: 'image/png' });

    await expect(page.locator(utilities.userInterface.manageSauceLabsOnesie)).not.toBeVisible();
    expect(await cartPage.verifyCartBadge(1)).toBeTruthy();

    await inventoryPage.removeFromCart(utilities.userInterface.removeRedTshirtButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const screenshotRemove6 = await page.screenshot();
    await testInfo.attach('After Removing Red T-shirt', { body: screenshotRemove6, contentType: 'image/png' });

    await expect(page.locator(utilities.userInterface.manageSauceLabsRedTshirt)).not.toBeVisible();
    await new Promise(resolve => setTimeout(resolve, 1000))

    await inventoryPage.selectContinueShopping();
    const continueshoppingpic = await page.screenshot();
    await testInfo.attach('Continue Shopping', { body: continueshoppingpic, contentType: 'image/png' });
    await new Promise(resolve => setTimeout(resolve, 1000));
});

 
  test('Inventory management test', async ({ page }, testInfo) => {
  const inventoryPage = new InventoryPage(page, utilities);
  const loginPage = new LoginPage(page);

  // Login
  await loginPage.goto(URL);
  await loginPage.login(process.env.USER1_USERNAME, process.env.USER1_PASSWORD, testInfo);
  await page.click(utilities.login.loginButton);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const loginScreenshot = await page.screenshot();
  await testInfo.attach('After Login', { body: loginScreenshot, contentType: 'image/png' });

  // Open items individually, verify items are visible then add to cart
  await inventoryPage.selectSauceLabBackpack();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpack)).toBeVisible();
  const backpackVisibleScreenshot = await page.screenshot();
  await testInfo.attach('Backpack Visible', { body: backpackVisibleScreenshot, contentType: 'image/png' });

  await inventoryPage.invetoryAddToCart();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpackRemove)).toBeVisible();
  const backpackAddedScreenshot = await page.screenshot();
  await testInfo.attach('Backpack Added to Cart', { body: backpackAddedScreenshot, contentType: 'image/png' });

  await inventoryPage.backToProducts();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await inventoryPage.selectSauceLabsBikeLight();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBikeLight)).toBeVisible();
  const bikeLightVisibleScreenshot = await page.screenshot();
  await testInfo.attach('Bike Light Visible', { body: bikeLightVisibleScreenshot, contentType: 'image/png' });

  await inventoryPage.invetoryAddToCart();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpackRemove)).toBeVisible();
  const bikeLightAddedScreenshot = await page.screenshot();
  await testInfo.attach('Bike Light Added to Cart', { body: bikeLightAddedScreenshot, contentType: 'image/png' });

  await inventoryPage.backToProducts();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.selectSauceLabsBoltTshirt();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBoltTshirt)).toBeVisible();
  const boltTshirtVisibleScreenshot = await page.screenshot();
  await testInfo.attach('Bolt T-shirt Visible', { body: boltTshirtVisibleScreenshot, contentType: 'image/png' });

  await inventoryPage.invetoryAddToCart();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpackRemove)).toBeVisible();
  const boltTshirtAddedScreenshot = await page.screenshot();
  await testInfo.attach('Bolt T-shirt Added to Cart', { body: boltTshirtAddedScreenshot, contentType: 'image/png' });

  await inventoryPage.backToProducts();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.selectSauceLabsFleeceJacket();
  await expect(page.locator(utilities.userInterface.manageSauceLabsFleeceJacket)).toBeVisible();
  const fleeceJacketVisibleScreenshot = await page.screenshot();
  await testInfo.attach('Fleece Jacket Visible', { body: fleeceJacketVisibleScreenshot, contentType: 'image/png' });

  await inventoryPage.invetoryAddToCart();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpackRemove)).toBeVisible();
  const fleeceJacketAddedScreenshot = await page.screenshot();
  await testInfo.attach('Fleece Jacket Added to Cart', { body: fleeceJacketAddedScreenshot, contentType: 'image/png' });

  await inventoryPage.backToProducts();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.selectSauceLabsSauceLabsOnesie();
  await expect(page.locator(utilities.userInterface.manageSauceLabsOnesie)).toBeVisible();
  const onesieVisibleScreenshot = await page.screenshot();
  await testInfo.attach('Onesie Visible', { body: onesieVisibleScreenshot, contentType: 'image/png' });

  await inventoryPage.invetoryAddToCart();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpackRemove)).toBeVisible();
  const onesieAddedScreenshot = await page.screenshot();
  await testInfo.attach('Onesie Added to Cart', { body: onesieAddedScreenshot, contentType: 'image/png' });

  await inventoryPage.backToProducts();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.selectSauceLabsRedTshirt();
  await expect(page.locator(utilities.userInterface.manageSauceLabsRedTshirt)).toBeVisible();
  const redTshirtVisibleScreenshot = await page.screenshot();
  await testInfo.attach('Red T-shirt Visible', { body: redTshirtVisibleScreenshot, contentType: 'image/png' });

  await inventoryPage.invetoryAddToCart();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpackRemove)).toBeVisible();
  const redTshirtAddedScreenshot = await page.screenshot();
  await testInfo.attach('Red T-shirt Added to Cart', { body: redTshirtAddedScreenshot, contentType: 'image/png' });

  await inventoryPage.backToProducts();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.selectCart();
  await new Promise(resolve => setTimeout(resolve, 1000));
  const cartPageScreenshot = await page.screenshot();
  await testInfo.attach('Cart Page', { body: cartPageScreenshot, contentType: 'image/png' });

  await inventoryPage.selectContinueShopping();
  await new Promise(resolve => setTimeout(resolve, 1000));
  const continueShoppingScreenshot = await page.screenshot();
  await testInfo.attach('Continue Shopping', { body: continueShoppingScreenshot, contentType: 'image/png' });

  await inventoryPage.selectCart();
  await new Promise(resolve => setTimeout(resolve, 1000));
  const cartPageScreenshotAgain = await page.screenshot();
  await testInfo.attach('Cart Page Again', { body: cartPageScreenshotAgain, contentType: 'image/png' });

  // Verify all items are in the cart
  await expect(page.locator(utilities.userInterface.manageSauceLabsBikeLight)).toBeVisible();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBoltTshirt)).toBeVisible();
  await expect(page.locator(utilities.userInterface.manageSauceLabsFleeceJacket)).toBeVisible();
  await expect(page.locator(utilities.userInterface.manageSauceLabsOnesie)).toBeVisible();
  await expect(page.locator(utilities.userInterface.manageSauceLabsRedTshirt)).toBeVisible();

  await inventoryPage.removeFromCart(utilities.userInterface.removeBackpackButton);
  await new Promise(resolve => setTimeout(resolve, 1000));
  const removedBackpackScreenshot = await page.screenshot();
  await testInfo.attach('Removed Backpack from Cart', { body: removedBackpackScreenshot, contentType: 'image/png' });

  //  Test removal functionality from cart
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpack)).not.toBeVisible();
  await inventoryPage.selectContinueShopping();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await expect(page.locator(utilities.userInterface.sauceLabsBackpackAddToCart)).toBeVisible();
  const continueShoppingAfterRemoveBackpackScreenshot = await page.screenshot();
  await testInfo.attach('Continue Shopping After Removing Backpack', { body: continueShoppingAfterRemoveBackpackScreenshot, contentType: 'image/png' });

  await inventoryPage.selectCart();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.removeFromCart(utilities.userInterface.removeBikeLightButton);
  await new Promise(resolve => setTimeout(resolve, 4000));
  const removedBikeLightScreenshot = await page.screenshot();
  await testInfo.attach('Removed Bike Light from Cart', { body: removedBikeLightScreenshot, contentType: 'image/png' });

  await expect(page.locator(utilities.userInterface.manageSauceLabsBikeLight)).not.toBeVisible();
  await inventoryPage.selectContinueShopping();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await expect(page.locator(utilities.userInterface.sauceLabsBikeLightAddToCart)).toBeVisible();
  const continueShoppingAfterRemoveBikeLightScreenshot = await page.screenshot();
  await testInfo.attach('Continue Shopping After Removing Bike Light', { body: continueShoppingAfterRemoveBikeLightScreenshot, contentType: 'image/png' });

  await inventoryPage.selectCart();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.selectContinueShopping();

  // Test filtering functionality from Z-A
  await page.locator(utilities.userInterface.filterDropdown).selectOption('za');
  await new Promise(resolve => setTimeout(resolve, 1000));
  const names = await inventoryPage.getProductNames();
  const sortedNamesDesc = [...names].sort((a, b) => b.localeCompare(a));
  expect(names).toEqual(sortedNamesDesc);
  const filterZAScreenshot = await page.screenshot();
  await testInfo.attach('Filter Z-A Applied', { body: filterZAScreenshot, contentType: 'image/png' });

  // Test filtering functionality from highest price to lowest price
  await page.locator(utilities.userInterface.filterDropdown).selectOption('hilo');
  await new Promise(resolve => setTimeout(resolve, 1000));
  const prices = await inventoryPage.getProductPrices();
  const sortedPricesDesc = [...prices].sort((a, b) => b - a);
  expect(prices).toEqual(sortedPricesDesc);
  const filterHiLoScreenshot = await page.screenshot();
  await testInfo.attach('Filter High to Low Price Applied', { body: filterHiLoScreenshot, contentType: 'image/png' });
});

 
  test('Checkout process test', async ({ page }, testInfo) => {
    const cartPage = new CartPage(page, utilities);
    const checkoutPage = new CheckoutPage(page, utilities);
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page, utilities);
  
    await loginPage.goto(URL);
    // Login as standard user
    await loginPage.login(process.env.USER1_USERNAME, process.env.USER1_PASSWORD, testInfo);
    await page.click(utilities.login.loginButton);
    const loginScreenshot = await page.screenshot();
    await testInfo.attach('After Login', { body: loginScreenshot, contentType: 'image/png' });
  
    // Add items to cart and verify cart badge increments accordingly
    await cartPage.addSauceLabsBackpackToCart();
    expect(await cartPage.verifyCartBadge(1)).toBeTruthy();   
    const backpackAddedScreenshot = await page.screenshot();
    await testInfo.attach('Add Backpack to Cart', { body: backpackAddedScreenshot, contentType: 'image/png' });
  
    await new Promise(resolve => setTimeout(resolve, 1000));
    await cartPage.addSauceLabsBikeLightToCart();
    expect(await cartPage.verifyCartBadge(2)).toBeTruthy();
    const bikeLightAddedScreenshot = await page.screenshot();
    await testInfo.attach('Add Bike Light to Cart', { body: bikeLightAddedScreenshot, contentType: 'image/png' });
  
    await cartPage.addSauceLabsBoltTshirtToCart();
    expect(await cartPage.verifyCartBadge(3)).toBeTruthy();
    const boltTshirtAddedScreenshot = await page.screenshot();
    await testInfo.attach('Add Bolt T-shirt to Cart', { body: boltTshirtAddedScreenshot, contentType: 'image/png' });
  
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    await cartPage.addSauceLabsFleeceJacket();
    expect(await cartPage.verifyCartBadge(4)).toBeTruthy();
    const fleeceJacketAddedScreenshot = await page.screenshot();
    await testInfo.attach('Add Fleece Jacket to Cart', { body: fleeceJacketAddedScreenshot, contentType: 'image/png' });
  
    await cartPage.addSauceLabsOnsieToCart();
    expect(await cartPage.verifyCartBadge(5)).toBeTruthy();
    const onesieAddedScreenshot = await page.screenshot();
    await testInfo.attach('Add Onesie to Cart', { body: onesieAddedScreenshot, contentType: 'image/png' });
    await new Promise(resolve => setTimeout(resolve, 1000));
  
    await cartPage.addSauceLabsRedTshirtToCart();
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(await cartPage.verifyCartBadge(6)).toBeTruthy();
    const redTshirtAddedScreenshot = await page.screenshot();
    await testInfo.attach('Add Red T-shirt to Cart', { body: redTshirtAddedScreenshot, contentType: 'image/png' });
  
    await inventoryPage.selectCart();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const cartPageScreenshot = await page.screenshot();
    await testInfo.attach('Cart Page', { body: cartPageScreenshot, contentType: 'image/png' });
  
    // Verify all items are in cart
    await expect(page.locator(utilities.userInterface.manageSauceLabsBackpack)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsBikeLight)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsBoltTshirt)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsFleeceJacket)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsOnesie)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsRedTshirt)).toBeVisible();
  
    // Proceed to checkout
    await page.locator(utilities.userInterface.checkoutButton).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const checkoutClickedScreenshot = await page.screenshot();
    await testInfo.attach('Checkout Clicked', { body: checkoutClickedScreenshot, contentType: 'image/png' });
  
    // Fill in checkout information
    await page.locator(utilities.userInterface.firstNameInput).fill(process.env.USER_FIRST_NAME ?? '');
    await page.locator(utilities.userInterface.lastNameInput).fill(process.env.USER_LAST_NAME ?? '');
    await page.locator(utilities.userInterface.postalCodeInput).fill(process.env.USER_POSTAL_CODE ?? '');
    const checkoutFormFilledScreenshot = await page.screenshot();
    await testInfo.attach('Checkout Form Filled', { body: checkoutFormFilledScreenshot, contentType: 'image/png' });
  
    // Continue to overview
    await page.locator(utilities.userInterface.continueButton).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const overviewPageScreenshot = await page.screenshot();
    await testInfo.attach('Overview Page', { body: overviewPageScreenshot, contentType: 'image/png' });
  
    // Verify total amount matches sum of item prices
    const subtotalText = await page.locator('[data-test="subtotal-label"]').textContent() ?? '';
    const subtotalAmount = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    await checkoutPage.determineTotalAmount().then(aggregatePrice => {
      expect(aggregatePrice).toBeCloseTo(subtotalAmount, 2);
    });
  
    // Finish checkout
    await checkoutPage.finishCheckout();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const finishedCheckoutScreenshot = await page.screenshot();
  
    // Verify order confirmation
    const confirmationText = await checkoutPage.getOrderConfirmationText();
    expect(confirmationText).toContain('Thank you for your order!');
    const orderConfirmedScreenshot = await page.screenshot();
    await testInfo.attach('Order Confirmation', { body: orderConfirmedScreenshot, contentType: 'image/png' });
  
    // Return to home page
    await page.locator(utilities.userInterface.backHomeButton).click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const homePageScreenshot = await page.screenshot();
    await testInfo.attach('Home Page After Order', { body: homePageScreenshot, contentType: 'image/png' });
  });
});

//Run the test in serial mode to maintain the booking ID state
  test.describe.configure({ mode: 'serial' });
  test.describe('Restful Booker Booking CRUD operations', () => {
  let token= '';
  let bookingId = '';
  const booking_id = utilities.bookingID
 
  test.beforeAll(async ({ request }) => {
    token = await loginApi(request);
  });
  test('Create Booking', async ({ request }) => {
    const bookingData = {
      firstname: 'John',
      lastname: 'Doe',
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-10-20',
        checkout: '2025-10-22',
      },
      additionalneeds: 'Breakfast',
    };
    const response = await request.post(`${baseURL}${endpoints.booking}`, {
      data: bookingData,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('bookingid');
 
    // Extracts the booking_id returned by the API
    const newBookingId = body.bookingid;
 
    // Read current utilities.json data
    const fileContent = await fs.readFile(utilitiesPath, 'utf8');
    const utilitiesData = JSON.parse(fileContent);
 
    // Update booking_id
    utilitiesData.bookingID = newBookingId;
 
    // Write the updated data back to utilities.json with formatting
    await fs.writeFile(utilitiesPath, JSON.stringify(utilitiesData, null, 2), 'utf8');
 
    console.log(`Updated booking_id in utilities.json to: ${newBookingId}`);
 
    await new Promise(resolve => setTimeout(resolve, 5000));
  });
 
  
  test('Get Booking Details', async ({ request }) => {
    // run flaky test twice to avoid false fail 
    for (let i = 0; i < 3; i++) {
      const response = await request.get(`${baseURL}${endpoints.booking}/${booking_id}`, {
        headers: {
          Accept: 'application/json',
        },
      });
      await new Promise(resolve => setTimeout(resolve, 2000));
      expect(response.status()).toBe(200);
      const body = await response.json();
      console.log(JSON.stringify({body}))
      expect(body.firstname).toBe('John');
      expect(body.lastname).toBe('Doe');
    };
  });

 
  test('Update Booking', async ({ request }) => {
    const updateData = {
      firstname: 'Jane',
      lastname: 'Doe',
      totalprice: 150,
      depositpaid: false,
      bookingdates: {
        checkin: '2025-10-21',
        checkout: '2025-10-23',
      },
      additionalneeds: 'Lunch',
    };
    const response = await request.put(`${baseURL}${endpoints.booking}/${booking_id}`, {
      data: updateData,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe('Jane');
    await new Promise(resolve => setTimeout(resolve, 5000));
  });
 
  test('Delete Booking', async ({ request }) => {
    const response = await request.delete(`${baseURL}${endpoints.booking}/${booking_id}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
    expect(response.status()).toBe(201);
 
    const verify_deletion_response = await request.get(`${baseURL}${endpoints.booking}/${booking_id}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    expect(verify_deletion_response.status()).toBe(404);
   
   
  });
});