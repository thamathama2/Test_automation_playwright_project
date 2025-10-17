// login.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = 'input[data-test="username"]';
    this.passwordInput = 'input[data-test="password"]';
    this.loginButton = 'input[data-test="login-button"]';
    this.errorMessage = 'div[data-test="error"]';
  }

  async goto() {
    await this.page.goto('https://www.saucedemo.com/');
  }

  async login(username, password) {
    await this.page.fill(this.usernameInput, username);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

  async getErrorMessage() {
    return this.page.textContent(this.errorMessage);
  }
}

module.exports = { LoginPage };
