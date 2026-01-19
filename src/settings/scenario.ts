/* eslint-disable @typescript-eslint/no-non-null-assertion -- disable */
import { deleteCookie, setCookie } from "@fkui/logic";

import { type ScenarioSetting, ONE_MONTH_IN_SECONDS } from "../menu";

const template = `
<template id="devindex-scenario">
  <span><!-- title --></span>
  <p><!-- description --></p>
  <button type="button">Activate scenario</button>
</template>
`;

function createElement(setting: ScenarioSetting): DocumentFragment {
    const template: HTMLTemplateElement =
        document.querySelector("#devindex-scenario")!;
    const clone = document.importNode(template.content, true);

    const title = clone.querySelector("span")!;
    const description = clone.querySelector("p")!;
    const button = clone.querySelector("button")!;

    title.textContent = setting.title;

    if (setting.description) {
        description.textContent = setting.description;
    } else {
        description.remove();
    }

    button.id = setting.key;

    button.addEventListener("click", () => {
        for (const [key, value] of Object.entries(setting.cookies)) {
            if (value === undefined) {
                deleteCookie(key);
            } else {
                setCookie({
                    name: key,
                    value,
                    timeLimitSeconds: ONE_MONTH_IN_SECONDS,
                });
            }
        }

        location.reload();
    });

    return clone;
}

export default { createElement, template };
