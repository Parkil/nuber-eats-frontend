import React, {ReactNode} from "react";

interface IDishProps {
  id?: number,
  description: string;
  name: string;
  price: number;
  isOrderStarted?: boolean;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
  isSelected?: boolean;
  children?: ReactNode;
}

export const Dish: React.FC<IDishProps> = ({
                                             id = 0,
                                             description,
                                             name,
                                             price,
                                             isOrderStarted = false,
                                             addItemToOrder,
                                             removeFromOrder,
                                             isSelected = false,
                                             children
                                           }) => {

  const onOrderClick = () => {
    if (addItemToOrder && isOrderStarted && removeFromOrder) {
      if (!isSelected) {
        addItemToOrder(id)
      } else {
        removeFromOrder(id)
      }
    }
  }

  return (
    <div className={`px-8 pt-4 border transition-all ${isSelected ? 'border-gray-900 border-2' : ''}`}>
      <div className="mb-5">
        <h3 className="text-lg font-medium">{name} {isOrderStarted &&
          <button className={`ml-3 py-1 px-3 focus:outline-none text-sm  text-white ${
            isSelected ? "bg-red-500" : " bg-lime-600"
          }`} onClick={() => onOrderClick()}>{isSelected ? 'Remove' : 'Add'}</button>}</h3>
        <h4 className="font-medium">{description}</h4>
      </div>
      <span>${price}</span>
      {children}
    </div>
  )
}
