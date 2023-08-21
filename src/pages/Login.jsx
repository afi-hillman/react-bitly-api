import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => console.log(data);
  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-pink-800">
      <h1 className="text-white font-bold text-7xl py-6">bit.ly</h1>
      <div className="bg-white max-w-[800px] p-4 space-y-2 rounded-md">
        <p className="font-semibold">Login as new user</p>
        <form className="w-[500px]" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <label>Username / Email</label>
            <input
              type="text"
              className="block border border-gray-400 p-2 rounded w-full"
              {...register("identifier", { required: true })}
            />
            {errors.identifer?.type === "required" && (
              <p role="alert" className="text-red-600">
                Field is required
              </p>
            )}
          </div>
          <div className="space-y-2">
            <label>Password</label>
            <input
              type="text"
              className="block border border-gray-400 p-2 rounded w-full"
              {...register("password", { required: true })}
            />
            {errors.password?.type === "required" && (
              <p role="alert" className="text-red-600">
                Field is required
              </p>
            )}
          </div>
          <button className="w-full bg-pink-800 text-white text-center p-3 rounded mt-2">
            Login
          </button>
          <Link
            className="block text-center text-pink-600 underline"
            to="/login"
          >
            Register an account
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
