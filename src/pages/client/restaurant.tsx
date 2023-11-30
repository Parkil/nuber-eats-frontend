import React, {useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {gql, useMutation, useQuery} from "@apollo/client";
import {DISH_FRAGMENT, RESTAURANT_FRAGMENT} from "../../constant/fragments";
import {
  CreateOrderItemInput,
  ExecCreateOrderMutation,
  ExecCreateOrderMutationVariables,
  FindRestaurantQuery,
  FindRestaurantQueryVariables
} from "../../__graphql_type/type";
import {Dish} from "../../components/dish/dish";
import {DishOptionElement} from "../../components/dish/dish.option.element";

interface IRestaurantParams {
  id: string;
}

export const FIND_RESTAURANT_QUERY = gql`
 query findRestaurant($restaurantInput: RestaurantInput!) {
  findRestaurant(input: $restaurantInput) {
    ok
    error
    restaurant {
      ...RestaurantParts
      menu {
        ...DishParts
      }
    }
  }
}
${RESTAURANT_FRAGMENT}
${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation execCreateOrder($createOrderInput: CreateOrderInput!) {
    createOrder(input: $createOrderInput){
      ok
      error
      orderId
    }
  }
`

export const Restaurant = () => {
  const {id} = useParams<IRestaurantParams>()

  const {data, loading} = useQuery<FindRestaurantQuery, FindRestaurantQueryVariables>(FIND_RESTAURANT_QUERY, {
    variables: {
      restaurantInput: {
        restaurantId: +id
      }
    }
  })

  const history = useHistory()
  const onCompleted = (data: ExecCreateOrderMutation) => {
    const {createOrder: {ok, orderId}} = data;
    if (ok) {
      alert("order created")
      history.push(`/orders/${orderId}`)
    }
  }

  const [execCreateOrder, {loading: placingOrder}] = useMutation<ExecCreateOrderMutation, ExecCreateOrderMutationVariables>(CREATE_ORDER_MUTATION, {
    onCompleted,
  });

  const [orderStarted, setOrderStarted] = useState(false)
  const [orderDishes, setOrderDishes] = useState<CreateOrderItemInput[]>([])
  const triggerStartOrder = () => {
    setOrderStarted(true)
  }

  const getItem = (dishId: number) => orderDishes.find(order => order.dishId === dishId)

  const isSelected = (dishId: number): boolean => {
    return Boolean(getItem(dishId))
  }

  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return
    }

    setOrderDishes(current => [...current, {dishId, options: []}])
  }

  const removeFromOrder = (dishId: number) => {
    setOrderDishes(current => current.filter(row => row.dishId !== dishId))
  }

  const addOptionToItem = (dishId: number, option: any) => {
    if (!isSelected(dishId)) {
      return
    }

    const oldItem = getItem(dishId)
    if (oldItem) {
      const hasOption = Boolean(oldItem.options?.find(oldOption => oldOption.name === option.name))
      if (!hasOption) {
        removeFromOrder(dishId)
        const oldOptions = oldItem.options

        let options = (oldOptions) ? [option, ...oldOptions] : [option]
        setOrderDishes(current => [{dishId, options}, ...current])
      }
    }
  }

  const onOptionClick = (dishId: number, optionName: string) => {
    if (addOptionToItem) {
      if (!isOptionSelected(dishId, optionName)) {
        addOptionToItem(dishId, {name: optionName})
      } else {
        removeOptionToItem(dishId, optionName)
      }
    }
  }

  const getOptionsFromItem = (item: CreateOrderItemInput | undefined, optionName: string) => {
    return item?.options?.find(option => option.name === optionName)
  }

  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId)
    return Boolean(getOptionsFromItem(item, optionName))
  }

  const removeOptionToItem = (dishId: number, optionName: string) => {
    const oldItem = getItem(dishId)

    if (oldItem) {
      removeFromOrder(dishId)
      let filterOptions = oldItem.options?.filter(options => options.name !== optionName)
      setOrderDishes(current => [{dishId, options: filterOptions}, ...current])
    }
  }

  const triggerCancelOrder = () => {
    setOrderStarted(false)
    setOrderDishes([])
  }

  const triggerConfirmOrder = () => {
    if (placingOrder) {
      return
    }

    // todo 선택한 dish 값을 옆에 띄우기
    if (orderDishes.length === 0) {
      alert("Can't place empty order")
      return
    }

    const ok = window.confirm('You are about place on order')
    if (ok) {
      console.log('create order mutation')
      execCreateOrder({
        variables :{
          createOrderInput: {
            restaurantId: +id,
            items: orderDishes
          }
        }
      }).then()
    }
  }

  console.log(orderDishes)

  return (
    <>
      {!loading &&
        <div>
          <div style={{backgroundImage: `url(${data?.findRestaurant.restaurant?.coverImg})`}}
               className="bg-gray-800 py-48 bg-center bg-cover">
            <div className="bg-white w-3/12 py-8 px-5 xl:px-0">
              <h4 className="text-4xl mb-3">{data?.findRestaurant.restaurant?.name}</h4>
              <Link to={`/category/${data?.findRestaurant.restaurant?.category.slug}`}><h5
                className="text-sm font-light mb-2">{data?.findRestaurant.restaurant?.category.name}</h5></Link>
              <h6 className="text-sm font-light">{data?.findRestaurant.restaurant?.address}</h6>
            </div>
          </div>

          <div className={'container pb-32 flex flex-col items-end mt-20'}>
            {!orderStarted &&
              <button onClick={triggerStartOrder} className={'btn px-10 bg-lime-600'}>
                Start Order
              </button>
            }

            {orderStarted &&
              <div className={`flex items-center`}>
                <button onClick={triggerConfirmOrder} className={'btn px-10 mr-3 bg-lime-600'}>
                  Confirm Order
                </button>
                <button onClick={triggerCancelOrder} className={'btn px-10 bg-black hover:bg-black'}>
                  Cancel Order
                </button>
              </div>
            }
            <div className={'w-full grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10'}>
              {data?.findRestaurant.restaurant?.menu.map((dish) =>
                <Dish isSelected={isSelected(dish.id)} id={dish.id} isOrderStarted={orderStarted} key={dish.name}
                      description={dish.description} name={dish.name}
                      price={dish.price} addItemToOrder={addItemToOrder}
                      removeFromOrder={removeFromOrder}>

                  {dish.options?.length !== 0 && (
                    <div>
                      <h5 className="mt-8 mb-3 font-medium">Dish Options:</h5>
                      <div className="grid gap-2  justify-start">
                        {dish.options?.map(option => <DishOptionElement key={option.name} dishId={dish.id} option={option}
                                                                    onOptionClick={onOptionClick}
                                                                    isSelected={isSelected(dish.id)}
                                                                    isOptionSelected={isOptionSelected(dish.id, option.name)}/>)
                      }
                      </div>
                    </div>
                  )}
                </Dish>)}
            </div>
          </div>
        </div>
      }
    </>
  );
}
