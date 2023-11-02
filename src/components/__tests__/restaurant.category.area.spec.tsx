import React from "react";
import {createMockClient} from "mock-apollo-client";
import {ApolloProvider, InMemoryCache} from "@apollo/client";
import {render} from "../../test.utils";
import {CATEGORY_QUERY, RestaurantCategoryArea} from "../restaurant/restaurant.category.area";
import {screen, waitFor} from "@testing-library/react";

describe("<RestaurantCategoryArea/>", () => {
  it("renders ok", async () => {

    // graphql mocking 시 query 에 fragment 가 존재할 경우 추가해야 하는 속성
    const cache = new InMemoryCache({
      possibleTypes: {
        category: ['CategoryParts'],
      },
    })

    const mockClient = createMockClient({cache})

    // mockClient.setRequestHandler 에서 graphql fragment 사용시 데이터를 가져오지 못함
    let result = jest.fn().mockResolvedValue({
      data: {
        allCategories: {
          ok: true,
          error: null,
          categories: [
            {
              __typename: 'Category', //fragment 사용시 __typename 을 지정해 주어야 함
              id:1,
              name: "카테고리1",
              coverImg: "http://test.img.png",
              slug: "카테고리1",
              restaurantCount: 1,
            },
            {
              __typename: 'Category',
              id:2,
              name: "카테고리2",
              coverImg: "http://test.img2.png",
              slug: "카테고리2",
              restaurantCount: 1,
            },
          ]
        }
      }
    })

    mockClient.setRequestHandler(CATEGORY_QUERY, result)
    render(<ApolloProvider client={mockClient}><RestaurantCategoryArea/></ApolloProvider>)
    await waitFor(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    screen.getByText('카테고리1')
    screen.getByText('카테고리2')
    let link = screen.getAllByRole('link')
    expect(link[0]).toHaveAttribute('href', '/category/카테고리1')
    expect(link[1]).toHaveAttribute('href', '/category/카테고리2')
  });
});
