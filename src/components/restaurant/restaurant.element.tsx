import React from "react";
import {Link} from "react-router-dom";

interface IRestaurantElProps {
  id: number;
  coverImg: string;
  name: string;
  categoryName: string;
}

export const RestaurantElement: React.FC<IRestaurantElProps> = ({id, coverImg, name, categoryName}) => {
  return (
    <Link to = {`/restaurant/${id}`}>
      <div className="flex flex-col">
        <div style={{backgroundImage: `url(${coverImg})`}} className="bg-cover bg-center mb-3 py-28"></div>
        <h3 className="text-xl font-medium">{name}</h3>
        <span className="border-t text-xs mt-2 opacity-50 border-gray-300">{categoryName}</span>
      </div>
    </Link>
  )
}
