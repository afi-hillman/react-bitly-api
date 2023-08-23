import React, { createContext, useEffect, useState } from "react";
import Routes from "./Routes";
import { useCookies } from "react-cookie";

export const AuthContext = createContext(null);

const App = () => {
  const [cookies, setCookie] = useCookies(["jwt"]);
  const setJwtCookie = (jwt) => setCookie("jwt", jwt);
  const jwtCookie = cookies?.jwt;

  return (
    <AuthContext.Provider value={{ jwtCookie, setJwtCookie }}>
      <Routes />
    </AuthContext.Provider>
  );
};

AuthContext.displayName = "AuthContext";

export default App;
