import React from "react";
import {render} from "../../test.utils";
import {screen, waitFor} from "@testing-library/react";
import {createMockClient, MockApolloClient} from "mock-apollo-client";
import {ApolloProvider} from "@apollo/client";
import {ConfirmEmail, VERIFY_EMAIL_MUTATION} from "../user/confirm.email";
import userEvent from "@testing-library/user-event";


const setUp = () => {
  userEvent.setup()
  return createMockClient()
}

jest.mock('../../hooks/use.me', () => {
  return {
    useMe: () => {
      return {
        data: {
          me: {
            id: 1,
            email: 'test@gmail.com',
            role: undefined,
            emailVerified: false,
          }
        }
      }
    }
  }
})

jest.mock('../../util/get.param', () => {
  return {
    getCode: () => {
      return 'Test Code'
    }
  }
})

describe("<ConfirmEmail/>", () => {

  let mockClient: MockApolloClient

  beforeEach(() => {
    mockClient = setUp()
    window.alert = jest.fn()
  })

  it("renders and run mutation", async () => {
    let result = jest.fn().mockResolvedValue({
      data: {
        verifyEmail: {
          ok: true,
          error: null,
        }
      }
    })

    mockClient.setRequestHandler(VERIFY_EMAIL_MUTATION, result)
    render(<ApolloProvider client={mockClient}><ConfirmEmail/></ApolloProvider>)
    await waitFor(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(document.title).toEqual('ConfirmEmail | Nuber')
  })
})
