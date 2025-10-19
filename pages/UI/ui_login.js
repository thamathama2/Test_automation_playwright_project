require('dotenv').config();

class LoginPage {
  constructor(page) {
    this.page = page;
  }

  // Method to navigate to the login page
  async goto(url) {
    await this.page.goto(url);
  }

  // Async method to perform login and attach screenshot to the test report
  async login(username, password, testInfo) {
    await this.page.fill('#user-name', username);
    await this.page.fill('#password', password);

    // Optional: Uncomment to perform login click
    // await this.page.click('#login-button');

    // Capture and attach screenshot to test report using testInfo.attach()
    const screenshot = await this.page.screenshot();
    await testInfo.attach('Login Page Screenshot', {
      body: screenshot,
      contentType: 'image/png',
    });
  }
}

module.exports = LoginPage;
