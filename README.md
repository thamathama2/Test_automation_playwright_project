# Welcome

Welcome to the **Playwright API and UI Testing Project Framework**.
<br>
This project uses [**_Playwright_**](https://playwright.dev/docs/intro) with [**_Typescript_**](https://www.javascriptlang.org/docs/) to create and run the Automated UI and API Tests for WebApps.
<br><br>

# Prerequisites

1. Latest version of [GitSCM](https://git-scm.com/downloads) is installed/supported on your system
2. Latest version of [NodeJS](https://nodejs.org/en/download) is installed/supported on your system
3. IDE that supports ESLint & Prettier ([VSCode](https://code.visualstudio.com/download) will be used as the team standard)

<br>

# Setup

### 1. Clone the repo and setup your project

1. Clone the repo into a suitable folder on your local machine (preferably 'C:\repos' to keep the path as short as possible)
2. Once cloned, open up the repository in your IDE of choice
3. Ensure your working repository is **'..\playwright-ui-component-test-skeleton'** in your terminal for all commands below

### 2. Setting up your IDE

1. Install the following extensions on your IDE:

   - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
   - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
   - [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

### 3. Run the following commands:

1. Install all dependencies for project:

   ```
   npm i
   ```

2. Install all browsers for playwright:

   ```
   npx playwright install
   ```
3. Install the "dotenv" package for playwright:

   ```
   npm install dotenv

   ```
4. Install monochart package for playwright:

   ```
   npm i -D monocart-reporter


   ```
   

### 4. Setting up the .env file

1. Create an '.env' file in the root directory

   - Or you can type the following in cmd at the root directory of the project:

     ```
     CMD         -   'type nul > .env'
     Powershell  -   'ni .env'
     Terminal    -   'touch .env'
     ```

2. Populate the .env file with the necessary variables values

   - The minimum required variables to be populated are:

     ```
LOGIN_URL=https://www.saucedemo.com/
USER1_ID=
USER1_USERNAME=
USER1_PASSWORD=

USER2_ID=
USER2_USERNAME=
USER2_PASSWORD=

USER3_ID=
USER3_USERNAME=
USER3_PASSWORD=

USER4_ID=
USER4_USERNAME=
USER4_PASSWORD=

USER_FIRST_NAME=
USER_LAST_NAME=
USER_POSTAL_CODE=
     ```

### 5. You should be good to go to - Run those tests locally!

1. Run the tests using the Playwright Test for VSCode Extension or run the command below in terminal:

   ```
   npx playwright test
   ```

  <br>

# Test Reporting
1. The test evidence aritifact will be in the monocart-report folder that will be created when you run command number 4
2. When you run the pipeline on github the testevidence artifact can be downloaded from the upload playwright report folder
<br>

# Troubleshooting

## Unable to download dependencies

- ### If you are trying to download the dependencies for the project ('`npm i`' or '`npx playwright install`') and it is failing, try the following:

## Unable to run tests/Tests fail immediately

- ### If test fails immediately with a **browser** issue:

  - Ensure you have the playwright browsers installed by running '`npx playwright install`'

- ### If the test fails quoting an issue related to `.env`:

  - Ensure the `.env` file is created in the root directory of the project
  - Ensure all the required `.env` variables are populated

<br>

## Some Useful Playwright Commands

- Run all the the end-to-end tests:

  ```
  npx playwright test
  ```

- Start the interactive UI mode:

  ```
  npx playwright test --ui
  ```

- Run the tests only on Desktop Chrome:

  ```
  npx playwright test --project=chromium
  ```

- Run the tests in a specific file called 'example':

  ```
  npx playwright test example
  ```

- Run the tests in debug mode:

  ```
  npx playwright test --debug
  ```

- Auto generate tests with Codegen:
  ```
  npx playwright codegen
  ```
