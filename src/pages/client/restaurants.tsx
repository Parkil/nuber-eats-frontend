import React, {useState} from "react";
import {RestaurantCategoryArea} from "../../components/restaurant/restaurant.category.area";
import {RestaurantQueryList} from "../../components/restaurant/restaurant.query.list";
import {SubmitHandler, useForm} from "react-hook-form";
import {useParams} from "react-router-dom";


interface ICategoryParams {
  slug: string;
}

interface IForm {
  searchWord: string;
}

export const Restaurants = () => {

  document.title = 'Home | Nuber';

  const [queryStr, setQueryStr] = useState();

  const onSubmit: SubmitHandler<any> = (data) => {
    if (data.searchWord && data.searchWord !== '') {
      setQueryStr(data.searchWord);
    } else {
      setQueryStr(undefined);
    }
  }

  const {register, handleSubmit} = useForm<IForm>({
    defaultValues: {
      searchWord: ''
    }
  })
  const params = useParams<ICategoryParams>()

  // link 를 이용해서 해당 페이지로 간다고 해서 변경이 없는 component 가 re rendering 되지는 않는다
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input {...register("searchWord", {required:false, minLength:1})} type="Search" className="input rounded-md border-0 w-3/4 md:w-3/12"
               placeholder="Search Restaurants..."/>
      </form>
      <RestaurantCategoryArea slug={params.slug}/>
      <RestaurantQueryList isSkip={false} query={queryStr} slug={params.slug}/>
    </div>
  );
}
