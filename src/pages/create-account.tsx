import React from "react";

import {ApolloError, gql, useMutation} from "@apollo/client";
import {SubmitHandler, useForm} from "react-hook-form";
import nuberLogo from "../images/logo.svg";
import {FormError} from "../components/form-error";
import {Button} from "../components/button";
import {Link, useHistory} from "react-router-dom";
import {
  ExecCreateAccountMutation,
  ExecCreateAccountMutationVariables, UserRole
} from "../__graphql_type/type";
import {EMAIL_REGEX} from "../constant/constant";

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
  document.title = 'Nuber - create account';

  const history = useHistory();
  const onCompleted = (data: ExecCreateAccountMutation) => {
    const {createAccount: {error, ok}} = data;
    console.log(error, ok);

    if (ok) {
      history.push("/login");
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
    if (!loading) {
      const {email, password, role} = data;
      await execCreateAccount({
        variables: {
          createAccountInput: {
            email, password, role
          }
        }
      });
    }
  }

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      {/*todo react-helmet 이 typescript 5에서 동작하지 않음 대체재를 찾아야 함*/}
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={nuberLogo} alt="nuber eats logo" className="w-52 mb-5"/>
        <h4 className="w-full font-medium text-left text-3xl mb-10">Let`s get started</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 w-full mb-5">
          <input {...register("email", {required: 'Email is required', pattern: EMAIL_REGEX})} type='email' placeholder="Email"
                 className="input mb-3"/>
          {errors.email?.message && <FormError errorMsg={errors.email.message}/>}
          {errors.email?.type === "pattern" &&
            <FormError errorMsg={"Please enter a valid email"}/>}

          <input {...register("password", {required: 'Password is required', minLength: 4})} type='password'
                 placeholder="Password"
                 className="input"/>
          {errors.password?.message && <FormError errorMsg={errors.password.message}/>}
          {errors.password?.type === "minLength" &&
            <FormError errorMsg={"password must be more than large 4 character"}/>}

          <select {...register("role", {required: 'UserRole is required'})} className="input mt-3">
            {Object.keys(UserRole).map(role => <option key={role}>{role}</option>)}
          </select>
          {errors.role?.message && <FormError errorMsg={errors.role.message}/>}

          <Button canClick={isValid} loading={loading} actionText={'Create Account'}/>
          {data?.createAccount.error && <FormError errorMsg={data.createAccount.error}/>}
        </form>
        <div>
          Already have an account? <Link to='/login' className="text-lime-600 hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};