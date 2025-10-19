// @ts-check
import { test, expect } from '@playwright/test';
//import { LoginPage } from "../pages/UI/ui_login.js";
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

const users = [
  { username: process.env.USER1_USERNAME, password: process.env.USER1_PASSWORD },
  { username: process.env.USER2_USERNAME, password: process.env.USER2_PASSWORD },
  { username: process.env.USER3_USERNAME, password: process.env.USER3_PASSWORD },
];

test.describe('Use interface tests', () => {
  users.forEach(({ username, password }) => {
    test(`User login as ${username}`, async ({ page,  }, testInfo) => {
      // Navigate to the login page
      await page.goto('https://www.saucedemo.com/');

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

      // Wait 5 seconds after login
      await page.waitForTimeout(1000);
      // Assert that the login was successful by checking for an element that appears after login
      if (username === process.env.USER2_USERNAME) {
        const errorScreenshot = await page.screenshot();
        await testInfo.attach('Login Error', {
          body: errorScreenshot,
          contentType: 'image/png',
        });
        await expect(page.locator(utilities.login.errorMessage)).toBeVisible();
      } else {
          // For successful login, attach screenshot of inventory list
        const successScreenshot = await page.screenshot();
        await testInfo.attach('Logged-in', {
          body: successScreenshot,
          contentType: 'image/png',
        });
        await expect(page.locator('.inventory_list')).toBeVisible();
        // Optionally, logout to reset state for next test
      await page.click('#react-burger-menu-btn');
      await page.click('#logout_sidebar_link');
      // Attach screenshot after logout
        const logoutScreenshot = await page.screenshot();
        await testInfo.attach('After Logout', {
          body: logoutScreenshot,
          contentType: 'image/png',
        });
      await expect(page.locator('#login-button')).toBeVisible();
    }
  });  
  });


  test('Shopping cart functionality', async ({ page }, testInfo) => {
    const inventoryPage = new InventoryPage(page, utilities);
    const cartPage = new CartPage(page, utilities);
    const loginPage = new LoginPage (page); 

    await loginPage.goto();
    // Login as standard user
    await loginPage.login(process.env.USER1_USERNAME, process.env.USER1_PASSWORD, testInfo);
    await page.click(utilities.login.loginButton);

    await cartPage.addSauceLabsBackpackToCart();
    expect(await cartPage.verifyCartBadge(1)).toBeTruthy();
    // Add items to cart    
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    await cartPage.addSauceLabsBikeLightToCart();
    expect(await cartPage.verifyCartBadge(2)).toBeTruthy();

    await cartPage.addSauceLabsBoltTshirtToCart();
    expect(await cartPage.verifyCartBadge(3)).toBeTruthy();

    await new Promise(resolve => setTimeout(resolve, 1000));

    await cartPage.addSauceLabsFleeceJacket();
    expect(await cartPage.verifyCartBadge(4)).toBeTruthy();

    await cartPage.addSauceLabsOnsieToCart();
    expect(await cartPage.verifyCartBadge(5)).toBeTruthy();
    await new Promise(resolve => setTimeout(resolve, 1000));

    await cartPage.addSauceLabsRedTshirtToCart();

    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(await cartPage.verifyCartBadge(6)).toBeTruthy();

    await inventoryPage.selectCart();
    await new Promise(resolve => setTimeout(resolve, 1000));

  // Verify all items are in cart
    await expect(page.locator(utilities.userInterface.manageSauceLabsBackpack)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsBikeLight)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsBoltTshirt)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsFleeceJacket)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsOnesie)).toBeVisible();
    await expect(page.locator(utilities.userInterface.manageSauceLabsRedTshirt)).toBeVisible();

  
    expect(await cartPage.verifyCartBadge(6)).toBeTruthy();
    await inventoryPage.removeFromCart(utilities.userInterface.removeBackpackButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Verify backpack removed from cart
    await expect(page.locator(utilities.userInterface.manageSauceLabsBackpack)).not.toBeVisible();
    
    expect(await cartPage.verifyCartBadge(5)).toBeTruthy();
    await inventoryPage.removeFromCart(utilities.userInterface.removeBikeLightButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Verify bike light removed from cart
    await expect(page.locator(utilities.userInterface.manageSauceLabsBikeLight)).not.toBeVisible();

    expect(await cartPage.verifyCartBadge(4)).toBeTruthy();
    await inventoryPage.removeFromCart(utilities.userInterface.removeBoltTshirtButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Verify bolt tshirt removed from cart
    await expect(page.locator(utilities.userInterface.manageSauceLabsBoltTshirt)).not.toBeVisible();

    expect(await cartPage.verifyCartBadge(3)).toBeTruthy();
    await inventoryPage.removeFromCart(utilities.userInterface.removeFleeceJacketButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Verify fleece jacket removed from cart
    await expect(page.locator(utilities.userInterface.manageSauceLabsFleeceJacket)).not.toBeVisible();

    expect(await cartPage.verifyCartBadge(2)).toBeTruthy();
    await inventoryPage.removeFromCart(utilities.userInterface.removeOnesieButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Verify onesie removed from cart
    await expect(page.locator(utilities.userInterface.manageSauceLabsOnesie)).not.toBeVisible();   

    expect(await cartPage.verifyCartBadge(1)).toBeTruthy();
    await inventoryPage.removeFromCart(utilities.userInterface.removeRedTshirtButton);
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Verify red tshirt removed from cart
    await expect(page.locator(utilities.userInterface.manageSauceLabsRedTshirt)).not.toBeVisible();
    await new Promise(resolve => setTimeout(resolve, 1000))
    await inventoryPage.selectContinueShopping();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test('Inventory management test', async ({ page }, testInfo) => {
  const inventoryPage = new InventoryPage(page, utilities);
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  // Login first
  await loginPage.login(process.env.USER1_USERNAME, process.env.USER1_PASSWORD, testInfo);
  await page.click(utilities.login.loginButton);
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.selectSauceLabBackpack();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpack)).toBeVisible();
  await inventoryPage.invetoryAddToCart();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpackRemove)).toBeVisible();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.backToProducts();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.selectSauceLabsBikeLight();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBikeLight)).toBeVisible();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await inventoryPage.invetoryAddToCart();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpackRemove)).toBeVisible();
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Verify bike light added to cart  
  

  await inventoryPage.backToProducts();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.selectSauceLabsBoltTshirt();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBoltTshirt)).toBeVisible();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await inventoryPage.invetoryAddToCart();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpackRemove)).toBeVisible();
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Verify bolt tshirt added to cart  
  
  await inventoryPage.backToProducts();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.selectSauceLabsFleeceJacket();
  await expect(page.locator(utilities.userInterface.manageSauceLabsFleeceJacket)).toBeVisible();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await inventoryPage.invetoryAddToCart();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpackRemove)).toBeVisible();
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Verify fleece jacket added to cart  
  
  await inventoryPage.backToProducts();
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  await inventoryPage.selectSauceLabsSauceLabsOnesie();
  await expect(page.locator(utilities.userInterface.manageSauceLabsOnesie)).toBeVisible();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await inventoryPage.invetoryAddToCart();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpackRemove)).toBeVisible();
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Verify onesie added to cart  
  
  await inventoryPage.backToProducts();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.selectSauceLabsRedTshirt();
  await expect(page.locator(utilities.userInterface.manageSauceLabsRedTshirt)).toBeVisible();
  await new Promise(resolve => setTimeout(resolve, 1000));
  await inventoryPage.invetoryAddToCart();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpackRemove)).toBeVisible();
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Verify red tshirt added to cart  
  
  await inventoryPage.backToProducts();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.selectCart();
  await new Promise(resolve => setTimeout(resolve, 1000));

  await inventoryPage.selectContinueShopping();
  await new Promise(resolve => setTimeout(resolve, 1000));


  await inventoryPage.selectCart();
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Verify all items are in cart
  await expect(page.locator(utilities.userInterface.manageSauceLabsBikeLight)).toBeVisible();
  await expect(page.locator(utilities.userInterface.manageSauceLabsBoltTshirt)).toBeVisible();
  await expect(page.locator(utilities.userInterface.manageSauceLabsFleeceJacket)).toBeVisible();
  await expect(page.locator(utilities.userInterface.manageSauceLabsOnesie)).toBeVisible();
  await expect(page.locator(utilities.userInterface.manageSauceLabsRedTshirt)).toBeVisible();

  await inventoryPage.removeBackpackFromCart();
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Verify backpack removed from cart
  await expect(page.locator(utilities.userInterface.manageSauceLabsBackpack)).not.toBeVisible();

  // // Optionally, you can add more items and verify each one
  // await inventoryPage.selectSauceLabsFleeceJacket();
  // await inventoryPage.invetoryAddToCart();
  // await expect(page.locator(utilities.inventory_Management.manageSauceLabsFleeceJacket)).toBeVisible();
  // await inventoryPage.backToProducts();

  // // Optionally, you can add more items and verify each one

  // // Verify inventory list is visible
  // await expect(page.locator(utilities.inventory_Management.inventoryList)).toBeVisible();
  // // Check inventory count
  // const count = await inventoryPage.getInventoryCount();
  // expect(count).toBeGreaterThan(0);

  // // Add backpack to cart & verify button changes to remove
  // await inventoryPage.addBackpackToCart();
  // await expect(page.locator(utilities.inventory_Management.removeBackpackButton)).toBeVisible();

  // // Remove backpack from cart
  // await inventoryPage.removeBackpackFromCart();
  // await expect(page.locator(utilities.inventory_Management.addBackpackButton)).toBeVisible();

  // // Filter items by price low to high
  // await inventoryPage.selectFilter('Price (low to high)');
  // const firstItemName = await inventoryPage.getFirstItemName();
  // expect(firstItemName).toBeTruthy();

  // // Optionally verify items get re-sorted by filter logic

  // // Logout
  // await page.click('#react-burger-menu-btn');
  // await page.click('#logout_sidebar_link');


});

test('Checkout process test', async ({ page }) => {
  const cartPage = new CartPage(page, utilities);
  const checkoutPage = new CheckoutPage(page, utilities);
  const loginPage = new LoginPage(page);

  // Login as standard user
  await loginPage.login(process.env.USER1_USERNAME, process.env.USER1_PASSWORD);
  await page.click(utilities.login.loginButton);

  // Add an item to cart
  await cartPage.addSauceLabsBackpackToCart();

  // Start checkout
  await checkoutPage.startCheckout();

  // Fill checkout information (use example data or environment variables)
  await checkoutPage.enterCheckoutInformation('John', 'Doe', '12345');

  // Continue to overview
  await checkoutPage.continueCheckout();

  // Finish checkout
  await checkoutPage.finishCheckout();

  // Verify order confirmation
  const confirmationText = await checkoutPage.getOrderConfirmationText();
  expect(confirmationText).toContain('THANK YOU FOR YOUR ORDER');
});
});

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

    // Extract the booking_id returned by the API
    const newBookingId = body.bookingid;

    // Read current utilities.json data
    const fileContent = await fs.readFile(utilitiesPath, 'utf8');
    const utilitiesData = JSON.parse(fileContent);

    // Update booking_id
    utilitiesData.bookingID = newBookingId;

    // Write the updated data back to utilities.json with formatting
    await fs.writeFile(utilitiesPath, JSON.stringify(utilitiesData, null, 2), 'utf8');

    console.log(`Updated booking_id in utilities.json to: ${newBookingId}`);
    // bookingId = body.bookingid;
    // console.log(JSON.stringify(body, null, 2));

    await new Promise(resolve => setTimeout(resolve, 5000));
  });

  test('Get Booking Details', async ({ request }) => {
    const response = await request.get(`${baseURL}${endpoints.booking}/${booking_id}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    console.log(JSON.stringify({body}))
    expect(body.firstname).toBe('John');
    expect(body.lastname).toBe('Doe');
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