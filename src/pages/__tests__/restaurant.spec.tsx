import React from "react";
import {createMockClient, MockApolloClient} from "mock-apollo-client";
import {ApolloProvider, InMemoryCache} from "@apollo/client";
import {render} from "../../test.utils";
import {screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {FIND_RESTAURANT_QUERY, Restaurant} from "../client/restaurant";

const resultValue = {
  data: {
    findRestaurant: {
      ok: true,
      error: null,
      restaurant: {
        __typename: 'Restaurant', //fragment 사용시 __typename 을 지정해 주어야 함
        id: 1,
        name: "레스토랑1",
        coverImg: "http://restaurant.img.png",
        category: {
          name: "카테고리1",
          slug: "카테고리1",
        },
        address: "레스토랑 1 주소",
        isPromoted: true,
      }
    }
  }
}

jest.mock('react-router-dom', () => {
  const realModule = jest.requireActual('react-router-dom')
  return {
    ...realModule,
    useParams: () => {
      return {
        id: 3
      }
    }
  }
})

const setUp = () => {
  userEvent.setup()
  const cache = new InMemoryCache({
    possibleTypes: {
      findRestaurant: ['RestaurantParts'],
    },
  })
  return createMockClient({cache})
}

describe("<Restaurant/>", () => {

  let mockClient: MockApolloClient

  beforeAll(() => {
    mockClient = setUp()
  })

  it("renders ok", async () => {
    const mockResult = jest.fn().mockResolvedValue(resultValue)
    mockClient.setRequestHandler(FIND_RESTAURANT_QUERY, mockResult)
    render(<ApolloProvider client={mockClient}><Restaurant/></ApolloProvider>)
    await waitFor(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })

    screen.getByText(resultValue.data.findRestaurant.restaurant.name)
    screen.getAllByText(resultValue.data.findRestaurant.restaurant.category.name)
    let link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', `/category/${resultValue.data.findRestaurant.restaurant.category.slug}`)
  })
})
