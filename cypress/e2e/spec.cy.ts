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
});
