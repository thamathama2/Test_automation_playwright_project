// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from "../pages/UI/ui_login.js";
import utilities from '../utilities/utilities.json';
import { loginApi } from '../pages/API/api_login.js';
import { baseURL, endpoints } from '../pages//API/api.js';
import fs from 'node:fs/promises';
import path from 'node:path';

const utilitiesPath = path.join(__dirname, '..', 'utilities', 'utilities.json');


// test.describe('SauceDemo Login Tests', () => {
//   for (const user of users) {
//     test(`Login test for ${user.id}`, async ({ page }) => {
//       const loginPage = new LoginPage(page);
//       await loginPage.goto();
//       await loginPage.login(user.username, user.password);

//       if (user.id === 'locked out user') {
//         // Expect error message for locked out user
//         await expect(loginPage.page.locator(loginPage.errorMessage)).toHaveText('Epic sadface: Sorry, this user has been locked out.');
//       } else {
//         // For other users, check URL for successful login
//         await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
//       }
//     });
//   }
  
// });

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