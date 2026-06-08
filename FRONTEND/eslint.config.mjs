import eslint from "@eslint/js";
import nextPlugin from "eslint-config-next";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Base recommended configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // Next.js config
  // This replaces the old `extends: ["next/core-web-vitals", "next/typescript"]`
  // The default export from `eslint-config-next` is expected to be a flat config object/array.
  nextPlugin,

  // User's custom configurations
  {
    plugins: {
      prettier: prettierPlugin,
      "simple-import-sort": simpleImportSort,
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        React: "readonly", // Add React to globals, good practice for modern setups
      },
    },
    rules: {
      // Prettier rule
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
          singleQuote: false,
          semi: true,
        },
      ],

      // Import sort rules
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",

      "react-hooks/exhaustive-deps": "off",

      // Other custom rules from the user's config
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "prefer-const": "off",
      "@typescript-eslint/no-explicit-any": "warn",

      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "ignore" },
      ],

      "no-restricted-syntax": [
        "error",
        {
          selector:
            'ImportDeclaration[importKind!="type"][specifiers.0.type="ImportNamespaceSpecifier"]',
          message:
            "Do not use namespace imports (*). Import only what you need to reduce bundle size.",
        },
      ],

      "max-lines": [
        "error",
        { max: 300, skipBlankLines: true, skipComments: true },
      ],

      // Disable Next.js image element optimization warning
      "@next/next/no-img-element": "off",

      // Disable React hook compiler rules
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",

      // Disable non-critical build blocking rules
      "react/display-name": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },

  // Prettier config must be the last one to override other formatting rules.
  prettierConfig,
);
