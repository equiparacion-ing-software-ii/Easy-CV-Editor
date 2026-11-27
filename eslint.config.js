import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
   // Baby step: primero auditamos src/ y configs; cypress/ lo sumamos aparte luego
   { ignores: ["dist", "node_modules", "cypress", "cypress.config.js"] },

   // 1. Aplicación (React 18 + Vite)
   {
      files: ["src/**/*.{js,jsx}"],
      languageOptions: {
         ecmaVersion: "latest",
         sourceType: "module",
         globals: {
            ...globals.browser,
            process: "readonly",
         },
         parserOptions: {
            ecmaFeatures: { jsx: true },
         },
      },
      settings: {
         react: { version: "detect" },
      },
      plugins: {
         react,
         "react-hooks": reactHooks,
         "react-refresh": reactRefresh,
      },
      rules: {
         ...js.configs.recommended.rules,
         ...react.configs.recommended.rules,
         ...react.configs["jsx-runtime"].rules,
         "react-hooks/rules-of-hooks": "error",
         "react-hooks/exhaustive-deps": "warn",
         "react/prop-types": "off",
         "no-empty": ["error", { allowEmptyCatch: true }],
         "react/no-unescaped-entities": "off",
         "no-unused-vars": [
            "warn",
            {
               argsIgnorePattern: "^_",
               varsIgnorePattern: "^_",
               caughtErrorsIgnorePattern: "^_",
            },
         ],
         "react-refresh/only-export-components": [
            "warn",
            { allowConstantExport: true },
         ],
      },
   },

   // 2. Tests unitarios (Vitest con globals: true)
   {
      files: ["src/tests/**/*.{js,jsx}"],
      languageOptions: {
         globals: {
            ...globals.browser,
            ...globals.node,
            vi: "readonly",
            describe: "readonly",
            it: "readonly",
            test: "readonly",
            expect: "readonly",
            beforeAll: "readonly",
            afterAll: "readonly",
            beforeEach: "readonly",
            afterEach: "readonly",
         },
      },
      rules: {
         "react-refresh/only-export-components": "off",
      },
   },

   // 3. Archivos de configuración Node
   {
      files: ["*.config.js"],
      languageOptions: {
         globals: {
            ...globals.node,
         },
      },
      rules: {
         ...js.configs.recommended.rules,
      },
   },
];
