import React, { useContext, useEffect } from "react";
import { AuthContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import useProtectedPage from "../utils/hooks/UseProtectedPage";

const NAV = [
  {
    link: "/dashboard",
    text: "Dashboard",
  },
  {
    link: "/links",
    text: "Links",
  },
];

const DashboardLayout = ({ children }) => {
  const { setJwtCookie } = useContext(AuthContext);
  const navigate = useNavigate();
  const logoutFunction = async () => {
    setJwtCookie(null);
    navigate("/logout");
  };
  useProtectedPage();
  return (
    <div className="flex w-screen min-h-screen">
      <div className="h-screen w-[250px] bg-pink-500 p-4 space-y-8 flex flex-col justify-between">
        <div>
          <h2 className="text-3xl text-white font-bold">bit.ly</h2>
          <div className="flex flex-col justify-between mt-6">
            <div>
              {NAV.map((link, index) => (
                <Link
                  className="flex flex-col text-white justify-center px-4 py-2 rounded-md hover:bg-white/10"
                  key={index}
                  to={link.link}
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div>
          <button
            onClick={logoutFunction}
            className="text-pink-500 w-full hover:underline border px-4 py-2 bg-white rounded-md hover:bg-pink-100"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
};

export default DashboardLayout;
