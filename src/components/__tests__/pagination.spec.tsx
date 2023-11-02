/*
  TestCase를 만드는 방법
  __test__ 안에 TestCase 를 만들거나 (이때에는 파일명이 ~spec.ts 가 아니어도 된다)
  ~spec.ts 파일을 만들거나
 */

import React from "react";
import {render, screen} from "@testing-library/react";
import {Pagination} from "../restaurant/pagination";
import userEvent from "@testing-library/user-event";

const nextPageClick = jest.fn()
const prevPageClick = jest.fn()

describe("<Pagination/>", () => {
  beforeEach(() => {
    userEvent.setup()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders ok when first page", () => {
    render(<Pagination prevPageClick={prevPageClick} nextPageClick={nextPageClick} totalPages={3} pageNum={1}/>)
    screen.getByText('Page 1 of 3')
    screen.getByText('→')
  });

  it("renders ok when middle page", () => {
    render(<Pagination prevPageClick={prevPageClick} nextPageClick={nextPageClick} totalPages={3} pageNum={2}/>)
    screen.getByText('Page 2 of 3')
    screen.getByText('→')
    screen.getByText('←')
  });

  it("prev and next page button click", async () => {
    render(<Pagination prevPageClick={prevPageClick} nextPageClick={nextPageClick} totalPages={3} pageNum={2}/>)
    let nextPageBtn = screen.getByText('→')
    let prevPageBtn = screen.getByText('←')

    await userEvent.click(nextPageBtn)
    await userEvent.click(prevPageBtn)

    expect(nextPageClick).toHaveBeenCalledTimes(1)
    expect(prevPageClick).toHaveBeenCalledTimes(1)
  });
});
