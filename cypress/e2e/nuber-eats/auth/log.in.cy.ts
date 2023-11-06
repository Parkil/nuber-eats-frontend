describe('Log in', () => {
  it('should go to login page', () => {
    cy.visit('/').title().should('eq', 'Login | Nuber')
  })

  it('cam see email / password validation errors', () => {
    cy.visit('/')
    cy.findAllByPlaceholderText(/email/i).type('client4@gmail')
    cy.findByRole('alert').should('have.text', 'Please enter a valid email')

    cy.findAllByPlaceholderText(/email/i).clear()
    cy.findByRole('alert').should('have.text', 'Email is required')

    cy.findAllByPlaceholderText(/email/i).type('client4@gmail.com')
    cy.findAllByPlaceholderText(/password/i).type('111')
    cy.findByRole('alert').should('have.text', 'password must be more than large 4 character')

    cy.findAllByPlaceholderText(/password/i).clear()
    cy.findByRole('alert').should('have.text', 'Password is required')
  })

  it('can fill out the form and login', () => {
    cy.execLogin('client2@gmail.com', 'aaa000')
    cy.assertLoggedIn()
  })
})
