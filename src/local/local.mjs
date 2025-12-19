/* global document, window, location */
import menu from "../menu.ts";

window.callFunction = function () {
    location.replace("#function-called");
};

menu([
    {
        key: "slow-load",
        title: "Delay",
        reloadOnChange: true,
        options: [
            { title: "Normal loading", value: false },
            { title: "Slow loading", value: true },
        ],
    },
    {
        key: "exec-logic",
        title: "Menu with function call",
        description: "Calls a function on change.",
        execOnChange: "callFunction",
        reloadOnChange: false,
        options: [
            { title: "Option A", value: false },
            { title: "Option B", value: true },
        ],
    },
    {
        key: "option-session",
        title: "Save to session",
        sessionStorage: true,
        options: [
            { title: "Option A", value: { foo: "bar" } },
            { title: "Option B", value: { bar: "foo" } },
        ],
    },
    {
        key: "custom-text",
        title: "Text field",
        description: "Input field for text.",
        type: "text",
    },
]);

const getCookies = function () {
    const pairs = document.cookie.split(";");
    const cookies = {};
    for (let i = 0; i < pairs.length; i++) {
        const pair = pairs[i].split("=");
        cookies[`${pair[0]}`.trim()] = unescape(pair.slice(1).join("="));
    }
    return cookies;
};

const updateCookiesDisplay = () => {
    const cookiesElement = document.getElementById("cookies");
    if (cookiesElement) {
        cookiesElement.innerHTML = JSON.stringify(getCookies(), null, 2);
    }
};

updateCookiesDisplay();
setInterval(updateCookiesDisplay, 2000);
