import React from "react";
import {SubmitHandler, useForm} from "react-hook-form";

interface IForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {register, handleSubmit, formState: {errors}} = useForm<IForm>();
  const onSubmit: SubmitHandler<any> = (data) => {
    console.log(data);
  }

  return <div className="h-screen flex items-center justify-center bg-gray-800">
    <div className="bg-white w-full max-w-lg pt-10 pb-5 rounded-lg text-center">
      <h3 className="text-3xl text-gray-800">Log In</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 mt-5 px-5">
        <input {...register("email", {required: 'Email is required'})} type='email' placeholder="Email"
               className="input mb-3"/>
        {errors.email?.message && <span className="text-red-500 text-sm">{errors.email.message}</span>}

        <input {...register("password", {required: 'Password is required', minLength: 10})} type='password' placeholder="Password"
               className="input"/>
        {errors.password?.message && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        {errors.password?.type === "minLength" && <span className="text-red-500 text-sm">password must be more than large 10 character</span>}

        <button className="btn mt-3">
          Login
        </button>
      </form>
    </div>
  </div>;
};