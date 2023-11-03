import React from "react";
import {createMockClient, MockApolloClient} from "mock-apollo-client";
import {ApolloProvider, InMemoryCache} from "@apollo/client";
import {render} from "../../test.utils";
import {screen, waitFor} from "@testing-library/react";
import {CATEGORY_RESTAURANT_QUERY, RestaurantCategoryList} from "../restaurant/restaurant.category.list";
import userEvent from "@testing-library/user-event";

const resultValue = {
  data: {
    category: {
      ok: true,
      error: null,
      totalPages: 2,
      totalItems: 1,
      restaurants: [
        {
          __typename: 'Restaurant', //fragment 사용시 __typename 을 지정해 주어야 함
          id:1,
          name: "레스토랑1",
          coverImg: "http://restaurant.img.png",
          category: {
            name: "카테고리1",
            slug: "카테고리1",
          },
          address: "레스토랑 1 주소",
          isPromoted: true,
        }
      ],
      category: {
        __typename: 'Category', //fragment 사용시 __typename 을 지정해 주어야 함
        id:1,
        name: "카테고리1",
        coverImg: "http://test.img.png",
        slug: "카테고리1",
        restaurantCount: 1,
      }
    }
  }
}

const setUp = () => {
  userEvent.setup()
  const cache = new InMemoryCache({
    possibleTypes: {
      category: ['RestaurantParts', 'CategoryParts'],
    },
  })
  return createMockClient({cache})
}

describe("<RestaurantQueryList/>", () => {

  let mockClient: MockApolloClient

  beforeAll(() => {
    mockClient = setUp()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("renders ok", async () => {
    const mockResult = jest.fn().mockResolvedValue(resultValue)
    mockClient.setRequestHandler(CATEGORY_RESTAURANT_QUERY, mockResult)
    render(<ApolloProvider client={mockClient}><RestaurantCategoryList slug={'sdfds'}/></ApolloProvider>)
    await waitFor(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    screen.getByText('Page 1 of 2')
    screen.getByText('레스토랑1')
    screen.getAllByText('카테고리1')
    let link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/restaurant/1')

    let nextBtn = screen.getByText('→')
    await userEvent.click(nextBtn)
    screen.getByText('Page 2 of 2')

    let prevBtn = screen.getByText('←')
    await userEvent.click(prevBtn)
    screen.getByText('Page 1 of 2')
  })
})
