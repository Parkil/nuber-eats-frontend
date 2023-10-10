import React from "react";
import {gql, useApolloClient, useMutation} from "@apollo/client";
import {ExecVerifyEmailMutation, ExecVerifyEmailMutationVariables} from "../../__graphql_type/type";
import {useMe} from "../../hooks/useMe";
import {useHistory} from "react-router-dom";
import {getVerificationCode} from "../../hooks/locationHook";


/*
  프로세스
  1. 사용자 정보를 가져온다
    1-1. 이메일 인증이 이미 되었으면? -> 메인으로 이동
    1-2. 이메일 인증이 안되어 있으면?
      1-2-1.현재 url 파싱해서 인증코드를 가져온다
      1-2-2.인증코드로 verifyEmail mutation 실행
        1-2-2-1. 성공 -> 메인으로 이동
        1-2-2-2. 실패 -> alert 띄우고 메인으로 이동
 */

const VERIFY_EMAIL_MUTATION = gql`
  mutation execVerifyEmail($verifyEmailInput: VerifyEmailInput!) {
    verifyEmail(input: $verifyEmailInput){
      ok
      error
    }
  }
`;

/*
react 에서는 로직이 실행하는 중간에
조건이 맞지 않으면 다른 url로 튕긴다거나 하는 행동을 하면 rendering 문제가 발생하는거 같다
다른 url로 이동하는 행동은 무조건 최종 행동이 끝난 다음에 해야 할듯
 */

// todo history.push 로 처리하는 부분을 조건 rendering으로 변경필요
export const ConfirmEmail = () => {
  console.log('ConfirmEmail');
  const client = useApolloClient();
  const history = useHistory();
  const { data: userData } = useMe();

  if (userData?.me.emailVerified) {
    history.push("/");
  }

  const verificationCode = getVerificationCode();

  const onError = () => {
    console.log('email verification failed moving main page onError');
    history.push("/");
  }

  const onCompleted = (data: ExecVerifyEmailMutation) => {
    const {verifyEmail:{ok}} = data;

    if (!ok) {
      console.log('email verification failed moving main page onCompleted');
    }

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

    history.push("/");
  }

  const [verifyEmail] = useMutation<ExecVerifyEmailMutation, ExecVerifyEmailMutationVariables>(VERIFY_EMAIL_MUTATION, {onCompleted, onError});

  verifyEmail({
    variables: {
      verifyEmailInput: {
        code: verificationCode
      }
    }
  }).then((aaa) => console.log(aaa));


  /*
  const { data: userData } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: ExecVerifyEmailMutation) => {
    const {verifyEmail:{ok}} = data;

    if(ok && userData?.me.id) {
      // apollo cache 에 들어있는 데이터를 변경해서 header component 의 !data?.me.emailVerified 로직을 실행
      client.writeFragment({
        id: `User:${userData.me.id}`,
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
  };

  const [verifyEmail] = useMutation<ExecVerifyEmailMutation, ExecVerifyEmailMutationVariables>(VERIFY_EMAIL_MUTATION, {onCompleted});
  useEffect(() => {
    const [_, code] = window.location.href.split('code=');

    verifyEmail({
      variables: {
        verifyEmailInput: {
          code
        }
      }
    }).then();
  },[]);
  */
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-2 font-medium">Confirming email...</h2>
      <h4 className="text-gray-700 text-sm">Please wait, don`t close this page</h4>
    </div>
  );
}