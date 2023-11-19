import React from "react";
import {RegisterOptions, UseFormReturn} from "react-hook-form";
import {FormError} from "../form.error";

interface IFormInputProps {
  name: string;
  type: string;
  placeHolder: string;
  validateOption: RegisterOptions<any, any>;
  reactHookFormObj: UseFormReturn<any>;
}

export const FormInput: React.FC<IFormInputProps> = ({name, type, placeHolder, validateOption, reactHookFormObj}) => {
  const {register, formState: {errors}} = reactHookFormObj

  return (
    <>
      <input {...register(name, validateOption)} type={type} placeholder={placeHolder}
               className="input"/>
      {errors[name]?.type === 'required' && <FormError errorMsg={`${name} is required`}/>}
      {errors[name]?.type === 'pattern' && <FormError errorMsg={`${name} is invalid ${type}`}/>}
      {errors[name]?.type === 'minLength' && <FormError errorMsg={`${name} is must be more than large ${validateOption.minLength} character`}/>}
    </>
  );
}
