import React from "react";
import {render} from "../../test.utils";
import {screen, waitFor} from "@testing-library/react";
import {Search} from "../client/search";

jest.mock('../../components/history.replace')
jest.mock('../../components/restaurant/restaurant.query.list')

describe("<Search/>", () => {
  it("renders ok", async () => {
    render(<Search/>)
    await waitFor(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    screen.getByText('Search Page')
    expect(document.title).toEqual('Search | Nuber')
  })
})
