import React from "react";

import {ApolloError, gql, useMutation} from "@apollo/client";
import {SubmitHandler, useForm, UseFormReturn} from "react-hook-form";
import {FormError} from "../components/form.error";
import {Button} from "../components/button";
import {Link, useHistory} from "react-router-dom";
import {ExecCreateAccountMutation, ExecCreateAccountMutationVariables, UserRole} from "../__graphql_type/type";
import {EMAIL_REGEX} from "../constant/constant";
import {FormWrapper} from "../components/form/form.wrapper";
import {FormTitleAndLogo} from "../components/form/form.title.and.logo";
import {FormInput} from "../components/form/form.input";
import {FormSelect} from "../components/form/form.select";

export const CREATE_ACCOUNT_MUTATION = gql`
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
  document.title = 'Create Account | Nuber';

  const history = useHistory();
  const onCompleted = (data: ExecCreateAccountMutation) => {
    const {createAccount: {ok}} = data;

    if (ok) {
      alert('Account Created! Log in now!');
      history.push("/");
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

  const useFormReturn: UseFormReturn<IForm> = useForm<IForm>({
    mode: "onChange",
  })

  const {handleSubmit, formState: {isValid}} = useFormReturn

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
    <FormWrapper>
      <FormTitleAndLogo title={'Let`s get started'}/>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormInput name='email' type='email' placeHolder='Email'
                   validateOption={{required: true, pattern: EMAIL_REGEX}}
                   reactHookFormObj={useFormReturn}/>
        <FormInput name='password' type='password' placeHolder='Password'
                   validateOption={{required: true, minLength: 4}} reactHookFormObj={useFormReturn}/>

        <FormSelect name='role' validateOption={{required: true}} reactHookFormObj={useFormReturn} rawData={UserRole}/>

        <Button canClick={isValid} loading={loading} actionText={'Create Account'}/>
        {data?.createAccount.error && <FormError errorMsg={data.createAccount.error}/>}
      </form>
      <div>
        Already have an account? <Link to='/' className="text-lime-600 hover:underline">Log in</Link>
      </div>
    </FormWrapper>
  );
};
