import js from "@eslint/js";
import globals from "globals";

export default [
  // Include ESLint recommended baseline rules
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        // Browser globals for Web Components development
        window: "readonly",
        document: "readonly",
        console: "readonly",
        HTMLElement: "readonly",
        customElements: "readonly",
        customEvent: "readonly",
        Event: "readonly",
        ...globals.browser,
      }
    },
    rules: {
      // Custom project rule adjustments
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
      "semi": ["error", "always"]
    }
  }
];