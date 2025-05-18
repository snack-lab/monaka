import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.js"],
    root: true,
    env: {
      node: true,
      browser: true,
      es2024: true
    },
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    parserOptions: {
      ecmaVersion: "latest",
      ecmaFeatures: {
        experimentalObjectRestSpread: true
      },
      sourceType: "module"
    },
    rules: {
      "no-console": "off",
      "eqeqeq": "warn",
      "no-cond-assign": "off",
      "no-unused-vars": "error",
      "prettier/prettier": [
        "error",
        {
          "htmlWhitespaceSensitivity": "ignore"
        }
      ]
    }
  },
  {
    files: ["**/*.html"],
    plugins: {
        html,
    },
    language: "html/html",
    rules: {
        "html/no-duplicate-class": "error",
    }
  }
]);
