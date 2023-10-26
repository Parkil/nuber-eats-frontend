import {NotFound} from "../404";
import {render} from "@testing-library/react";
import {BrowserRouter as Router} from "react-router-dom";

import React from "react";

describe('<NotFound/>', () => {
  it('render ok', () => {
    render(<Router><NotFound/></Router>)
    expect(document.title).toEqual('Page Not Found | Nuber');
  })
})
