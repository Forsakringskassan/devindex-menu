import defaultConfig, { globals } from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import cypressConfig from "@forsakringskassan/eslint-config-cypress";
import jestConfig from "@forsakringskassan/eslint-config-jest";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript";
import typeinfoConfig from "@forsakringskassan/eslint-config-typescript-typeinfo";

export default [
    {
        name: "Ignored files",
        ignores: [
            "**/coverage/**",
            "**/dist/**",
            "**/temp/**",
            "**/node_modules/**",
        ],
    },

    ...defaultConfig,

    cliConfig(),
    typescriptConfig(),
    typeinfoConfig(import.meta.dirname, {
        files: ["src/**/*.ts"],
    }),
    jestConfig(),
    cypressConfig(),

    {
        name: "Browser environment for client code",
        files: ["src/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
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
        name: "Allow extensions for raw imports",
        files: ["src/menu.js"],
        rules: {
            "import/extensions": "off",
        },
    },
];
