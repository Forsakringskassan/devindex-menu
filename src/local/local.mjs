/* global document */
import menu from "../menu.ts";

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
        key: "scenario1",
        type: "scenario",
        title: "Scenario 1",
        description: "A dummy scenario for testing.",
        cookies: {
            a: "b",
            foo: "bar",
        },
        removeCookies: ["slow-load"],
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

document.getElementById("cookies").innerHTML = JSON.stringify(
    getCookies(),
    null,
    2,
);
