/* eslint-disable @typescript-eslint/no-non-null-assertion -- disable */
import { findCookie, setCookie } from "@fkui/logic";

import { type TextSettings } from "../menu";

const template = `
<template id="devindex-text">
    <span><!-- title --></span>
    <p><!-- description --></p>
    <br />
    <input type="text"></input>
</template>
`;

const ONE_MONTH_IN_SECONDS = 2592000;
function createElement(setting: TextSettings): DocumentFragment {
    const template: HTMLTemplateElement =
        document.querySelector("#devindex-text")!;
    const clone = document.importNode(template.content, true);

    const title = clone.querySelector("span")!;
    const description = clone.querySelector("p")!;
    const input = clone.querySelector("input")!;

    input.name = setting.key;
    input.value = findCookie(input.name) ?? "";

    input.addEventListener("input", () => {
        setCookie({
            name: input.name,
            value: input.value,
            timeLimitSeconds: ONE_MONTH_IN_SECONDS,
        });
    });

    title.textContent = setting.title;

    if (setting.description) {
        description.textContent = setting.description;
    } else {
        description.remove();
    }

    return clone;
}

export default { createElement, template };
