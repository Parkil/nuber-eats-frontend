import React from "react";

interface IFormTitleProps {
  title: string;
}

export const FormTitle: React.FC<IFormTitleProps> = ({title}) => {
  return (
    <h4 className="w-full font-medium text-center text-3xl mb-10">{title}</h4>
  );
}
