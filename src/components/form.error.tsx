import React from "react";

interface IFormErrorProps {
  errorMsg: string;
}

export const FormError: React.FC<IFormErrorProps> = ({errorMsg}) => {
  return (<span role="alert" className="text-red-500 text-sm">{errorMsg}</span>);
}
