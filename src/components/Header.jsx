import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="w-screen h-[80px] px-[120px] flex flex-row justify-between mx-auto items-center bg-white text-black">
      <div className="text-[40px]">bit.ly</div>
      <div className="flex flex-row gap-12">
        <div>home</div>
        <div>my links</div>
        <Link
          className="text-black hover:underline border border-orange-500 px-4 rounded-md bg-white"
          to="/login"
        >
          login
        </Link>
      </div>
    </div>
  );
};

export default Header;
