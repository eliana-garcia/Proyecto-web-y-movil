import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://hola.com",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});