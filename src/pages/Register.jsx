import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { postRegisterUser } from "../utils/api";
import { AuthContext } from "../App";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();
  const [registerState, setRegisterState] = useState("pending");
  const { jwt, setJwt } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (jwt) {
      navigate("/dashboard");
    }
  }, [jwt]);
  const onSubmit = async (data) => {
    try {
      setRegisterState("loading");
      const newUser = await postRegisterUser({
        username: data.username,
        email: data.email,
        password: data.password,
      });
      console.log(newUser);
      setRegisterState("success");
      // navigate("/login");
    } catch (error) {
      // console.log(error.response.data.data.errors);
      const serverErrors = error?.response?.data?.data?.errors || [];
      setRegisterState("error");
      serverErrors.map((serverError) =>
        setError(serverError.path, { message: serverError.message })
      );
      console.log(serverErrors);
    }
  };
  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-orange-500">
      <h1 className="text-white font-bold text-7xl py-6">bit.ly</h1>
      {registerState !== "success" && (
        <div className="bg-white max-w-[800px] p-4 space-y-2 rounded-md">
          <p className="font-semibold">Register as new user</p>
          <form className="w-[500px]" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label>Username</label>
              <input
                type="text"
                className="block border border-gray-400 p-2 rounded w-full"
                {...register("username", { required: true })}
              />
              {errors.username && (
                <p role="alert" className="text-red-600">
                  {errors.username.message || "This field is required"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label>Email</label>
              <input
                type="text"
                className="block border border-gray-400 p-2 rounded w-full"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <p role="alert" className="text-red-600">
                  {errors.email.message || "This field is required"}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label>Password</label>
              <input
                type="password"
                className="block border border-gray-400 p-2 rounded w-full"
                {...register("password", { required: true })}
              />
              {errors.password && (
                <p role="alert" className="text-red-600">
                  {errors.password.message || "This field is required"}
                </p>
              )}
            </div>
            <button
              disabled={registerState === "loading"}
              className="w-full disabled:bg-gray-400 bg-orange-500 text-white text-center p-3 rounded mt-2"
            >
              {registerState === "loading" ? "Registering..." : "Register"}
            </button>
            <Link
              className="block text-center text-orange-500 underline"
              to="/login"
            >
              Login as existing user
            </Link>
          </form>
        </div>
      )}
      {registerState === "success" && (
        <div className="flex flex-col justify-center items-center">
          <h4 className="text-white text-2xl font-bold">
            Registration completed!
          </h4>
          <Link className="text-white hover:underline" to="/login">
            Login as user
          </Link>
        </div>
      )}
    </div>
  );
};

export default Register;
