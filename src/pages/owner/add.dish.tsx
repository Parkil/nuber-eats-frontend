import React from "react"
import {useHistory, useParams} from "react-router-dom";
import {ApolloError, gql, useMutation} from "@apollo/client";
import {ExecCreateDishMutation, ExecCreateDishMutationVariables, UserRole} from "../../__graphql_type/type";
import {FormError} from "../../components/form.error";
import {Button} from "../../components/button";
import {SubmitHandler, useFieldArray, useForm, UseFormReturn} from "react-hook-form";
import {FormWrapper} from "../../components/form/form.wrapper";
import {FormTitle} from "../../components/form/form.title";
import {FormInput} from "../../components/form/form.input";
import {OWNER_RESTAURANT_QUERY} from "./my.restaurant";

interface IRestaurantParams {
  id: string
}

interface IForm {
  name: string;
  price: string;
  description: UserRole;
  options: { name: string, extra: string, choices: { name: string, extra: string }[] }[];
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
  document.title = 'Create Dish | Nuber';

  const {id} = useParams<IRestaurantParams>()
  const history = useHistory()

  const onCompleted = (data: ExecCreateDishMutation) => {
    const {createDish: {ok}} = data;

    if (ok) {
      history.goBack()
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
    onError,
    refetchQueries: [{
      query: OWNER_RESTAURANT_QUERY, variables: {
        ownerRestaurantInput: {
          id: +id
        }
      }
    }],
  });

  const useFormReturn: UseFormReturn<IForm> = useForm<IForm>({
    mode: "onChange",
  });

  const {register, handleSubmit, formState: {isValid}, control} = useFormReturn

  const {fields, append, remove} = useFieldArray<IForm>({
    control,
    name: "options",
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!loading) {
      const {name, price, description, ...options} = data;

      const optionParam = options['options'].map((row: { name: string; extra: string }) => {
        return {
          name: row.name,
          extra: +row.extra
        }
      })

      await execCreateDish({
        variables: {
          createDishInput: {
            name, price: +price, description, restaurantId: +id, options: optionParam,
          }
        }
      });
    }
  }

  const onAddDishOption = () => {
    append({name: '', extra: ''})
  }

  const onDeleteOption = (index: number) => {
    remove(index)
  }

  return (
    <FormWrapper>
      <FormTitle title={'Create Dish'}/>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormInput name='name' type='text' placeHolder='Dish Name'
                   validateOption={{required: true}}
                   reactHookFormObj={useFormReturn}/>

        <FormInput name='price' type='number' placeHolder='Price'
                   validateOption={{required: true, min: 0}}
                   reactHookFormObj={useFormReturn}/>

        <FormInput name='description' type='text' placeHolder='Description'
                   validateOption={{required: true}}
                   reactHookFormObj={useFormReturn}/>

        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish Options</h4>
          <span className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5" onClick={onAddDishOption}
                onKeyUp={onAddDishOption}>
            Add Dish Option
          </span>

          {fields.map((field, index) =>
            <div className="mt-5" key={field.id}>
              <input {...register(`options.${index}.name`, {required: true})}
                     className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3" type="text"
                     placeholder="Option Name"/>
              <input {...register(`options.${index}.extra`, {required: true})}
                     className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2 mr-3" type="number"
                     placeholder="Option Extra Price"/>
              <span className="cursor-pointer text-white bg-red-500 ml-3 py-3 px-4 mt-5" onClick={() => onDeleteOption(index)}
                    onKeyUp={() => onDeleteOption(index)}>Delete Option</span>
            </div>)
          }
        </div>

        <Button canClick={isValid} loading={loading} actionText={'Create Dish'}/>
        {data?.createDish.error && <FormError errorMsg={data.createDish.error}/>}
      </form>
    </FormWrapper>
  )
}
