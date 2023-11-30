import React from "react";
import {useParams} from "react-router-dom";
import {useViewOrder} from "../hooks/use.view.order";
import {OrderStatus, OrderUpdatesSubscription, UserRole} from "../__graphql_type/type";
import {useMe} from "../hooks/use.me";
import {gql} from "@apollo/client";
import {FULL_ORDER_FRAGMENT} from "../constant/fragments";

interface IOrderParam {
  orderId: string;
}

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdates($orderUpdatesInput: OrderUpdatesInput!) {
    orderUpdates(input: $orderUpdatesInput) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`

export const Order = () => {
  const {orderId} = useParams<IOrderParam>()

  document.title = `Order #${orderId} | Nuber Eats`

  // subscribeToMore : useQuery 실행후 subscription 을 이용하여 데이터의 전체 또는 일부를 수정하고자 할때 사용
  const { data, subscribeToMore, loading } = useViewOrder(+orderId)
  const { data: userData } = useMe()

  console.log(loading, data);

  if (!loading && data?.viewOrder.ok) {
    subscribeToMore({
      document:ORDER_SUBSCRIPTION,
      variables :{
        orderUpdatesInput: {
          id: +orderId
        }
      },
      updateQuery: (prev, {subscriptionData: {data}}: {subscriptionData:{data:OrderUpdatesSubscription}} ) => {
        // subscription data 가 존재하지 않는 경우에는 기존 데이터를 반환하도록 변경
        if (!data) {
          return prev
        }

        // subscription data 가 존재하는 경우에는 subscription data 를 반환하도록 변경
        return {
          viewOrder: {
            ...prev.viewOrder,
            orderInfo: {
              ...data.orderUpdates
            }
          }
        }
      }
    })
  }

  function onButtonClick(Cooking: OrderStatus) {

  }

  return (
    <div className="mt-32 container flex justify-center">
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{orderId}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          ${data?.viewOrder.orderInfo?.total}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By:{" "}
            <span className="font-medium">
              {data?.viewOrder.orderInfo?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            Deliver To:{" "}
            <span className="font-medium">
              {data?.viewOrder.orderInfo?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver:{" "}
            <span className="font-medium">
              {data?.viewOrder.orderInfo?.driver?.email ?? "Not yet."}
            </span>
          </div>
          {userData?.me.role === "Client" && (
            <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
              Status: {data?.viewOrder.orderInfo?.status}
            </span>
          )}
          {userData?.me.role === UserRole.Owner && (
            <>
              {data?.viewOrder.orderInfo?.status === OrderStatus.Pending && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooking)}
                  className={`bg-lime-500 hover:bg-lime-700 btn`}
                >
                  Accept Order
                </button>
              )}
              {data?.viewOrder.orderInfo?.status === OrderStatus.Cooking && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Cooked)}
                  className={`bg-lime-500 hover:bg-lime-700 btn`}
                >
                  Order Cooked
                </button>
              )}
              {data?.viewOrder.orderInfo?.status !== OrderStatus.Cooking &&
                data?.viewOrder.orderInfo?.status !== OrderStatus.Pending && (
                  <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
                    Status: {data?.viewOrder.orderInfo?.status}
                  </span>
                )}
            </>
          )}
          {userData?.me.role === UserRole.Delivery && (
            <>
              {data?.viewOrder.orderInfo?.status === OrderStatus.Cooked && (
                <button
                  onClick={() => onButtonClick(OrderStatus.PickedUp)}
                  className={`bg-lime-500 hover:bg-lime-700 btn`}
                >
                  Picked Up
                </button>
              )}
              {data?.viewOrder.orderInfo?.status === OrderStatus.PickedUp && (
                <button
                  onClick={() => onButtonClick(OrderStatus.Delivered)}
                  className={`bg-lime-500 hover:bg-lime-700 btn`}
                >
                  Order Delivered
                </button>
              )}
            </>
          )}
          {data?.viewOrder.orderInfo?.status === OrderStatus.Delivered && (
            <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
              Thank you for using Nuber Eats
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
