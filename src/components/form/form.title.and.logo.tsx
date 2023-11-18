import React from "react";
import {NuberLogo} from "../nuber.logo";

interface IFormTitleAndLogoProps {
  title: string;
}

export const FormTitleAndLogo: React.FC<IFormTitleAndLogoProps> = ({title}) => {
  return (
    <>
    <NuberLogo/>
    <h4 className="w-full font-medium text-left text-3xl mb-10">{title}</h4>
    </>
  );
}
