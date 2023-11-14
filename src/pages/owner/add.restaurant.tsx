import React from "react"
import {ApolloError, gql, useMutation} from "@apollo/client";
import {ExecCreateRestaurantMutation, ExecCreateRestaurantMutationVariables} from "../../__graphql_type/type";
import {SubmitHandler, useForm} from "react-hook-form";
import {Button} from "../../components/button";
import {FormError} from "../../components/form.error";
import {MY_RESTAURANTS_QUERY} from "./my.restaurants";

export const CREATE_RESTAURANT_MUTATION = gql`
  mutation execCreateRestaurant($createRestaurantsInput: CreateRestaurantsInput!) {
    createRestaurant(input: $createRestaurantsInput){
      ok
      error
      restaurantId
    }
  }
`

interface IFormProps {
  address: string
  categoryName: string
  name: string
  file: FileList
}

export const AddRestaurant = () => {
  document.title = 'Add Restaurants | Nuber'

  const onCompleted = (data: ExecCreateRestaurantMutation) => {
    const {createRestaurant: {ok, restaurantId}} = data

    if (ok) {
      console.log('성공 : ', restaurantId)
    }
  }

  const onError = (error: ApolloError) => {
    console.log(error)
  }

  const [execCreateRestaurant, {data, loading}] = useMutation<ExecCreateRestaurantMutation, ExecCreateRestaurantMutationVariables>(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    onError,
    refetchQueries: [{query : MY_RESTAURANTS_QUERY}], //mutation 이 종료되면 자동으로 실행되는 query 를 지정
  });

  const {register, handleSubmit, formState: {errors, isValid}} = useForm<IFormProps>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!loading) {
      const {address, categoryName, name, file} = data;
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);

      const response = await fetch('http://localhost:4000/upload', {
        method: "POST",
        body: formBody,
      });

      const resp = await response.json();
      await execCreateRestaurant({
        variables: {
          createRestaurantsInput: {
            address,
            categoryName,
            name,
            coverImg: resp.url,
          }
        }
      })
    }
  }

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <h1>Add Restaurants</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <input {...register("address", {required: 'Address is required'})} placeholder="address"
                 className="input mb-3" type="text"/>

          <input {...register("categoryName", {required: 'categoryName is required'})}
                 placeholder="categoryName"
                 className="input mb-3" type="text"/>

          <input {...register("name", {required: 'name is required'})}
                 placeholder="name"
                 className="input" type="text"/>
          <div>
            <input {...register("file", {required: 'image file is required'})}
                 placeholder="Image File"
                 className="input mb-3" type="file" accept="image/*"/>
          </div>
          <Button canClick={isValid} loading={loading} actionText={'Create Restaurant'}/>
          {data?.createRestaurant.error && <FormError errorMsg={data.createRestaurant.error}/>}
        </form>
      </div>
    </div>
  )
}
