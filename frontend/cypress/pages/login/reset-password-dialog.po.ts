export function getDialog() {
  return cy.get('[data-cy="reset-password-dialog"]')
}

export function getMailInput() {
  return cy.get('[data-cy="mail-input"]')
}

export function getSubmitButton() {
  return cy.get('[data-cy="submit"]')
}

export function sendMailRequest(mail: string) {
  getMailInput().clear().type(mail)
  getSubmitButton().click()
}