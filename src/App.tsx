import React from 'react';
import {LoggedOutRouter} from "./routers/logged-out-router";
import {useReactiveVar} from "@apollo/client";
import {LoggedInRouter} from "./routers/logged-in-router";
import {isLoggedInVar} from "./apollo";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  /*
  이렇게 구성을 하면 url prefix 나 기타 방법으로 router 를 분리해서 1개의 router
  파일이 과도하게 커지는것을 방지할수 있을듯
  */

  return isLoggedIn ? <LoggedInRouter/> : <LoggedOutRouter/>;
}

export default App;
