import React from "react";
import {RestaurantCategory} from "../../components/restaurant-category";
import {RestaurantList} from "../../components/restaurant-list";

export const Restaurants = () => {
  document.title = 'Restaurants | Nuber';

  // link 를 이용해서 해당 페이지로 간다고 해서 변경이 없는 component 가 rerendering 되지는 않는다
  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input type="Search" className="input rounded-md border-0 w-3/12" placeholder="Search Restaurants..."/>
      </form>
      <RestaurantCategory/>
      <RestaurantList/>
    </div>
  );
}