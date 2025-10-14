import styling from "./style.scss";
import client from "./client.js?raw"; //eslint-disable-line import/extensions -- nyttjar raw-loader
/**
 * @typedef {import("../../menu").SelectSettings} SelectSettings
 * @typedef {import("../../menu").LinkSettings} LinkSettings
 * @typedef {import("../../menu").Settings} Settings
 * @typedef {import("@forsakringskassan/apimock-express/mockfile").Mock} Mock
 * @typedef {import("@forsakringskassan/apimock-express/mockfile").MockMatcher} MockMatcher
 */

/**
 * @param {SelectSettings} setting
 * @returns {string}
 */
function generateOptionMarkupForSelect(setting) {
    const reload =
        setting.reloadOnChange !== undefined ? setting.reloadOnChange : true;
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
 * @param {LinkSettings} setting
 * @returns {string}
 */
function generateOptionMarkupForLink(setting) {
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
 * @param {Settings} setting
 * @returns {string}
 */
function generateOptionMarkupForTextInput(setting) {
    const description = setting.description
        ? `<p>${setting.description}</p>`
        : "";

    return `${setting.title} ${description} <br /> <input name="${setting.key}"  type="text"></input>`;
}

/**
 * @param {Settings} setting
 * @returns {string}
 */
function generateOptionMarkup(setting) {
    switch (setting.type) {
        case "select":
            return generateOptionMarkupForSelect(setting);
        case "links":
            return generateOptionMarkupForLink(setting);
        case "text":
            return generateOptionMarkupForTextInput(setting);
    }
    return "";
}

/**
 * Determines if an object that is either a {@link Mock} or {@link Settings}, in
 * fact is {@link Mock}.
 *
 * @param {Settings | Mock} userSettingsOrMock
 * @returns {userSettingsOrMock is Mock}
 */
function isMock(userSettingsOrMock) {
    return (
        "responses" in userSettingsOrMock ||
        "defaultResponse" in userSettingsOrMock
    );
}

/**
 * Get the first cookie from a mock matcher.
 *
 * @param {MockMatcher} matcher The mock matcher to search.
 * @returns {{ key: string; value: string; }} An object with a `key` and `value`
 * corresponding to the first cookie found in the matcher.
 */
function getFirstCookie(matcher) {
    const entries = Object.entries(matcher.request.cookies);
    const [key, value] = entries[0];
    return { key, value };
}

/**
 * Generate a devindex entry directly from a mock, by utilising the `meta.title`
 * and `responses[i].response.label` properties to get humanly readable strings.
 *
 * @param {Mock} mock The mock to get an entry from.
 * @returns {Settings} The entry generated from this mock.
 */
function entryFromMock(mock) {
    const { key } = getFirstCookie(mock.responses[0]);
    const title = mock.meta.title ?? key;
    const defaultEntry = {
        title: mock.defaultResponse?.label ?? "Default",
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
                    title: entry.response.label ?? value,
                    value: value,
                };
            }),
        ],
    };
}

const defaultSetting = {
    type: "select",
};

/**
 * @param {(Settings | Mock)[]} userSettingsAndMocks
 * @returns {void}
 */
export default (userSettingsAndMocks) => {
    let settingsMarkup = "";
    userSettingsAndMocks
        .map((userSettingOrMock) =>
            isMock(userSettingOrMock)
                ? entryFromMock(userSettingOrMock)
                : userSettingOrMock,
        )
        .forEach((userSetting) => {
            const setting = { ...defaultSetting, ...userSetting };
            settingsMarkup = settingsMarkup + generateOptionMarkup(setting);
        });

    /* Client CSS */
    document.head.insertAdjacentHTML("beforeend", `<style>${styling}</style>`);

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

    /* Client JS */
    const script = document.createElement("script");
    script.innerText = client;
    document.body.appendChild(script);
};
