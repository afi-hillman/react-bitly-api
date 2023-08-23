import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { postLoginUser, postRegisterUser } from "../utils/api";
import { AuthContext } from "../App";

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();
  const [loginState, setLoginState] = useState("pending");
  const { jwt, setJwt } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (jwt) {
      navigate("/dashboard");
    }
  }, [jwt]);
  const onSubmit = async (data) => {
    try {
      setLoginState("loading");
      const user = await postLoginUser({
        identifier: data.identifier,
        password: data.password,
      });
      console.log(user.message);
      setLoginState("success");
      setJwt(user.jwt);
    } catch (error) {
      setLoginState("error");
      const serverErrors = error?.response?.data || [];
      console.log(serverErrors);
      setError("identifier", { message: "invalid credentials" });
      setError("password", { message: "invalid credentials" });
    }
  };
  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center bg-orange-500">
      <h1 className="text-white font-bold text-7xl py-6">bit.ly</h1>
      {loginState !== "success" && (
        <div className="bg-white max-w-[800px] p-4 space-y-2 rounded-md">
          <p className="font-semibold">Login as existing user</p>
          <form className="w-[500px]" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <label>Username / Email</label>
              <input
                type="text"
                className="block border border-gray-400 p-2 rounded w-full"
                {...register("identifier", { required: true })}
              />
              {errors.identifier && (
                <p role="alert" className="text-red-600">
                  {errors.identifier.message || "This field is required"}
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
              disabled={loginState === "loading"}
              className="w-full disabled:bg-gray-400 bg-orange-500 text-white text-center p-3 rounded mt-2"
            >
              {loginState === "loading" ? "Logging in..." : "Login"}
            </button>
            <Link
              className="block text-center text-orange-500 underline"
              to="/register"
            >
              Don't have an account?
            </Link>
          </form>
        </div>
      )}
      {loginState === "success" && (
        <div className="flex flex-col justify-center items-center">
          <h4 className="text-white text-2xl font-bold">Logged in!</h4>
          <Link className="text-white hover:underline" to="/">
            Return to home
          </Link>
        </div>
      )}
    </div>
  );
};

export default Login;
