import React from "react";
import {useMe} from "../../hooks/use.me";
import {SubmitHandler, useForm, UseFormReturn} from "react-hook-form";
import {Button} from "../../components/button";
import {gql, useApolloClient} from "@apollo/client";
import {ExecEditProfileMutation} from "../../__graphql_type/type";
import {EMAIL_REGEX} from "../../constant/constant";
import {FormError} from "../../components/form.error";
import {FormWrapper} from "../../components/form/form.wrapper";
import {FormTitle} from "../../components/form/form.title";
import {FormInput} from "../../components/form/form.input";
import {useEditProfile} from "../../hooks/use.edit.profile";

interface IForm {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  document.title = 'Edit Profile | Nuber';

  const {data: userData} = useMe(); // refetch (graphql 을 다시 불러온다)

  const useFormReturn: UseFormReturn<IForm> = useForm<IForm>({
    mode: "onChange",
    defaultValues: {email: userData?.me.email}
  });

  const {handleSubmit, formState: {isValid}, getValues} = useFormReturn

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!loading) {
      const {email, password} = data;
      await execEditProfile({
        variables: {
          editProfileInput: {
            email, ...(password !== '' && {password}) // password 값이 존재하는 경우에만 password 값을 저장
          }
        }
      });
    }
  }

  // react-hook (use~ 로 시작) 은 조건문이나 use~ 로 시작하지 않는 함수 내부에서 사용할수 없다
  const client = useApolloClient();
  const onCompleted = (data: ExecEditProfileMutation) => {
    const {editProfile: {ok}} = data;

    if (ok && userData) {
      const {me: {email: orgEmail, id}} = userData;
      const {email: newEmail} = getValues();

      if (orgEmail !== newEmail) {
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
  }] = useEditProfile(onCompleted)

  // container presenter pattern - react 의 디자인 패턴인거 같은데 조사 필요
  return (
    <FormWrapper>
      <FormTitle title={'Edit Profile'}/>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormInput name='email' type='email' placeHolder='Email'
                   validateOption={{required: true, pattern: EMAIL_REGEX}}
                   reactHookFormObj={useFormReturn}/>
        <FormInput name='password' type='password' placeHolder='Password'
                   validateOption={{required: true, minLength: 4}} reactHookFormObj={useFormReturn}/>

        <Button canClick={isValid} loading={loading} actionText={'Save Profile'}/>
        {data?.editProfile.error && <FormError errorMsg={data.editProfile.error}/>}
      </form>
    </FormWrapper>
  );
}
