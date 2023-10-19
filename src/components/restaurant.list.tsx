import React, {useState} from "react";
import {RestaurantListRow} from "./restaurant.list.row";
import {useRestaurants} from "../hooks/useRestaurants";

interface IRestaurantListProps {
  isSkip: boolean;
  query?: string;
}

export const RestaurantList: React.FC<IRestaurantListProps> = ({isSkip, query}) => {
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
                <RestaurantListRow key={restaurant.id} coverImg={restaurant.coverImg} name={restaurant.name}
                                   categoryName={restaurant.category.name} id={restaurant.id}/>)
              }
            </div>
            <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
              {pageNum > 1 ?
                (<button onClick={onPrevPageClick}
                         className="focus:outline-none font-medium text-2xl">&larr;</button>)
                : <div></div>
              }
              <span>
                Page {pageNum} of {data?.allRestaurants.totalPages}
              </span>
              {pageNum !== data?.allRestaurants.totalPages ?
                (<button onClick={onNextPageClick}
                         className="focus:outline-none font-medium text-2xl">&rarr;</button>)
                : <div></div>
              }
            </div>
          </div>
        </div>
      }
    </>
  )
}
