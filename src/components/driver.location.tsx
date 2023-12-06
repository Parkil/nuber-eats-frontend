import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCar} from "@fortawesome/free-solid-svg-icons";

interface IDriverLocationProps {
  lat: number;
  lng: number;
  $hover?: any;
}

export const DriverLocation: React.FC<IDriverLocationProps> = () => {
  return (<FontAwesomeIcon icon={faCar} className="text-xl"/>);
}
