import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const Home = () => {
  return (
    <div>
      <Header />
      <div className="flex flex-col justify-center items-center bg-[#FCC200] w-screen min-h-screen">
        <div className="text-white text-[80px] font-bold">HOME</div>
        <Link className="text-white hover:underline" to="/login">
          Click to login!
        </Link>
      </div>
    </div>
  );
};

export default Home;
