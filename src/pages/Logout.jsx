import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { postLoginUser, postRegisterUser } from "../utils/api";
import { AuthContext } from "../App";

const Logout = () => {
  const { jwt, setJwt } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (jwt) {
      navigate("/dashboard");
    }
  }, [jwt]);

  return (
    <div className="bg-pink-600 w-screen min-h-screen flex flex-col justify-center items-center">
      <h4 className="text-white text-2xl font-bold">
        You have successfully logged out!
      </h4>
      <Link className="text-white hover:underline" to="/">
        Return to home
      </Link>
    </div>
  );
};

export default Logout;
