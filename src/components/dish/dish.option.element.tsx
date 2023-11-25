import React from "react";
import {DishOption} from "../../__graphql_type/type";

interface IDishOptionProps {
  dishId: number;
  option: DishOption;
  onOptionClick: (dishId: number, optionName: string) => void;
  isSelected: boolean;
  isOptionSelected: boolean;
}

export const DishOptionElement: React.FC<IDishOptionProps> = ({
                                                                dishId,
                                                                option,
                                                                onOptionClick,
                                                                isSelected,
                                                                isOptionSelected
                                                              }) => {

  return (
    <span onClick={() => onOptionClick(dishId, option.name)}
          onKeyUp={() => onOptionClick(dishId, option.name)} key={option.name}
          className={`border px-2 py-1 ${isSelected ? "border-gray-800" : "hover:border-gray-800"}`}>
      <span  className={'mr-2'}>{option.name}</span>
      <span  className={'text-sm opacity-75'}>(${option.extra})</span>
    </span>
  )
}
