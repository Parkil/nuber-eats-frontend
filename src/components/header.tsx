import React from "react";
import {NuberLogo} from "./nuber-logo";
import {useMe} from "../hooks/useMe";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

/*
  em - 현재 element or 상위 element font-size 크기
  ex) font-size 가 16px 면 1em(16px) 2em(32px).....

  rem(root em) - body 의 font-size 크기
  ex) body 의 font-size 가 16px 면 1rem(16px) 2rem(32px).....
 */

export const Header:React.FC = () => {
  console.log('Header called');
  const {data} = useMe();
  return (
    <>
      {!data?.me.emailVerified && (
        <div className="bg-red-500 py-3 px-3 text-center text-xs text-white">
          <span>Please verify your email</span>
        </div>
      )}
      <header className="py-4">
        <div className="container px-5 xl:px-0 flex justify-between items-center">
          <NuberLogo classStr="w-40"/>
          <span className="text-xs">
            <Link to="/users/my-profile">
              <FontAwesomeIcon icon={faUser} className="text-xl"/>{data?.me.email}
            </Link>
          </span>
        </div>
      </header>
    </>
  );
}