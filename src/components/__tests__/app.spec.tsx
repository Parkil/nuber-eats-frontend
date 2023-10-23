/*
  TestCase를 만드는 방법
  __test__ 안에 TestCase 를 만들거나 (이때에는 파일명이 ~spec.ts 가 아니어도 된다)
  ~spec.ts 파일을 만들거나
 */

import React from "react";
import {render, waitFor, screen} from "@testing-library/react";
import {App} from "../app";
import {isLoggedInVar} from "../../apollo";

jest.mock("../../routers/logged.out.router", () => {
  return {
    LoggedOutRouter: () => <span>logged out</span>
  }
});

jest.mock("../../routers/logged.in.router", () => {
  return {
    LoggedInRouter: () => <span>logged in </span>
  }
});

describe("<App/>", () => {
  it("renders LoggedOutRouter", () => {
    render(<App/>);
    screen.getByText('logged out');
  });

  it("renders LoggedInRouter", async () => {
    render(<App/>);
    await waitFor(() => {
      isLoggedInVar(true)
    });
    screen.getByText('logged in');
  });
});
