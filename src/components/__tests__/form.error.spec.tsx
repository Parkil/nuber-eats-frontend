import React from "react";
import {render, screen} from "@testing-library/react";
import {FormError} from "../form.error";

describe('<Button/>', () => {
  it('should render ok with props', () => {
    render(<FormError errorMsg={'error-msg'}/>);
    screen.getByText('error-msg');
  });
});
