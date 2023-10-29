import {Login, LOGIN_MUTATION} from "../login";
import {render, screen} from "@testing-library/react";
import {ApolloProvider} from "@apollo/client";
import {createMockClient, MockApolloClient} from "mock-apollo-client";
import {BrowserRouter as Router} from "react-router-dom";
import userEvent from "@testing-library/user-event";

const setUp = () => {
  userEvent.setup();
  const client = createMockClient();
  render(<Router><ApolloProvider client={client}><Login/></ApolloProvider></Router>);

  return client;
}

describe('<Login/>', () => {

  let mockClient: MockApolloClient;

  beforeEach(() => {
    mockClient = setUp();
  });

  it('should render ok', () => {
    expect(document.title).toEqual('Login | Nuber');
  });

  /*
    노마드 코더 강좌에서는 testing-library v13 을 사용하고 있는데 v13 에서는
    userEvent.type 이 정상적으로 작동하지 않는 문제가 있음

    테스트 관련 라이브러리를 업데이트 하니까 정상적으로 작동하는것을 확인
    "@testing-library/jest-dom": "^6.1.4",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.5.1",
    "@types/jest": "^29.5.6",
   */

  it("displays email validation errors", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    await userEvent.type(email, 'test@gmail');
    let errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent(/please enter a valid email/i);

    await userEvent.clear(email);
    errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent(/email is required/i);
  });

  it("displays password validation errors", async () => {
    const password = screen.getByPlaceholderText(/password/i);
    await userEvent.type(password, '111');
    let errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent(/password must be more than large 4 character/i);

    await userEvent.clear(password);
    errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent(/Password is required/i);
  });

  it("submits form and calls mutation", async () => {
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
        login: {
          ok: true,
          token: 'token',
          error: null,
        }
      }
    });
    mockClient.setRequestHandler(LOGIN_MUTATION, result);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(result).toHaveBeenCalledTimes(1);
    expect(result).toHaveBeenCalledWith({loginInput:formData});
  });

  it("submits form and calls mutation error", async () => {
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
        login: {
          ok: false,
          error: 'email not found',
          token: null,
        }
      }
    });
    mockClient.setRequestHandler(LOGIN_MUTATION, result);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    let errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent(/email not found/i);
  });

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
    mockClient.setRequestHandler(LOGIN_MUTATION, result);

    const button = screen.getByRole('button');
    await userEvent.click(button);

    expect(result).toHaveBeenCalledTimes(1);
  });
});
