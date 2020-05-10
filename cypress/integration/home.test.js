describe("Home Page", () => {
  beforeEach(() => {
    cy.fixture("courses.json").as("coursesJSON"); // we are now doing real http request but mocking the instance (the feedback)

    cy.server(); //stimulate mock server (HTTP request)

    cy.route("/api/courses", "@coursesJSON").as("courses"); //@coursesJSON and the @ is to access the variable we have created above. "as is the name"

    cy.visit("/");
  });

  it("should display a list of courses", () => {
    cy.contains("All Courses");

    cy.wait("@courses"); // wait for the courses response to be simulated

    cy.get("mat-card").should("have.length", 9);
  });

  it("should display the advanced courses", () => {
    cy.get('.mat-tab-label').should("have.length", 2);

    cy.get('.mat-tab-label').last().click(); // .last is to select the second button

    cy.get('.mat-tab-body-active .mat-card-title').its('length').should('be.greaterThan', 1);

    cy.get('.mat-tab-body-active .mat-card-title').first().should('contain', "Angular Security Course");
  });
});
