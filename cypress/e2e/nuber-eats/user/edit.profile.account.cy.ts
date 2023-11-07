describe('EditProfile', () => {

  beforeEach(() => {
    cy.execLoginAndAssertLogin('client4@gmail.com', 'aaa000')
    cy.findByText('client4@gmail.com').click()
  })

  it('should go edit profile page', () => {
    cy.assertTitle('Edit Profile | Nuber')
  })

  it('can change email', () => {
    cy.intercept('POST', 'http://localhost:4000/graphql', (req) => {
      if (req.body?.operationName === 'execEditProfile') {
        req.body.variables.editProfileInput.email = 'client4@gmail.com'
      }
    })
    cy.findAllByPlaceholderText(/email/i).clear().type('client5@gmail.com')
    cy.findByRole('button').click()
  })

  // it('should see email / password validation errors', () => {
  // })
  //
  // it('should be able to create account', () => {
  // })
})
