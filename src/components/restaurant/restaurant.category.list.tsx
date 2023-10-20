import React, {useState} from "react";
import {RestaurantElement} from "./restaurant.element";
import {Pagination} from "./pagination";
import {gql, useQuery} from "@apollo/client";
import {CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT} from "../../constant/fragments";
import {CategoryListQuery, CategoryListQueryVariables} from "../../__graphql_type/type";

interface IRestaurantListProps {
  slug: string;
}

export const RestaurantCategoryList: React.FC<IRestaurantListProps> = ({slug}) => {
  const [pageNum, setPageNum] = useState(1);

  const CATEGORY_QUERY = gql`
    query categoryList($categoryInput: CategoryInput!) {
      category(input: $categoryInput) {
        ok
        error
        totalPages
        totalItems
        restaurants {
          ...RestaurantParts
        }
        category {
          ...CategoryParts
        }
      }
    }
    ${RESTAURANT_FRAGMENT}
    ${CATEGORY_FRAGMENT}
  `;

  const {data, loading} = useQuery<CategoryListQuery, CategoryListQueryVariables>(CATEGORY_QUERY, {
    variables: {
      categoryInput: {
        page: pageNum,
        slug: slug,
      }
    }
  })

  const onNextPageClick = () => {
    setPageNum((current) => current + 1);
  }

  const onPrevPageClick = () => {
    setPageNum((current) => current - 1);
  }

  return (
    <>
      {!loading &&
        <div className="max-w-screen-2xl mx-auto mt-16 pb-20">
          <div className="justify-around max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.category.restaurants?.map(restaurant =>
                <RestaurantElement key={restaurant.id} coverImg={restaurant.coverImg} name={restaurant.name}
                                   categoryName={restaurant.category.name} id={restaurant.id}/>)
              }
            </div>
            <Pagination pageNum={pageNum} totalPages={data?.category.totalPages} nextPageClick={onNextPageClick}
                        prevPageClick={onPrevPageClick}/>
          </div>
        </div>
      }
    </>
  )
}
