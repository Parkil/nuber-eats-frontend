import React from "react";
import {render} from "@testing-library/react";
import {HistoryReplace} from "../history.replace";

const mockReplace = jest.fn()

// mocking 하고자 하는 module 에서 일부 function 만 mocking 하는 경우
jest.mock('react-router-dom', () => {
  const realModule = jest.requireActual('react-router-dom')
  return {
    ...realModule,
    useHistory: () => {
      return {
        replace: mockReplace
      }
    }
  }
})

describe('<HistoryReplace/>', () => {
  it('should render ok with condition true', () => {
    render(<HistoryReplace url={'/'} condition={true}/>)
    expect(mockReplace).toHaveBeenCalledWith('/')
  });

  it('should not be call replace with condition false', () => {
    render(<HistoryReplace url={'/'} condition={false}/>)
    expect(mockReplace).toHaveBeenCalledTimes(0)
  });
});
