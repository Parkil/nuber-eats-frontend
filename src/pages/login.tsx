import React from "react";
import {SubmitHandler, useForm, UseFormReturn} from "react-hook-form";
import {FormError} from "../components/form.error";
import {ApolloError, gql, useMutation} from "@apollo/client";
import {Button} from "../components/button";
import {Link} from "react-router-dom";
import {ExecLoginMutation, ExecLoginMutationVariables} from "../__graphql_type/type";
import {EMAIL_REGEX, LOCAL_STORAGE_TOKEN} from "../constant/constant";
import {isLoggedInVar, tokenVar} from "../apollo";
import {FormWrapper} from "../components/form/form.wrapper";
import {FormTitleAndLogo} from "../components/form/form.title.and.logo";
import {FormInput} from "../components/form/form.input";

/*
  mutation loginMutation($email:String!, $password:String!) -> FrontEnd 에서만 필요한 부분
 */
export const LOGIN_MUTATION = gql`
  mutation execLogin($loginInput: LoginInput!) {
    login(input: $loginInput){
      ok
      error
      token
    }
  }
`;

interface IForm {
  email: string;
  password: string;
}

/*
  useMutation 에 <ExecLoginMutation, ExecLoginMutationVariables> 을 사용하는 이유
  -> 해당 Mutation 호출시 파라메터의 type 을 명시하여 잘못된 type (string 을 받아야 하는데 number 를 넣는다거나..)
     이 들어오는것을 방지
  
  이를 위해서 graphql-codegen 을 사용 ( 좀 오래된거 같기는 한데 좀 더 찾아봐야 할듯 )
  
  1.설치
    npm install -D @graphql-codegen/typescript-operations @graphql-codegen/typescript
  2.설정
    codegen.yml 참조
  3.실행
    package.json generate 참조
 */
export const Login = () => {

  document.title = 'Login | Nuber';

  const onCompleted = (data: ExecLoginMutation) => {
    const {login: {ok, token}} = data;

    if (ok && token) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
      tokenVar(token);
      isLoggedInVar(true);
    }
  }

  const onError = (error: ApolloError) => {
    console.log(error);
  }

  const [execLogin, {data, loading}] = useMutation<ExecLoginMutation, ExecLoginMutationVariables>(LOGIN_MUTATION, {
    onCompleted,
    onError
  });

  const useFormReturn: UseFormReturn<IForm> = useForm<IForm>({
    mode: "onChange",
  });

  const {handleSubmit, formState: {isValid}} = useFormReturn

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!loading) {
      const {email, password} = data;
      await execLogin({
        variables: {
          loginInput: {
            email, password
          }
        }
      });
    }
  }

  return (
    <FormWrapper>
      <FormTitleAndLogo title={'Welcome Back'}/>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormInput name='email' type='email' placeHolder='Email'
                   validateOption={{required: true, pattern: EMAIL_REGEX}}
                   reactHookFormObj={useFormReturn}/>
        <FormInput name='password' type='password' placeHolder='Password'
                   validateOption={{required: true, minLength: 4}} reactHookFormObj={useFormReturn}/>

        <Button canClick={isValid} loading={loading} actionText={'Login'}/>
        {data?.login.error && <FormError errorMsg={data.login.error}/>}
      </form>
      <div>
        New to Nuber? <Link to='/create-account' className="text-lime-600 hover:underline">Create an Account</Link>
      </div>
    </FormWrapper>
  );
};
