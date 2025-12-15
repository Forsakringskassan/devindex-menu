import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import { rawPlugin } from "./rawPlugin.mjs";

const ctx = await esbuild.context({
    entryPoints: ["./src/local/index.html", "./src/local/local.mjs"],
    bundle: true,
    outdir: "public",
    loader: { ".html": "copy" },
    platform: "browser",
    plugins: [
        sassPlugin({
            type: "css-text",
        }),
        rawPlugin(),
    ],
});

const { hosts, port } = await ctx.serve({
    host: "0.0.0.0",
    port: 8080,
});

console.log(`Serving on http://${hosts[0]}:${port}`);
