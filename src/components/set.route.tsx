import React, {ReactElement} from "react";
import {Route} from "react-router-dom";

interface SetRouteProps {
  routeInfo: {path: string, component: ReactElement<any, any>}[]
}

export const SetRoute: React.FC<SetRouteProps> = ({routeInfo}) => {
  return <>{routeInfo.map(obj => <Route key={obj.path} path={obj.path} exact>{obj.component}</Route>)}</>
}
