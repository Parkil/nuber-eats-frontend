import React from "react";

import {ApolloError, gql, useMutation} from "@apollo/client";
import {SubmitHandler, useForm} from "react-hook-form";
import nuberLogo from "../images/logo.svg";
import {FormError} from "../components/form-error";
import {Button} from "../components/button";
import {Link} from "react-router-dom";
import {
  ExecCreateAccountMutation,
  ExecCreateAccountMutationVariables, UserRole
} from "../__graphql_type/type";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation execCreateAccount($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput){
      ok
      error
    }
  }
`;

interface IForm {
  email: string;
  password: string;
  role: UserRole;
}

export const CreateAccount = () => {

  const onCompleted = (data: ExecCreateAccountMutation) => {
    const {createAccount: {error, ok}} = data;
    console.log(error, ok);

    if (ok) {
      console.log('정상적으로 계정이 생성됨');
    }
  }

  const onError = (error: ApolloError) => {
    console.log(error);
  }

  const [execCreateAccount, {
    data,
    loading
  }] = useMutation<ExecCreateAccountMutation, ExecCreateAccountMutationVariables>(CREATE_ACCOUNT_MUTATION, {
    onCompleted,
    onError
  });

  const {register, handleSubmit, formState: {errors, isValid}} = useForm<IForm>();
  const onSubmit: SubmitHandler<any> = async (data) => {
    /*
    if (!loading) {
      const {email, password} = data;
      await execCreateAccount({
        variables: {
          createAccountInput: {
            email, password,
          }
        }
      });
    }*/
  }

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} alt="nuber eats logo" className="w-52 mb-5"/>
        <h4 className="w-full font-medium text-left text-3xl mb-10">Let`s get started</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 w-full mb-5">
          <input {...register("email", {required: 'Email is required'})} type='email' placeholder="Email"
                 className="input mb-3"/>
          {errors.email?.message && <FormError errorMsg={errors.email.message}/>}

          <input {...register("password", {required: 'Password is required', minLength: 4})} type='password'
                 placeholder="Password"
                 className="input"/>
          {errors.password?.message && <FormError errorMsg={errors.password.message}/>}
          {errors.password?.type === "minLength" &&
            <FormError errorMsg={"password must be more than large 4 character"}/>}

          <select>
            {Object.keys(UserRole).map(role => <option key={role}>{role}</option>)}
          </select>

          <Button canClick={isValid} loading={loading} actionText={'Create Account'}/>
          {/*{data?.login.error && <FormError errorMsg={data.login.error}/>}*/}
        </form>
        <div>
          Already have an account? <Link to='/login' className="text-lime-600 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};