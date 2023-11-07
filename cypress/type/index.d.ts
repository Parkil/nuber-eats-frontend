/*
  Cypress 에서 Cypress.Commands.add 를 이용하여 커스텀 명령어를 추가할 경우 TypeScript 에서는
  Type 설정이 되어야 사용이 가능하기 때문에 해당 명령의 type 을 명시적으로 추가해준다
  
  js를 ts 에서 사용하고자 할때에도 type 정의가 필요한 것으로 보인다
 */
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject = any> {
    assertLoggedIn(): Chainable<any>
    assertLoggedOut(): Chainable<any>
    assertTitle(title: string): Chainable<any>
    execLogin(email: string, password: string): Chainable<any>
    execLoginAndAssertLogin(email: string, password: string): Chainable<any>
  }
}
