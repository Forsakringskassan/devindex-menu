export class DevindexPageObject {
    public selector: string;
    public el: () => Cypress.Chainable<JQuery<HTMLElement>>;

    public constructor() {
        this.selector = ".secret-menu";
        this.el = () => cy.get(this.selector);
    }

    public toggleMenu(): void {
        cy.get(".secret-menu > button").click();
    }

    public valj(id: string, value: string): void {
        cy.get(`#${id}`).select(value);
    }
}
