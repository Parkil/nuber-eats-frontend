import React from 'react';
import {SubmitHandler, useForm} from "react-hook-form";

class Inputs {
}

interface IForm {
  email: string;
  password: string;
}

export const LoggedOutRouter = () => {
  // register : form 의 input 등록, watch : register 로 등록된 input 의 입력값 추척, handleSubmit: submit 처리
  const {register, watch, handleSubmit, formState: {errors}} = useForm<IForm>();

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data)

  const onInvalid = () => {
    console.log(errors);
    console.log('cant create account');
  }

  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input {...register("email", {required: 'this is required', pattern: /^[A-Za-z0-9._%_-]+@gmail.com/,})}
                 type='email'
                 placeholder='email'/>
          {errors.email?.message && <span className='font-bold text-red-600'>{errors.email.message}</span>}
          {errors.email?.type === 'pattern' && <span className='font-bold text-red-600'>only gmail allowed</span>}
        </div>
        <div>
          <input {...register("password", {required: 'this is required'})} type='password' placeholder='password'/>
          {errors.password?.message && <span className='font-bold text-red-600'>{errors.password.message}</span>}
        </div>
        <button className='bg-yellow-500 text-white'>Submit</button>
      </form>
    </div>
  );
};
