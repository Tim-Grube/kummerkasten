import * as page from "../pages/login/login.po"
import * as dialog from "../pages/login/reset-password-dialog.po"
import users from "../fixtures/users.json"
import {UserRole} from "@/lib/graph/generated/graphql";

describe('Login Tests', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  context('Login Form', () => {
    it('displays login', () => {
      page.getMailInput().should('be.visible')
      page.getPasswordInput().should('be.visible')
      page.getMailMessage().should('have.length', 0)
      page.getPasswortMessage().should('have.length', 0)
      page.getPasswordResetButton().should('not.be.disabled')
      page.getSubmitButton().should('be.visible').and('not.be.disabled')
    })

    it('should show missing mail message', () => {
      page.submit()
      page.getMailMessage().should('contain.text', "Bitte gib eine gültige E-Mail an.")
    })

    it('should show incorrect mail format message', () => {
      page.getMailInput().type("Invalid Mail")
      page.submit()
      page.getMailMessage().should('contain.text', "Bitte gib eine gültige E-Mail an.")
    })

    it('should show wrong credentials message', () => {
      page.login("test@mail.de", "invalid password")
      page.getPasswortMessage().should('contain.text', "Anmeldedaten inkorrekt")
    })

    it('should log user in',() => {
      const ticketUrl = Cypress.config().baseUrl + '/tickets'
      page.login(users.admin.mail, users.admin.password)
      cy.url().should('eq', ticketUrl)
    })

    it('should redirect logged in users', () => {
      cy.login(users.admin.mail, users.admin.password)
      cy.visit('/login')
      cy.url().should("eq", Cypress.config().baseUrl + '/tickets')
    });
  })

  context('Reset Password Flow', () => {
    beforeEach(() => page.getPasswordResetButton().click())

    it('should open the reset password dialog', () => {
      dialog.getDialog().should('be.visible')
      dialog.getMailInput().should('be.visible')
      dialog.getSubmitButton().should('not.be.disabled')
    })

    it('should allow reset on wrong mail', () => {
      dialog.sendMailRequest("invalid@mail.de")
      dialog.getDialog().should('not.exist')
    })

    it('should allow reset request on existing mail', () => {
      dialog.sendMailRequest(users.fsles1.mail)
      cy.loginAsRole(UserRole.Admin)
      cy.visit('/users')
    });
  })
})
