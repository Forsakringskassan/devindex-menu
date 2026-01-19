export class DevindexPageObject {
    public selector: string;
    public el: () => Cypress.Chainable<JQuery>;

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
    /**
     * Inputs text into a text field.
     * @param name - The name of the text field.
     * @param value - The text to input.
     */
    public textField(name: string, value: string): void {
        cy.get(`input[name="${name}"]`).clear().type(value);
    }

    public scenario(id: string): void {
        cy.get(`#${id}`).click();
    }
}
