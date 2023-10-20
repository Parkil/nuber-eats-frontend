import React from "react";
import {getSearchTerm} from "../../util/get.param";
import {HistoryReplace} from "../../components/history.replace";
import {RestaurantQueryList} from "../../components/restaurant/restaurant.query.list";

export const Search = () => {
  document.title = 'Search | Nuber';
  const searchTerm = getSearchTerm();

  return (
    <>
      <HistoryReplace condition={!searchTerm} url={'/'}/>
      <h1>Search Page</h1>
      <RestaurantQueryList isSkip={!searchTerm} query={searchTerm}/>
    </>
  );
}
