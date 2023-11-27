import React from "react";
import {render} from "../../test.utils";
import {createMockClient, MockApolloClient} from "mock-apollo-client";
import {ApolloProvider} from "@apollo/client";
import userEvent from "@testing-library/user-event";
import {EditProfile} from "../user/edit.profile";
import {screen, waitFor} from "@testing-library/react";
import {EDIT_PROFILE_MUTATION} from "../../hooks/use.edit.profile";


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

describe("<EditProfile/>", () => {

  let mockClient: MockApolloClient

  beforeEach(() => {
    mockClient = setUp()
  })

  it("renders ok", async () => {
    render(<ApolloProvider client={mockClient}><EditProfile/></ApolloProvider>)
    await waitFor(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    expect(document.title).toEqual('Edit Profile | Nuber')
  })

  it("click button and run mutation", async () => {
    render(<ApolloProvider client={mockClient}><EditProfile/></ApolloProvider>)
    await waitFor(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    const formData = {
      email: 'client1@gmail.com',
      password: 'aaa000',
    }

    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);

    await userEvent.type(email, formData.email);
    await userEvent.type(password, formData.password);

    let result = jest.fn().mockResolvedValue({
      data: {
        editProfile: {
          ok: true,
          error: null,
        }
      }
    });
    mockClient.setRequestHandler(EDIT_PROFILE_MUTATION, result)

    const button = screen.getByRole('button')
    await userEvent.click(button)
  })
})
