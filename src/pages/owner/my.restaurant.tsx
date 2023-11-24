import React from "react";
import {Link, useParams} from "react-router-dom";
import {gql, useQuery} from "@apollo/client";
import {DISH_FRAGMENT, ORDER_FRAGMENT, RESTAURANT_FRAGMENT} from "../../constant/fragments";
import {OwnerRestaurantQuery, OwnerRestaurantQueryVariables} from "../../__graphql_type/type";
import {Dish} from "../../components/dish/dish";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer
} from "victory";

interface IRestaurantParams {
  id: string;
}

export const OWNER_RESTAURANT_QUERY = gql`
  query ownerRestaurant($ownerRestaurantInput: OwnerRestaurantInput!) {
    ownerRestaurant(input: $ownerRestaurantInput){
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  } 
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDER_FRAGMENT}
`;

export const MyRestaurant = () => {
  const {id} = useParams<IRestaurantParams>()

  const {data, loading} = useQuery<OwnerRestaurantQuery, OwnerRestaurantQueryVariables>(OWNER_RESTAURANT_QUERY, {
    variables: {
      ownerRestaurantInput: {
        id: +id
      }
    }
  })

  return (
    <>
      {
        !loading && <div>
          <div className="bg-gray-700 py-28 bg-center bg-cover"
               style={{backgroundImage: `url(${data?.ownerRestaurant.restaurant?.coverImg})`}}></div>
          <div className="container mt-10">
            <h2 className="text-4xl font-medium mb-10">{data?.ownerRestaurant.restaurant?.name ?? 'Loading ...'}</h2>
            <Link to={`/restaurant/${id}/add-dish`} className="mr-8 text-white bg-gray-800 py-3 px-10">
              Add Dish &rarr;
            </Link>
            <Link to={``} className="mr-8 text-white bg-lime-800 py-3 px-10">
              Buy Promotion &rarr;
            </Link>
          </div>
          <div className="mt-10">
            {data?.ownerRestaurant.restaurant?.menu.length === 0 ?
              <h4 className="text-xl mb-5">Please a Update Dish</h4> :
              <div className="grid mt-16 md:grid-cols-3 gap-x-5 gap-y-10">
                {data?.ownerRestaurant.restaurant?.menu.map((dish) =>
                  <Dish key={dish.name} description={dish.description} name={dish.name} price={dish.price}/>)}
              </div>
            }
          </div>
          <div className="mt-20 mb-10">
            <h4 className="text-center text-2xl font-medium">Sales</h4>
            <div>
              <VictoryChart width={window.innerWidth} height={500} containerComponent={<VictoryVoronoiContainer/>}
                            domainPadding={50} theme={VictoryTheme.material}>
                <VictoryLine
                  data={
                    data?.ownerRestaurant.restaurant?.orders.map(order => ({x: order.createdAt, y: order.total}))
                  }
                  labels={({datum}) => `$${datum.y}`}
                  labelComponent={<VictoryTooltip renderInPortal dy={-20}/>}
                  style={{data: {strokeWidth: 3}}}
                  interpolation={'natural'}
                />
                {/*<VictoryAxis dependentAxis style={{tickLabels: {fontSize:17, fill: 'red'} }} tickFormat={tick => `$${tick}`}/>*/}
                <VictoryAxis tickFormat={tick => new Date(tick).toLocaleDateString('ko')}
                             tickLabelComponent={<VictoryLabel renderInPortal/>}
                             style={{tickLabels: {fontSize: 15, fill: 'red', angle: 45}}}/>
              </VictoryChart>
            </div>
          </div>
        </div>
      }
    </>
  )
}
