import { rm } from "node:fs/promises";
import { build } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { rawPlugin } from "./rawPlugin.mjs";

await rm("./dist", { force: true, recursive: true });

const formats = ["cjs", "esm"];

for (const format of formats) {
    await build({
        entryPoints: ["./src/menu.ts", "src/pageobjects.ts"],
        bundle: true,
        outdir: `dist/${format}`,
        platform: "browser",
        format,
        target: "es2020",
        plugins: [
            sassPlugin({
                type: "css-text",
            }),
            rawPlugin(),
        ],
    });
}
