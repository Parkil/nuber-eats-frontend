import React from "react";
import {useParams} from "react-router-dom";
import {RestaurantCategoryList} from "../../components/restaurant/restaurant.category.list";

interface ICategoryParams {
  slug: string;
}

export const Category = () =>  {
  /*
  useLocation() : url + querystring 을 가져올때 사용
  useParams() : path-variable 을 가져올때 사용
   */
  const params = useParams<ICategoryParams>(); // path-variable 을 가져올때 사용

  return (
    <>
      <RestaurantCategoryList slug={params.slug}/>
    </>
  );
}
