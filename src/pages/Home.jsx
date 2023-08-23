import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const Home = () => {
  return (
    <div>
      <Header />
      <div className="flex flex-col justify-center items-center bg-pink-500 w-screen min-h-screen">
        <div className="text-white text-[80px] font-bold">home</div>
      </div>
    </div>
  );
};

export default Home;
