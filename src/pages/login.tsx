import React from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {FormError} from "../components/form-error";
import {ApolloError, gql, useMutation} from "@apollo/client";
import {ExecLoginMutation, ExecLoginMutationVariables} from "../../__graphql_type/type";


/*
  mutation loginMutation($email:String!, $password:String!) -> FrontEnd 에서만 필요한 부분
 */
const LOGIN_MUTATION = gql`
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

  const onCompleted = (data: ExecLoginMutation) => {
    const {login: {error, ok, token}} = data;
    console.log(error, ok, token);

    if (ok) {
      console.log(token);
    }
  }

  const onError = (error: ApolloError) => {
    console.log(error);
  }

  const [execLogin, {data, loading}] = useMutation<ExecLoginMutation, ExecLoginMutationVariables>(LOGIN_MUTATION, {
    onCompleted,
    onError
  });

  const {register, handleSubmit, formState: {errors}} = useForm<IForm>();
  const onSubmit: SubmitHandler<any> = (data) => {
    if (!loading) {
      const {email, password} = data;
      execLogin({
        variables: {
          loginInput: {
            email, password
          }
        }
      });
    }
  }

  return <div className="h-screen flex items-center justify-center bg-gray-800">
    <div className="bg-white w-full max-w-lg pt-10 pb-5 rounded-lg text-center">
      <h3 className="text-3xl text-gray-800">Log In</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 px-5">
        <input {...register("email", {required: 'Email is required'})} type='email' placeholder="Email"
               className="input mb-3"/>
        {errors.email?.message && <FormError errorMsg={errors.email.message}/>}

        <input {...register("password", {required: 'Password is required', minLength: 4})} type='password'
               placeholder="Password"
               className="input"/>
        {errors.password?.message && <FormError errorMsg={errors.password.message}/>}
        {errors.password?.type === "minLength" &&
          <FormError errorMsg={"password must be more than large 4 character"}/>}

        <button className="btn mt-3">
          {loading ? "Loading..." : "Login"}
        </button>
        {data?.login.error && <FormError errorMsg={data.login.error}/>}
      </form>
    </div>
  </div>;
};