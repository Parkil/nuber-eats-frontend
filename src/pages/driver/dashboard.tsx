import React, {useEffect, useState} from "react";
import GoogleMapReact from 'google-map-react';
import {DriverLocation} from "../../components/driver.location";
import {gql, useMutation, useSubscription} from "@apollo/client";
import {FULL_ORDER_FRAGMENT} from "../../constant/fragments";
import {
  CookedOrdersSubscription,
  CookedOrdersSubscriptionVariables,
  ExecTakeOrderMutation,
  ExecTakeOrderMutationVariables
} from "../../__graphql_type/type";
import {useHistory} from "react-router-dom";

interface IDriverCoord {
  lat: number;
  lng: number;
}

const COOKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders{
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`

const TAKE_ORDER_MUTATION = gql`
  mutation execTakeOrder($takeOrderInput: TakeOrderInput!) {
    takeOrder(input: $takeOrderInput) {
      ok
      error
    }
  }
`

export const Dashboard = () => {

  const [driverCoords, setDriverCoords] = useState<IDriverCoord>({lat : 0, lng : 0})
  const [defaultCenter, setDefaultCenter] = useState<IDriverCoord>({lat : 0, lng : 0})

  const [map, setMap] = useState<google.maps.Map>()
  const [maps, setMaps] = useState<any>()

  const onSuccess = ({coords: { latitude, longitude }} : GeolocationPosition) => {
    if (defaultCenter.lat === 0 && defaultCenter.lng === 0) {
      setDefaultCenter({lat: latitude, lng: longitude})
    }
    setDriverCoords({lat: latitude, lng: longitude})
  }

  const onError = () => {
    // 원인은 명확하지 않으나 localhost 환경에서 sensor override 를 하면  watchPosition 에서 오류가 발생되어 오류 발생시 데이터를 가져오도록 변경
    navigator.geolocation.getCurrentPosition(({coords: { latitude, longitude }} : GeolocationPosition) =>  {
      setDriverCoords({lat: latitude, lng: longitude})
    }, () => {
      alert('위치 정보를 가져올수 없습니다')
    })
  }

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {enableHighAccuracy: true})
  },[])

  useEffect(() => {
    if (map && maps) {
      map.panTo({lat : driverCoords.lat, lng : driverCoords.lng})
      /*
      // 좌표를 기반으로 실제 주소를 찾는 예제
      const geoCoder = new google.maps.Geocoder()
      geoCoder.geocode({location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng)}, (results, status) => {
        console.log(results, status)
      })*/
    }
  }, [driverCoords.lat, driverCoords.lng])

  // map : 현재 표시되어 있는 map 객체 maps: google maps 라이브러리
  const onApiLoaded = (map: any, maps: any) => {
    setMap(map)
    setMaps(maps)

    map.panTo(driverCoords)
  }
  
  // 주의사항 google type 을 상단 import 문에서 선언하면 google not defined 오류가 발생한다
  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService()
      const directionRenderer = new google.maps.DirectionsRenderer({polylineOptions:{strokeColor:'#000'}})
      directionRenderer.setMap(map)
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng)
          },
          destination: {
            location: new google.maps.LatLng(driverCoords.lat + 0.05, driverCoords.lng + 0.05)
          },
          travelMode: google.maps.TravelMode.TRANSIT,
        }
      ).then(r => {
        directionRenderer.setDirections(r)
      })
    }
  }

  // backend에서 useSubscription 을 실제 구현시에는 redis 같은 서버로 구현하라는 의미가 기본 기능으로 쓰게 되면 만약 websocket 접속이 끊기게 되면 다시 event를 받아올수 없으니까 redis같은 서버로
  // 구현하라는 의미인듯
  const {data: cookedOrder} = useSubscription<CookedOrdersSubscription, CookedOrdersSubscriptionVariables>(COOKED_ORDERS_SUBSCRIPTION)

  useEffect(() => {
    if(cookedOrder?.cookedOrders.id) {
      makeRoute()
    }
  },[cookedOrder])

  const [execTakeOrder] = useMutation<ExecTakeOrderMutation, ExecTakeOrderMutationVariables>(TAKE_ORDER_MUTATION)

  const history = useHistory()
  const takeOrder = (id: number) => {
    execTakeOrder({
      variables: {
        takeOrderInput: {
          id: id
        }
      }
    }).then(() => history.push(`/order/${id}`), () => {alert('실패')})
  }

  /*
    GoogleMapReact 의 default Center 와 GoogleMapReact child 의 lat lng 좌표가
    비슷한 곳에 있어야 child 가  정상적으로 rendering 된다
    37.5488-126.6578
   */
  return (
    <div>
      <div>{driverCoords.lat}-{driverCoords.lng}</div>
      <div className={`bg-gray-800 overflow-hidden`} style={{ width: window.innerWidth, height: '50vh' }}>
        {
          defaultCenter.lat !== 0 && defaultCenter.lng !== 0 &&
          <GoogleMapReact
            bootstrapURLKeys={{ key: 'AIzaSyAXhBVgUxzcZ0yQ-8372IhRm922AYpOsoc'}}
            defaultCenter={{
              lat: defaultCenter.lat,
              lng: defaultCenter.lng
            }}
            defaultZoom={15}
            yesIWantToUseGoogleMapApiInternals={true}
            onGoogleApiLoaded={({ map, maps }) => onApiLoaded(map, maps)}
          >
            <DriverLocation
              //@ts-ignore
              lat={driverCoords.lat}
              lng={driverCoords.lng}/>
          </GoogleMapReact>
        }
      </div>
      <div className={`max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5`}>
        {
          cookedOrder?.cookedOrders ?
          <>
          <h1 className={`text-center text-3xl font-medium`}>New Cooked Order</h1>
          <h4 className={`text-center text-2xl font-medium my-3`}>Pick it up Soon! @ {cookedOrder.cookedOrders.restaurant.name}</h4>
          <button onClick={() => takeOrder(cookedOrder.cookedOrders.id)} className={`btn bg-lime-500 hover:bg-lime-700 w-full mt-5`}>Accept Challenge &rarr;</button>
          </> : <h1 className={`text-center text-3xl font-medium`}>No orders yet....</h1>
        }
      </div>
    </div>
  )
}
