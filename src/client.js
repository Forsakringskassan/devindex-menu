/**
 * @param {string} cookieName
 * @param {string} cookieValue
 * @param {number} exdays
 * @returns {void}
 */
function setCookie(cookieName, cookieValue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    /* eslint-disable-next-line unicorn/no-document-cookie -- technical debt, should use CookieStore */
    document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
}

/**
 * @param {string} cookieName
 * @returns {string | undefined}
 */
function getCookie(cookieName) {
    const name = `${cookieName}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let c of ca) {
        while (c.charAt(0) === " ") {
            c = c.slice(1);
        }
        if (c.indexOf(name) === 0) {
            return c.slice(name.length);
        }
    }
    return undefined;
}

(function () {
    /** @type {NodeListOf<HTMLSelectElement>} */
    const selections = document.querySelectorAll(".secret-menu select");
    for (const select of selections) {
        select.value = getCookie(select.name)
            ? getCookie(select.name)
            : "default";

        if (select.dataset.sessionstorage === "true") {
            const cookieValue = getCookie(select.name);
            if (cookieValue) {
                sessionStorage.setItem(select.name, atob(cookieValue));
            }
        }

        select.addEventListener("change", function (event) {
            const element = event.target;
            setCookie(element.name, element.value, 30);

            if (element.dataset.execOnChange) {
                window[element.dataset.execOnChange]();
            }

            if (element.dataset.reload === "true") {
                location.reload(true);
            }

            if (element.dataset.sessionstorage === "true") {
                const sessionKey = element.id;
                if (element.value) {
                    const value = atob(element.value);

                    console.log(
                        `Laddar sessionstorage ${sessionKey} med \n ${value}`,
                    );
                    sessionStorage.setItem(sessionKey, value);
                } else {
                    console.log(`Tömmer sessionstorage`);
                    sessionStorage.removeItem(sessionKey);
                }
                location.reload(true);
            }
        });
    }

    /* Forcerar att sidan laddas om, även när länken är av typen: /#/granska/8 */
    /** @type {NodeListOf<HTMLAnchorElement>} */
    const links = document.querySelectorAll(".secret-menu ul li a");
    for (const link of links) {
        if (link.getAttribute("href").startsWith("/#")) {
            /**
             * @param {MouseEvent} event
             */
            link.addEventListener("click", function (event) {
                event.preventDefault();
                window.location.href = event.target.getAttribute("href");
                setTimeout(() => {
                    console.log("Reload after click on hash-link.");
                    location.reload();
                }, "500");
            });
        }
    }
})();

function toggleMenu() {
    const menu = document.querySelector(".secret-menu");
    menu.classList.toggle("open");
}

window.toggleMenu = toggleMenu;
