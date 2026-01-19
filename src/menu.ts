/* eslint-disable @typescript-eslint/restrict-template-expressions -- Technical debt */
/* eslint-disable @typescript-eslint/no-unsafe-assignment  -- Technical debt */
import {
    type Mock,
    type MockMatcher,
    type MockResponse,
    type StaticMockResponse,
} from "@forsakringskassan/apimock-express";

import client from "./client.js?raw"; // Using raw-loader for inline content
import scenarioElement from "./settings/scenario";
import textElement from "./settings/text";

import styling from "./style.scss";

export interface SelectOption {
    title: string;
    value: unknown;
}

export interface SelectSettings {
    type?: "select";
    key: string;
    title: string;
    reloadOnChange?: boolean;
    execOnChange?: string;
    description?: string;
    sessionStorage?: boolean;
    options: SelectOption[];
}

export interface LinkOption {
    title: string;
    href: string;
}

export interface LinkSettings {
    type: "links";
    title: string;
    description?: string;
    options: LinkOption[];
}

export interface TextSettings {
    type: "text";
    key: string;
    title: string;
    description?: string;
    options: LinkOption[];
}

export interface ScenarioSetting {
    type: "scenario";
    key: string;
    title: string;
    description?: string;
    cookies: Record<string, string | undefined>;
}

export type Settings =
    | SelectSettings
    | LinkSettings
    | TextSettings
    | ScenarioSetting;

export const ONE_MONTH_IN_SECONDS = 2592000;

const settingsNodes: DocumentFragment[] = [];

function evaluateMock<T>(mock: MockResponse<T>): StaticMockResponse<T> {
    /* if the mock is a `DynamicMockResponse` evaluate the function */
    if (typeof mock === "function") {
        const req = {};
        return mock(req);
    } else {
        return mock;
    }
}

/**
 * @param settings - The setting to generate markup for.
 * @returns Returns the generated markup as a string.
 */
function generateOptionMarkupForSelect(setting: SelectSettings): string {
    const reload = setting.reloadOnChange ?? true;
    const description = setting.description
        ? `<p>${setting.description}</p>`
        : "";
    const execOnChange = setting.execOnChange
        ? ` data-exec-on-change="${setting.execOnChange}"`
        : "";
    let markup = `<label for="${setting.key}" class="label">${setting.title}</label>${description}<select id="${setting.key}" data-sessionStorage="${setting.sessionStorage}" data-reload="${reload}" ${execOnChange} name="${setting.key}" tabindex="-1">`;
    setting.options.forEach((option) => {
        const stateJson =
            typeof option.value === "string"
                ? option.value
                : JSON.stringify(option.value, null, 2);
        const optionValue = setting.sessionStorage
            ? btoa(stateJson)
            : option.value;
        markup += `<option value="${optionValue}">${option.title}</option>`;
    });
    markup = `${markup}</select>`;
    return markup;
}

/**
 * @param LinkSettings - The setting to generate markup for.
 * @returns Returns the generated markup as a string.
 */
function generateOptionMarkupForLink(setting: LinkSettings): string {
    const description = setting.description
        ? `<p>${setting.description}</p>`
        : "";

    let markup = `${setting.title} ${description}<ul>`;
    setting.options.forEach((option) => {
        markup += `<li><a href="${option.href}">${option.title}</a></li>`;
    });
    markup = `${markup}</ul>`;
    return markup;
}

/**
 * @param setting - The setting to generate markup for.
 * @returns Returns the generated markup as a string.
 */
function generateOptionMarkup(setting: Settings): string {
    switch (setting.type) {
        case "select":
            return generateOptionMarkupForSelect(setting);
        case "links":
            return generateOptionMarkupForLink(setting);
        case "text":
            settingsNodes.push(textElement.createElement(setting));
            break;
        case "scenario":
            settingsNodes.push(scenarioElement.createElement(setting));
    }
    return "";
}

/**
 * Determines if an object that is either a {@link Mock} or {@link Settings}, in
 * fact is {@link Mock}.
 *
 * @param userSettingsOrMock - settings or mock to check
 * @returns True if the object is a {@link Mock}, false otherwise.
 */
function isMock(
    userSettingsOrMock: Settings | Mock,
): userSettingsOrMock is Mock {
    return (
        "responses" in userSettingsOrMock ||
        "defaultResponse" in userSettingsOrMock
    );
}

/**
 * Get the first cookie from a mock matcher.
 *
 * @param matcher -The mock matcher to search.
 * @returns An object with a `key` and `value`
 * corresponding to the first cookie found in the matcher.
 */
function getFirstCookie(matcher: MockMatcher): { key: string; value: string } {
    const entries = Object.entries(matcher.request.cookies ?? {});
    const [key, value] = entries[0];
    return { key, value };
}

/**
 * Generate a devindex entry directly from a mock, by utilising the `meta.title`
 * and `responses[i].response.label` properties to get humanly readable strings.
 *
 * @param mock - The mock to get an entry from.
 * @returns The entry generated from this mock.
 */
function entryFromMock(mock: Mock): Settings {
    if (!mock.responses || mock.responses.length === 0) {
        throw new Error(
            "Mock must have at least one response to generate entry from.",
        );
    }
    const { key } = getFirstCookie(mock.responses[0]);
    const title = mock.meta?.title ?? key;
    const defaultEntry = {
        title: evaluateMock(mock.defaultResponse).label ?? "Default",
        value: "default",
    };

    return {
        type: "select",
        key,
        title,
        options: [
            defaultEntry,
            ...mock.responses.map((entry) => {
                const { value } = getFirstCookie(entry);

                return {
                    title: evaluateMock(entry.response).label ?? value,
                    value,
                };
            }),
        ],
    };
}

const defaultSetting = {
    type: "select" as const,
};

/**
 * @param userSettingsAndMocks - An array of user settings and/or mocks to generate the menu from.
 */
export default (userSettingsAndMocks: Array<Settings | Mock>): void => {
    /* Client CSS */
    document.head.insertAdjacentHTML("beforeend", `<style>${styling}</style>`);
    document.body.insertAdjacentHTML(
        "beforeend",
        `
        ${textElement.template}
        ${scenarioElement.template}
     `,
    );

    let settingsMarkup = "";
    userSettingsAndMocks
        .map((userSettingOrMock) =>
            isMock(userSettingOrMock)
                ? entryFromMock(userSettingOrMock)
                : userSettingOrMock,
        )
        .forEach((userSetting) => {
            const setting: Settings = { ...defaultSetting, ...userSetting };
            settingsMarkup = settingsMarkup + generateOptionMarkup(setting);
        });

    /* Markup */
    document.body.insertAdjacentHTML(
        "beforeend",
        `
    <div class="secret-menu" aria-hidden="true">
        <button type="button" class="toggle" onclick="toggleMenu()">
            <span></span>
            <span></span>
            <span></span>
            <span class="sr-only">Hemlig meny</span>
        </button>
        <div class="menu">
            ${settingsMarkup}
        </div>
    </div>`,
    );

    const menu = document.querySelector(".menu");
    if (menu) {
        for (const node of settingsNodes) {
            menu.append(node);
        }
    }

    /* Client JS */
    const script = document.createElement("script");
    script.innerText = client;
    document.body.appendChild(script);
};
