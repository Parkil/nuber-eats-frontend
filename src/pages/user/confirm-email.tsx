import React from "react";
import {gql, useApolloClient, useMutation} from "@apollo/client";
import {ExecVerifyEmailMutation, ExecVerifyEmailMutationVariables} from "../../__graphql_type/type";
import {useMe} from "../../hooks/useMe";
import {useHistory} from "react-router-dom";
import {getVerificationCode} from "../../util/getVerificationCode";

const VERIFY_EMAIL_MUTATION = gql`
  mutation execVerifyEmail($verifyEmailInput: VerifyEmailInput!) {
    verifyEmail(input: $verifyEmailInput){
      ok
      error
    }
  }
`;

/*
http://localhost:3000/confirm?code=7d968742-e8e3-4ed6-8672-17394cf026d2

react hook - state 와 연관된 로직을 재사용 하기 위해 따로 빼놓는것
use~ 로 명명한다

정상적인 확인이 되면
update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state.
오류가 발생하는데 이는 react 개발 환경에서 remount 를 하면서 발생하는 문제로 운영에서 돌려보고 문제 없으면 문제가 없는것

[내가 느낀점]
react component 에서 state에 분기를 태우는 행위는 없어야 한다 state에 분기를 태우는 순간 문제가 발생한다
 - 중간에 분기를 태울수는 있으나 최종적으로는 1개의 state 만 나와야 한다
 - 예를 들어 특정조건에서는 a state, 다른 조건에서는 b state 가 나와서는 안된다
redirect 를 수행할때에는 rendering 에서 수행하는것이 맞을듯
*/

export const ConfirmEmail = () => {
  document.title = 'ConfirmEmail | Nuber';

  const client = useApolloClient();
  const history = useHistory();
  const { data: userData } = useMe(); // refetch 를 선언할수 있는데 refecth()를 호출하면 해당 graphql 을 다시 호출한다

  const onCompleted = (data: ExecVerifyEmailMutation) => {
    const {verifyEmail:{ok}} = data;
    if (ok) {
      client.writeFragment({
        id: `User:${userData?.me.id}`,
        fragment: gql`
          fragment VerifiedUser on User {
            emailVerified
          }
        `,
        data: {
          emailVerified: true,
        },
      });
    }
  }

  const [verifyEmail] = useMutation<ExecVerifyEmailMutation, ExecVerifyEmailMutationVariables>(VERIFY_EMAIL_MUTATION, {onCompleted});

  if (!userData?.me.emailVerified) {
    verifyEmail({
      variables: {
        verifyEmailInput: {
          code: getVerificationCode()
        }
      }
    }).then();
  }

  return (
    <>
      {userData?.me.emailVerified && history.push("/")}
      {!userData?.me.emailVerified &&
        <div className="mt-52 flex flex-col items-center justify-center">
          <h2 className="text-lg mb-2 font-medium">Confirming email...</h2>
          <h4 className="text-gray-700 text-sm">Please wait, don`t close this page</h4>
        </div>
      }
    </>
  );
}