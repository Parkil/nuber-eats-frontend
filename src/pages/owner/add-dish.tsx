import React from "react"
import {useParams} from "react-router-dom";
import {ApolloError, gql, useMutation} from "@apollo/client";
import {ExecCreateDishMutation, ExecCreateDishMutationVariables, UserRole} from "../../__graphql_type/type";
import {FormError} from "../../components/form.error";
import {Button} from "../../components/button";
import {SubmitHandler, useForm} from "react-hook-form";
import {FormWrapper} from "../../components/form/form.wrapper";
import {FormTitle} from "../../components/form/form.title";

interface IRestaurantParams {
  id: string
}

interface IForm {
  name: string;
  price: number;
  description: UserRole;
  // options:number;
}

const CREATE_DISH_MUTATION = gql`
  mutation execCreateDish($createDishInput: CreateDishInput!) {
    createDish(input: $createDishInput){
      ok
      error
    }
  }
`

export const AddDish = () => {

  const {id} = useParams<IRestaurantParams>()

  const onCompleted = (data: ExecCreateDishMutation) => {
    const {createDish: {ok}} = data;

    if (ok) {
      console.log('success')
    }
  }

  const onError = (error: ApolloError) => {
    console.log(error);
  }

  const [execCreateDish, {
    data,
    loading
  }] = useMutation<ExecCreateDishMutation, ExecCreateDishMutationVariables>(CREATE_DISH_MUTATION, {
    onCompleted,
    onError
  });

  const {register, handleSubmit, formState: {errors, isValid}} = useForm<IForm>({
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!loading) {
      const {name, price, description} = data;
      await execCreateDish({
        variables: {
          createDishInput: {
            name, price, description, restaurantId: +id, options: [],
          }
        }
      });
    }
  }

  return (
    <FormWrapper>
      <FormTitle title={'Create Dish'}/>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <input {...register("name", {required: 'name is required'})} type='text' placeholder="Dish Name"
               className="input"/>
        {errors.name?.message && <FormError errorMsg={errors.name?.message}/>}

        <input {...register("price", {required: 'price is required'})} type='text'
               placeholder="Price"
               className="input"/>
        {errors.price?.message && <FormError errorMsg={errors.price.message}/>}

        <input {...register("description", {required: 'description is required'})} type='text'
               placeholder="Description"
               className="input mb-3"/>
        {errors.price?.message && <FormError errorMsg={errors.price.message}/>}

        <Button canClick={isValid} loading={loading} actionText={'Create Dish'}/>
        {data?.createDish.error && <FormError errorMsg={data.createDish.error}/>}
      </form>
    </FormWrapper>
  )
}
