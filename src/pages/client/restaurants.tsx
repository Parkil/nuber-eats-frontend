import React from "react";
import {Link} from "react-router-dom";

export const Restaurants = () => {
  document.title = 'Restaurants | Nuber';

  


  // link 를 이용해서 해당 페이지로 간다고 해서 변경이 없는 component 가 rerendering 되지는 않는다
  return (
    <h1>sdfasdfsda --- <Link to="/">go home</Link></h1>
  );
}