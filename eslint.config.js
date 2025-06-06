import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default defineConfig([
  { files: ["./app/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    files: ["./app/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ["./app/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },

  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/array-type": ["error", { default: "generic" }],
    },
  },

  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    rules: {
      "react/no-unescaped-entities": "warn",
    },
  },

  globalIgnores([
    "build", 
    "public/build",
    ".react-router",
  ]),
]);
