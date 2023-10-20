import React from "react";
import {gql, useQuery} from "@apollo/client";
import {CategoryQuery, CategoryQueryVariables} from "../../__graphql_type/type";
import {Link} from "react-router-dom";
import {CATEGORY_FRAGMENT} from "../../constant/fragments";

export const RestaurantCategoryArea: React.FC = () => {

  const CATEGORY_QUERY = gql`
    query category {
      allCategories {
        ok
        error
        categories {
          ...CategoryParts
        }
      }
    }
    ${CATEGORY_FRAGMENT}
  `;

  const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(CATEGORY_QUERY);

  return (
    <>
      {!loading &&
        <div className="max-w-screen-2xl mx-auto mt-8">
          <div className="flex justify-around max-w-xs mx-auto">
            {data?.allCategories.categories?.map(category =>
              // group -> group:hover 를 사용하면 해당 group 에 해당하는 element 가 hover 되었을때 동일한 처리를 할수 있도록 할수 있음
              <Link to={`/category/${category.slug}`} key={category.name}>
                <div className="flex flex-col items-center cursor-pointer group">
                  <div className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full" style={{backgroundImage: `url(${category.coverImg})`}}></div>
                  <span className="text-sm text-center font-bold mt-1">{category.name}</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      }
    </>
  )
}
