import {CREATE_ACCOUNT_MUTATION, CreateAccount} from "../create.account";
import userEvent from "@testing-library/user-event";
import {createMockClient, MockApolloClient} from "mock-apollo-client";
import {ApolloProvider} from "@apollo/client";
import {render} from "../../test.utils";
import {screen} from "@testing-library/react";
import {UserRole} from "../../__graphql_type/type";
import {LOGIN_MUTATION} from "../login";


const setUp = () => {
  userEvent.setup();
  const client = createMockClient();
  render(<ApolloProvider client={client}><CreateAccount/></ApolloProvider>);

  return client;
}

describe('<CreateAccount/>', () => {
  let mockClient: MockApolloClient

  beforeEach(() => {
    mockClient = setUp()
  })

  it('renders ok', () => {
    expect(document.title).toEqual('Create Account | Nuber');
  })

  it('displays email validation error', async () => {
    const email = screen.getByPlaceholderText(/email/i)
    await userEvent.type(email, 'test@gmail')
    let errorMsg = screen.getByRole('alert')
    expect(errorMsg).toHaveTextContent('Please enter a valid email')

    await userEvent.clear(email)
    errorMsg = screen.getByRole('alert')
    expect(errorMsg).toHaveTextContent(/email is required/i)
  })

  it("displays password validation errors", async () => {
    const password = screen.getByPlaceholderText(/password/i);
    await userEvent.type(password, '111');
    let errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent(/password must be more than large 4 character/i);

    await userEvent.clear(password);
    errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Password is required/i);
  })

  it("submits form and calls mutation", async () => {
    const formData = {
      email: 'client1@gmail.com',
      password: 'aaa000',
      role: UserRole.Client
    }

    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);

    await userEvent.type(email, formData.email);
    await userEvent.type(password, formData.password);

    let result = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: null,
        }
      }
    });
    mockClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, result);

    const button = screen.getByRole('button');
    await userEvent.click(button)

    expect(result).toHaveBeenCalledTimes(1)
    expect(result).toHaveBeenCalledWith({createAccountInput:formData})
  })

  it("submits form and apollo error", async () => {
    const formData = {
      email: 'client1@gmail.com',
      password: 'aaa000',
    }

    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);

    await userEvent.type(email, formData.email);
    await userEvent.type(password, formData.password);

    let result = jest.fn().mockRejectedValue({aaa:'bbb'});
    mockClient.setRequestHandler(CREATE_ACCOUNT_MUTATION, result);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(result).toHaveBeenCalledTimes(1);
  });
})
