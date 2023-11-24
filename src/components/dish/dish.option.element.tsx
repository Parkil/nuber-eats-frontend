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
          className={`flex items-center ${isSelected && 'cursor-pointer'} ${isOptionSelected && 'border-2 border-gray-900'}`}>
      <h6 className={'mr-2'}>{option.name}</h6>
      <h6 className={'text-sm opacity-75'}>(${option.extra})</h6>
    </span>
  )
}
