require("@forsakringskassan/eslint-config/patch/modern-module-resolution");

module.exports = {
    root: true,
    extends: ["@forsakringskassan"],

    env: {
        browser: true,
    },

    rules: {
        "max-depth": ["error", 4],
    },

    overrides: [
        {
            files: ["*.cjs", "*.mjs"],
        },
        {
            files: ["./*.js", "scripts/*.[jt]s"],
            extends: ["@forsakringskassan/cli"],
        },
        {
            files: "*.ts",
            extends: ["@forsakringskassan/typescript"],
        },
        {
            files: "*.spec.[jt]s",
            extends: ["@forsakringskassan/jest"],
        },
        {
            files: ["*.cy.[jt]s", "*.pageobject.[jt]s"],
            extends: ["@forsakringskassan/cypress"],
        },
    ],
};
