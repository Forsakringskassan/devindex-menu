import { readFile } from "fs/promises";
import path from "path";
import babel from "@babel/core";

export function rawPlugin() {
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
