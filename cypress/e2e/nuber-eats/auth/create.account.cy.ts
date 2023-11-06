describe('CreateAccount', () => {
  it('should go create account page (url base)', () => {
    cy.visit('/create-account').title().should('eq', 'Create Account | Nuber')
  })

  it('should go create account page (click base)', () => {
    cy.visit('/').title().should('eq', 'Login | Nuber')
    cy.findByText('Create an Account').click()
    cy.window().its('document.title').should('eq', 'Create Account | Nuber')
  })

  it('should see email / password validation errors', () => {
    cy.visit('/create-account')
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

  it('should be able to create account', () => {
    // 요청을 가로채서 response 를 조작
    cy.intercept('http://localhost:4000/graphql', (req) =>{
      const {operationName} = req.body
      
      // 특정 operation 에서만 response 를 조작하도록 설정
      if (operationName && operationName === 'execCreateAccount') {
        req.reply((res) => {
          res.send({"data": {"createAccount": { "ok": true, "error": null, "__typename": "CreateAccountOutput"}}})
        })
      }
    })

    cy.visit('/create-account')
    cy.findAllByPlaceholderText(/email/i).type('client4@gmail.com')
    cy.findAllByPlaceholderText(/password/i).type('aaa000')
    cy.findByText('Create Account').click()

    cy.execLogin('client4@gmail.com', 'aaa000')
    cy.assertLoggedIn()
  })
})
