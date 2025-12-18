import { DevindexPageObject } from "../../src/pageobjects/Devindex.pageobject";

describe("devindex", () => {
    const pageobject = new DevindexPageObject();
    it("local page should load", () => {
        cy.visit("/");
        cy.get("body").contains("Local DevIndex");
    });

    it("should be able toggle menu", () => {
        cy.visit("/");
        pageobject.el().should("not.be.visible");
        pageobject.toggleMenu();
        pageobject.el().should("be.visible");
    });

    describe("select field", () => {
        it("should be able to select value in select", () => {
            cy.visit("/");
            pageobject.toggleMenu();
            cy.getCookie("slow-load").should("not.exist");

            pageobject.valj("slow-load", "true");
            cy.getCookie("slow-load").should("have.property", "value", "true");
        });

        it("should be able to execute function when changing select", () => {
            cy.visit("/");
            pageobject.toggleMenu();
            cy.url().should("not.include", "#function-called");
            pageobject.valj("exec-logic", "true");
            cy.url().should("include", "#function-called");
        });
    });

    describe("text field", () => {
        it("should be able to input text", () => {
            cy.visit("/");
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
});
