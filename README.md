# @forsakringskassan/devindex-menu

> npm install --save-dev @forsakringskassan/devindex-menu

Menu for development mode that can be used with advantage together with [fapimock-express](https://www.npmjs.com/package/@forsakringskassan/apimock-express).

## Usage

The menu can be used in several types of applications. If you're using vue-cli, it can be used as follows:

```js
require("@forsakringskassan/devindex-menu")([
    {
        key: "slow-load",
        title: "Delay",
        reloadOnChange: true,
        execOnChange: "aGlobalMethod",
        options: [
            { title: "Normal loading", value: false },
            { title: "Slow loading", value: true },
        ],
    },
]);
```

When execOnChange is set to a value, the global function with this name will be called on onChange of the dropdown list.

For example usage see: http://stash.sfa.se/projects/EXP_TEMPL/repos/fia_sitevision_webapp_vue_bootstrapped_boilerplate/browse

## API

```js
[
    {
        key: String,
        title: String,
        type: String (optional, default, "select")
        description: String (optional),
        reloadOnChange: Boolean (optional, default: true),
        sessionStorage: Boolean (optional, default: false),
        execOnChange: String (optional),
        options: [], Array (see types below)
    },
]
```

## Use mocks directly

It's also possible to use mocks for `@forsakringskassan/apimock-express` directly.
In the types `MockMatcher` and `Mock` from `apimock-express` there is support for metadata that is read by the devindex-menu.

When defining the mock, add `meta.title` and `responses[i].response.label`.
These correspond to the dropdown label and the name of each option respectively.

```diff
 export default defineMock({
+    meta: {
+        title: "GET /dog",
+    },
     responses: [
         createResponseByCookie(
             cookie,
             "border-collie-200",
             {
+                label: "Border collie (200)",
                 body: dogBorderCollie,
             },
         ),
     ],
     defaultResponse: {
+        label: "Default – dachshund (200)",
         status: 200,
         body: dogDachshund,
     },
 );
```

Inside the application, the mock is then sent directly to `devindexMenu`.

```diff
 import devindexMenu from "@forsakringskassan/devindex-menu";
+import getDogMock from "dog-api/dist/api/private/v1/dog_get.js";

 devindexMenu([
     {
         key: "api-post-leash",
         title: "POST /leash",
         options: [{
             title: "Tracking leash (200)",
             value: "tracking-leash-200"
         }],
     },
+    getDogMock,
 ]);
```

### Type Definitions

#### select (default)

```json
{ title: String, value: String },
```

#### Links

```json
{ title: String, href: String },

```

#### SessionStorage - Pre-filling

If you specify `sessionStorage` as `true`, the value will be saved under `key` in `sessionStorage`.

In the example below, you'll get a `select` with the title `Pre-filling`. If you make a selection, `sessionStorage` will get a value `fk-dog-model`.

```js
import coco from "./tests/mock/prefilled/coco.json";
import fido from "./tests/mock/prefilled/fido.json";

require("@forsakringskassan/devindex-menu")([
    {
        key: "fk-dog-model",
        title: "Pre-filling",
        sessionStorage: true,
        options: [
            { title: "None", value: "" },
            { title: "Coco", value: coco },
            { title: "Fido", value: fido },
        ],
    },
]);
```

## Examples

```js
require("@forsakringskassan/devindex-menu")([
    {
        key: "disable-translate",
        title: "Text",
        options: [
            { title: "Translated text", value: "default" },
            { title: "Show text keys", value: "true" },
        ],
    },
    {
        type: "links",
        title: "Links",
        options: [
            {
                title: "Applicant reviews application for additional cost",
                href: "/#/review/8",
            },
        ],
    },
]);
```

## Development

To compile styling:
`npm run build`
