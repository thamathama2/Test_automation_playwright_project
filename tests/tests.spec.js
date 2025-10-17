// @ts-check
import { test, expect } from '@playwright/test';
import { LoginPage } from "../pages/UI/ui_login.js";
import utilities from '../utilities/utilities.json';
import { loginApi } from '../pages/API/api_login.js';
import { baseURL, endpoints } from '../pages//API/api.js';


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
    bookingId = body.bookingid;
    console.log(JSON.stringify(body, null, 2));

    
  });

  test('Get Booking Details', async ({ request }) => {
    const booking_id = utilities.bookingID
    const response = await request.get(`${baseURL}${endpoints.booking}/${booking_id}`, {
      headers: {
        Accept: 'application/json',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe('Josh');
    expect(body.lastname).toBe('Allen');
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
    const response = await request.put(`${baseURL}${endpoints.booking}/${bookingId}`, {
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
    const response = await request.delete(`${baseURL}${endpoints.booking}/${bookingId}`, {
      headers: {
        Cookie: `token=${token}`,
      },
    });
    expect(response.status()).toBe(201); // Restful-Booker returns 201 on successful deletion
  });
});