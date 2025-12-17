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

    it("should be able to select value in select", () => {
        cy.visit("/");
        pageobject.toggleMenu();
        cy.getCookie("slow-load").should("not.exist");

        pageobject.valj("slow-load", "true");
        cy.getCookie("slow-load").should("have.property", "value", "true");
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
