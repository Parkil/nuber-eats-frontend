import React from "react";
import {Button} from "../button";
import {render, screen} from "@testing-library/react";
describe('<Button/>', () => {
  it('should render ok with props', () => {
    render(<Button canClick={true} loading={false} actionText={'test'}/>);
    screen.getByText('test');
  });

  it('should display loading', () => {
    render(<Button canClick={true} loading={true} actionText={'test'}/>)
    screen.getByText('Loading...');
  });

  it('should disable button', () => {
    const {container} = render(<Button canClick={false} loading={true} actionText={'test'}/>)
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveClass('pointer-events-none');
  });
});
