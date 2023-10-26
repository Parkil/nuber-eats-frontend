import {render, screen, waitFor} from "@testing-library/react";
import React from "react";
import {Header} from "../header";
import {BrowserRouter as Router} from "react-router-dom";
import {MockedProvider} from "@apollo/client/testing";
import {ME_QUERY} from "../../hooks/use.me";
import {UserRole} from "../../__graphql_type/type";

describe('<Header/>', () => {
  const getMockUseMe = (emailVerified: boolean) => {
    return [
      {
        request: {
          query: ME_QUERY
        },
        result: {
          data: {
            me: {
              id: 1,
              email: 'test@gmail.com',
              role: UserRole.Client,
              emailVerified: emailVerified,
            }
          }
        }
      }
    ]
  }

  it('renders ok', async () => {
    //state, graphql 로 인한 지연시간을 기다렸다가 테스트를 진행
    render(<Router>
      <MockedProvider mocks={getMockUseMe(false)}>
        <Header/>
      </MockedProvider>
    </Router>)
    await waitFor(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    });
  });

  it('renders verify banner', async () => {
    //state, graphql 로 인한 지연시간을 기다렸다가 테스트를 진행
    render(<Router>
      <MockedProvider mocks={getMockUseMe(false)}>
        <Header/>
      </MockedProvider>
    </Router>)

    await waitFor(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
      screen.getByText('Please verify your email');
    });
  });

  it('renders without verify banner', async () => {
    render(<Router>
      <MockedProvider mocks={getMockUseMe(true)}>
        <Header/>
      </MockedProvider>
    </Router>)

    await waitFor(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(screen.queryByText('Please verify your email')).toBeNull();
    });
  });
});
