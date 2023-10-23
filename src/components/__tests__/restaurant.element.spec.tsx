import React from "react";
import {render, screen} from "@testing-library/react";
import {RestaurantElement} from "../restaurant/restaurant.element";
import {BrowserRouter as Router} from "react-router-dom";

describe('<RestaurantElement/>', () => {
  it('renders ok with props', () => {
    const {container} = render(
      <Router><RestaurantElement id={1} coverImg={'img'} name={'name'} categoryName={'category'}/></Router>
    );

    screen.getByText('name');
    screen.getByText('category');
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveAttribute("href", "/restaurant/1");
  });
})
