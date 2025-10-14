import { readFile } from "fs/promises";
import path from "path";
import babel from "@babel/core";
import { build } from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";

const formats = ["cjs", "esm"];

for (const format of formats) {
    await build({
        entryPoints: ["./src/menu.js", "src/pageobjects/pageobjects.ts"],
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

function rawPlugin() {
    return {
        name: "raw",
        setup(build) {
            build.onResolve({ filter: /\?raw$/ }, (args) => {
                return {
                    path: args.path,
                    pluginData: {
                        isAbsolute: path.isAbsolute(args.path),
                        resolveDir: args.resolveDir,
                    },
                    namespace: "raw-loader",
                };
            });
            build.onLoad(
                { filter: /\?raw$/, namespace: "raw-loader" },
                async (args) => {
                    const fullPath = args.pluginData.isAbsolute
                        ? args.path
                        : path.join(args.pluginData.resolveDir, args.path);
                    return {
                        contents: babel.transformSync(
                            await readFile(fullPath.replace(/\?raw$/, "")),
                            { sourceType: "script" },
                        ).code,
                        loader: "text",
                    };
                },
            );
        },
    };
}
