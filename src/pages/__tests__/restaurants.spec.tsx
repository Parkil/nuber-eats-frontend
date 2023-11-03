import React from "react";
import {render} from "../../test.utils";
import {waitFor} from "@testing-library/react";
import {Restaurants} from "../client/restaurants";

jest.mock('../../components/restaurant/restaurant.category.area')
jest.mock('../../components/restaurant/restaurant.query.list')

describe("<Restaurants/>", () => {
  it("renders ok", async () => {
    render(<Restaurants/>)
    await waitFor(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    expect(document.title).toEqual('Home | Nuber')
  })
})
