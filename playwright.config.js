const { defineConfig } = require("playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 15_000,
  expect: { timeout: 5_000 },
  use: {
    baseURL: "http://127.0.0.1:4173",
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "python3 -m http.server 4173 --bind 127.0.0.1",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: true,
    timeout: 10_000,
  },
});
