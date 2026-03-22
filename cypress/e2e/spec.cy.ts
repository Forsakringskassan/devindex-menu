import { DevindexPageObject } from "../../src/pageobjects/Devindex.pageobject";

describe("devindex", () => {
    const pageobject = new DevindexPageObject();
    beforeEach(() => {
        cy.visit("/");
    });
    it("local page should load", () => {
        cy.visit("/");
        cy.get("body").contains("Local DevIndex");
    });

    it("should be able toggle menu", () => {
        pageobject.el().should("not.be.visible");
        pageobject.toggleMenu();
        pageobject.el().should("be.visible");
    });

    it("should have correct html", () => {
        cy.visit("/");
        cy.htmlvalidate();
    });

    describe("select field", () => {
        it("should have default value selected if cookie not defined", () => {
            pageobject.toggleMenu();
            pageobject
                .el()
                .find("#simple-option option:selected")
                .should("have.text", "Default mock");
        });

        it("should have no value selected if cookie not defined and no default value", () => {
            pageobject.toggleMenu();
            pageobject
                .el()
                .find("#slow-load option:selected")
                .should("not.exist");
        });

        it("should be able to select value in select", () => {
            pageobject.toggleMenu();
            cy.getCookie("slow-load").should("not.exist");

            pageobject.valj("slow-load", "true");
            cy.getCookie("slow-load").should("have.property", "value", "true");

            pageobject
                .el()
                .find("#slow-load option:selected")
                .should("have.text", "Slow loading");
        });

        it("should be able to execute function when changing select", () => {
            pageobject.toggleMenu();
            cy.url().should("not.include", "#function-called");
            pageobject.valj("exec-logic", "true");
            cy.url().should("include", "#function-called");
        });

        it("should be to store objects in session storage", () => {
            pageobject.toggleMenu();

            cy.get(`#option-session`).select(1);

            cy.window().then((win) => {
                const actual = JSON.parse(
                    win.sessionStorage.getItem("option-session") ?? "{}",
                );
                expect(actual).to.deep.equal({
                    bar: "foo",
                });
            });
        });
    });

    describe("text field", () => {
        it("should be able to input text", () => {
            pageobject.toggleMenu();
            cy.getCookie("custom-text").should("not.exist");

            const testValue = "Hello";
            pageobject.textField("custom-text", testValue);
            cy.getCookie("custom-text").should(
                "have.property",
                "value",
                testValue,
            );
        });
    });

    describe("link field", () => {
        it("Should handle external links", () => {
            pageobject.toggleMenu();
            pageobject.el().find('a[href="/foo"]').click();
            cy.url().should("include", "/foo");
            cy.get("body").contains("Not Found");
        });

        it("Should force full reload even on hashmode links", () => {
            pageobject.toggleMenu();
            pageobject.el().find('a[href="/#/view"]').click();
            cy.url().should("include", "view");

            // Not visible menu means full reload happened since menu state is not persisted
            pageobject.el().should("not.visible");
        });
    });

    describe("scenario", () => {
        it("should be able to activate scenario", () => {
            cy.visit("/");
            pageobject.toggleMenu();
            cy.getCookie("a").should("not.exist");
            cy.getCookie("foo").should("not.exist");

            pageobject.scenario("scenario1");
            cy.getCookie("a").should("have.property", "value", "b");
            cy.getCookie("foo").should("have.property", "value", "bar");
        });

        it("should be able to remove cookies in scenario", () => {
            cy.visit("/");
            pageobject.toggleMenu();

            pageobject.valj("slow-load", "true");
            cy.getCookie("slow-load").should("have.property", "value", "true");

            pageobject.toggleMenu();
            pageobject.scenario("scenario1");
            cy.getCookie("slow-load").should("not.exist");
        });
    });
});
