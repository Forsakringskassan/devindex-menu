import { defineConfig } from "cypress";
import htmlvalidate from "cypress-html-validate/plugin";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:8080",
        setupNodeEvents(on) {
            htmlvalidate.install(on, {
                rules: {
                    "require-sri": "off",
                },
            });
        },
    },
});
