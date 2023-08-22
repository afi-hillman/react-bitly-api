import React, { useContext, useEffect } from "react";
import { AuthContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import { getUserId } from "../utils/api";

const Dashboard = () => {
  const { jwt, setJwt, setJwtCookie } = useContext(AuthContext);
  const navigate = useNavigate();

  const getAuthId = async () => {
    await getUserId(jwt)
      .then((res) => res.data)
      .catch((error) => {
        console.log(error);
        setJwt(null);
        setJwtCookie(null);
      });
  };

  useEffect(() => {
    if (!jwt) {
      navigate("/login");
    } else {
      getAuthId();
    }
  }, [jwt]);

  const logoutFunction = async () => {
    setJwt(null);
    setJwtCookie(null);
    navigate("/logout");
  };
  return (
    <div>
      <div className="w-screen min-h-screen bg-pink-600 flex flex-col justify-center items-center">
        <h4 className="text-white text-2xl font-bold">Logged in!</h4>
        <Link
          className="text-white hover:underline border px-4 py-2 hover:bg-pink-400 mb-4 mt-4"
          to="/"
        >
          Return to home
        </Link>
        <button
          onClick={logoutFunction}
          className="text-white hover:underline border px-4 py-2 hover:bg-pink-400"
        >
          Click here to logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
