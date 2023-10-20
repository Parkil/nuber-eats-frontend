import React, {useState} from "react";
import {RestaurantElement} from "./restaurant.element";
import {useRestaurants} from "../../hooks/useRestaurants";
import {Pagination} from "./pagination";

interface IRestaurantListProps {
  isSkip: boolean;
  query?: string;
}


export const RestaurantQueryList: React.FC<IRestaurantListProps> = ({isSkip, query}) => {
  const [pageNum, setPageNum] = useState(1);

  const {
    data,
    loading
  } = useRestaurants(isSkip, pageNum, query);

  const onNextPageClick = () => {
    setPageNum((current) => current + 1);
  }

  const onPrevPageClick = () => {
    setPageNum((current) => current - 1);
  }

  return (
    <>
      {!isSkip && !loading &&
        <div className="max-w-screen-2xl mx-auto mt-16 pb-20">
          <div className="justify-around max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.allRestaurants.results?.map(restaurant =>
                <RestaurantElement key={restaurant.id} coverImg={restaurant.coverImg} name={restaurant.name}
                                   categoryName={restaurant.category.name} id={restaurant.id}/>)
              }
            </div>
            <Pagination pageNum={pageNum} totalPages={data?.allRestaurants.totalPages} nextPageClick={onNextPageClick}
                        prevPageClick={onPrevPageClick}/>
          </div>
        </div>
      }
    </>
  )
}
