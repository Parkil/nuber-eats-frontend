import React from "react";
import {RegisterOptions, UseFormReturn} from "react-hook-form";
import {FormError} from "../form.error";
import {UserRole} from "../../__graphql_type/type";

interface IFormInputProps {
  name: string;
  validateOption: RegisterOptions<any, any>;
  reactHookFormObj: UseFormReturn<any>;
  rawData: any,
}

export const FormSelect: React.FC<IFormInputProps> = ({name, validateOption, reactHookFormObj}) => {
  const {register, formState: {errors}} = reactHookFormObj

  return (
    <>
      <select {...register(name, validateOption)} className="input">
        {Object.keys(UserRole).map(role => <option key={role}>{role}</option>)}
      </select>
      {errors[name]?.type === 'required' && <FormError errorMsg={`${name} is required`}/>}
    </>
  );
}
