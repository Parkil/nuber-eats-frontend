import nuberLogo from "../images/logo.svg";
import React from "react";

interface NuberLogoProps {
  classStr?: string;
}

export const NuberLogo: React.FC<NuberLogoProps> = ({classStr}) => {
  let classNameStr = !classStr ? 'w-52 mb-5' : classStr;
  return (<img src={nuberLogo} alt="nuber eats logo" className={classNameStr}/>);
}