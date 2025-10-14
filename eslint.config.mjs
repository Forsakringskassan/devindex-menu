import defaultConfig from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import cypressConfig from "@forsakringskassan/eslint-config-cypress";
import jestConfig from "@forsakringskassan/eslint-config-jest";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript";

export default [
    {
        name: "Ignored files",
        ignores: ["**/coverage/**", "**/dist/**", "**/node_modules/**"],
    },

    ...defaultConfig,

    cliConfig({
        files: ["*.{js,mjs,cjs}", "scripts/**/*.{js,ts,cjs,mjs}"],
    }),

    typescriptConfig({
        files: ["**/*.ts"],
    }),

    jestConfig({
        files: ["**/*.spec.[jt]s"],
    }),

    cypressConfig({
        files: ["**/*.cy.[jt]s", "**/*.pageobject.[jt]s"],
    }),

    {
        name: "Browser environment for client code",
        files: ["src/**/*.js"],
        languageOptions: {
            globals: {
                document: "readonly",
                window: "readonly",
                location: "readonly",
                sessionStorage: "readonly",
                localStorage: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                btoa: "readonly",
                atob: "readonly",
                fetch: "readonly",
                console: "readonly",
            },
        },
        rules: {
            "no-console": "warn",
        },
    },

    {
        name: "Allow console statements in client.js",
        files: ["src/client.js"],
        rules: {
            "no-console": "off",
        },
    },

    {
        name: "Project specific rules",
        files: ["**/*.{js,mjs,ts}"],
        rules: {
            "max-depth": ["error", 4],
        },
    },

    {
        name: "Allow extensions for raw imports",
        files: ["src/menu.js"],
        rules: {
            "import/extensions": "off",
        },
    },
];
