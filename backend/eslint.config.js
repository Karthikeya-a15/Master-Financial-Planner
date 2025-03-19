import globals from "globals";
import pluginJs from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
 
export default [
  {
    languageOptions: {
      ecmaVersion: "latest", // Supports latest ECMAScript features
      sourceType: "module",  // Enables ES Modules (import/export)
      globals: globals.node, // Enables browser-specific globals
    },
    plugins: {
      prettier: prettierPlugin, // Prettier integration
    },
    rules: {
      ...pluginJs.configs.recommended.rules,  
      ...prettierConfig.rules, // Disables ESLint rules conflicting with Prettier
      "no-unused-vars": "warn", // Warn for unused variables
      // "no-console": "warn", // Warn for console.log usage
    },
  },
];
 
 