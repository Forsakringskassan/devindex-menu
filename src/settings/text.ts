/* eslint-disable @typescript-eslint/no-non-null-assertion -- disable */
import { ElementIdService, findCookie, setCookie } from "@fkui/logic";

import { type TextSettings, ONE_MONTH_IN_SECONDS } from "../menu";

const template = `
<template id="devindex-text">
    <label for="devindex-text-input">dummy-label</label>
    <span><!-- description --></span>
    <br />
    <input type="text" id="devindex-text-input" tabindex="-1"></input>
</template>
`;

function createElement(setting: TextSettings): DocumentFragment {
    const template: HTMLTemplateElement =
        document.querySelector("#devindex-text")!;
    const clone = document.importNode(template.content, true);

    const label = clone.querySelector("label")!;
    const description = clone.querySelector("span")!;
    const input = clone.querySelector("input")!;

    const id = ElementIdService.generateElementId();

    input.name = setting.key;
    input.value = findCookie(input.name) ?? "";
    input.id = id;

    input.addEventListener("input", () => {
        setCookie({
            name: input.name,
            value: input.value,
            timeLimitSeconds: ONE_MONTH_IN_SECONDS,
        });
    });

    label.textContent = setting.title;
    label.setAttribute("for", id);

    if (setting.description) {
        description.textContent = setting.description;
    } else {
        description.remove();
    }

    return clone;
}

export default { createElement, template };
