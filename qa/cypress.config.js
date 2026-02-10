const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5400',
    supportFile: 'cypress/support/e2e.js',
    env: {
      apiUrl: 'http://localhost:8400'
    }
  }
});
