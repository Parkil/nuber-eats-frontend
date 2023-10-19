import React from "react";
import {getSearchTerm} from "../../util/getParam";
import {HistoryReplace} from "../../components/history.replace";
import {RestaurantList} from "../../components/restaurant.list";

export const Search = () => {
  document.title = 'Search | Nuber';
  const searchTerm = getSearchTerm();

  return (
    <>
      <HistoryReplace condition={!searchTerm} url={'/'}/>
      <h1>Search Page</h1>
      <RestaurantList isSkip={!searchTerm} query={searchTerm}/>
    </>
  );
}
