import React, {useState} from "react"
import {ApolloError, gql, useApolloClient, useMutation} from "@apollo/client";
import {ExecCreateRestaurantMutation, ExecCreateRestaurantMutationVariables} from "../../__graphql_type/type";
import {SubmitHandler, useForm} from "react-hook-form";
import {Button} from "../../components/button";
import {FormError} from "../../components/form.error";
import {MY_RESTAURANTS_QUERY} from "./my.restaurants";
import {getSingleObject} from "../../util/graphql.restaurant";
import {useHistory} from "react-router-dom";

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

const variableObj = {
  restaurantsInput: {
    page: 1,
    query: '',
  }
}

export const AddRestaurant = () => {
  document.title = 'Add Restaurants | Nuber'
  const history = useHistory()
  const client = useApolloClient()
  const [imageUrl, setImageUrl] = useState('')
  const getQueryResult = () => {
    return client.readQuery({query: MY_RESTAURANTS_QUERY, variables: variableObj})
  }
  
  /*
    react app에서 url에 직접 입력하여 들어오는 순간 기존 apollo cache나 기타 내용이 전부 지워진다
    이는 react에서 자체적으로 사용하는 cache의 경우에도 동일하게 적용되는거 같으니 react 개발시 참고가 필요
   */
  /*
    readQuery / writeQuery
    apollo cache 의 값을 가져오기(readQuery) / 수정(writeQuery) 기능을 한다

    readQuery 시 주의점
    variables 를 실제 호출과 동일하게 맞춰 주지 않으면 null 이 반환된다 주의할것

    writeQuery 시 주의점
    data 포맷을 실제 데이터와 동일하게 맞춰야 한다

    readQuery 나 writeQuery 모두 형식이 맞지 않으면 작동이 안되고 별도의 메시지가 표시가 되지 않기 때문에 주의할것

    readQuery / writeQuery 는 graphql 전체 데이터를 가져오고 수정하는데 사용되며
    데이터의 일부만 수정을 하고 싶으면 readFragment / writeFragment 를 사용
    
    리스트 페이지를 2개의 창에 띄우고 1개 창에서 레스토랑을 추가하게 되면 추가한 창에서는 리스트에 레스토랑이 표시가 되는데
    다른 창에서는 페이지를 refresh 하지 않는이상 추가한 레스토랑이 보이지 않는다(cache 적용이 안되는듯)
    이에 대해서는 공식문서를 확인해봐야 함
  */
  const onCompleted = (data: ExecCreateRestaurantMutation) => {
    const {createRestaurant: {ok, restaurantId}} = data

    if (ok) {
      console.log('성공 : ', restaurantId)
      const resultId = (!restaurantId) ? 0 : restaurantId
      const {categoryName, name, address} = getValues()

      const queryResult = getQueryResult()

      if (queryResult !== null) {
        client.writeQuery({
          query:MY_RESTAURANTS_QUERY,
          data: {
            findRestaurantsByOwner: {
              "__typename": "SearchRestaurantsOutput",
              "ok": true,
              "error": null,
              "totalPages": 1,
              "totalItems": 10,
              "searchResult": [
                ...queryResult.findRestaurantsByOwner.searchResult,
                getSingleObject({
                  id: resultId,
                  name: name,
                  coverImg: imageUrl,
                  categoryName: categoryName,
                  categorySlug: categoryName,
                  address: address,
                })
              ]
            },
          }, variables: variableObj
        })
      }

      history.push('/')
    }
  }

  const onError = (error: ApolloError) => {
    console.log(error)
  }

  const [execCreateRestaurant, {data, loading}] = useMutation<ExecCreateRestaurantMutation, ExecCreateRestaurantMutationVariables>(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
    onError,
    // refetchQueries: [{query : MY_RESTAURANTS_QUERY, variables: {
    //   restaurantsInput: {
    //     page: 1,
    //     query: '',
    //   }
    // }}], //mutation 이 종료되면 자동으로 실행되는 query 를 지정
  });

  const {register, handleSubmit, formState: {errors, isValid}, getValues} = useForm<IFormProps>({
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
      setImageUrl(resp.url)
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
