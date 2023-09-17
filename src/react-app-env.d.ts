/// <reference types="react-scripts" />

/*
  특정 모듈이 typescript 로 만들어지지 않은경우
  import {BrowserRouter as Router} from "react-router-dom";

  from 이후 모듈이 오류를 발생시키는 경우가 있다

  이경우 해결방법이 2가지가 있는데
  1.npm i --save-dev @types/[모듈명] 실행
  2.1번이 안될경우 여기에 declare module [모듈명] 실행
 */
