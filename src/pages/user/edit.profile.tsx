import React from "react";
import {useMe} from "../../hooks/use.me";
import {SubmitHandler, useForm} from "react-hook-form";
import {Button} from "../../components/button";
import {ApolloError, gql, useApolloClient, useMutation} from "@apollo/client";
import {ExecEditProfileMutation, ExecEditProfileMutationVariables} from "../../__graphql_type/type";
import {EMAIL_REGEX} from "../../constant/constant";
import {FormError} from "../../components/form.error";
import {FormWrapper} from "../../components/form/form.wrapper";
import {FormTitle} from "../../components/form/form.title";

interface IForm {
  email?: string;
  password?: string;
}

export const EDIT_PROFILE_MUTATION = gql`
  mutation execEditProfile($editProfileInput: EditProfileInput!) {
    editProfile(input: $editProfileInput) {
      ok
      error
    }
  }
`;

export const EditProfile = () => {
  document.title = 'Edit Profile | Nuber';

  const {data: userData} = useMe(); // refetch (graphql 을 다시 불러온다)
  const {register, handleSubmit, formState: {errors, isValid}, getValues} = useForm<IForm>({
    defaultValues: {email: userData?.me.email}
  });

  const onError = (error: ApolloError) => {
    console.log(error);
  }

  const client = useApolloClient();
  const onCompleted = (data: ExecEditProfileMutation) => {
    const {editProfile: {ok}} = data;

    if (ok && userData) {
      const {me:{email: orgEmail, id}} = userData;
      const {email: newEmail} = getValues();

      if(orgEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              email
              emailVerified
            }
          `,
          data: {
            emailVerified: false,
            email: newEmail,
          },
        });
      }
    }
  }

  const [execEditProfile, {
    data,
    loading
  }] = useMutation<ExecEditProfileMutation, ExecEditProfileMutationVariables>(EDIT_PROFILE_MUTATION, {
    onCompleted,
    onError
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!loading) {
      const {email, password} = data;
      //...(password !== "" && {password} : password 값이 존재하는 경우에만 password 값을 저장
      await execEditProfile({
        variables: {
          editProfileInput: {
            email, ...(password !== "" && {password})
          }
        }
      });
    }
  }

  // container presenter pattern - react 의 디자인 패턴인거 같은데 조사 필요
  return (
    <FormWrapper>
      <FormTitle title={'Edit Profile'}/>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <input {...register("email", {required: 'Email is required', pattern: EMAIL_REGEX})} type="email"
               placeholder="Email" className="input"/>
        {errors.email?.message && <FormError errorMsg={errors.email.message}/>}
        {errors.email?.type === "pattern" &&
          <FormError errorMsg={"Please enter a valid email"}/>}

        <input {...register("password", {})} type="password" placeholder="Password" className="input"/>

        <Button canClick={isValid} loading={loading} actionText={'Save Profile'}/>
        {data?.editProfile.error && <FormError errorMsg={data.editProfile.error}/>}
      </form>
    </FormWrapper>
  );
}
