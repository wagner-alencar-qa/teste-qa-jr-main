const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5400",
    apiUrl: "http://localhost:8400",
    supportFile: "cypress/support/e2e.js"
  }
});