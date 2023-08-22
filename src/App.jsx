import React, { createContext, useEffect, useState } from "react";
import Routes from "./Routes";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

const App = () => {
  const [jwt, setJwt] = useState(null);
  const [cookies, setCookie] = useCookies("jwt");
  const setJwtCookie = (jwt) => setCookie("jwt", jwt);

  useEffect(() => {
    if (jwt) {
      setJwtCookie(jwt);
    }
  }, [jwt]);

  useEffect(() => {
    if (cookies?.jwt) {
      setJwt(cookies.jwt);
    }
  }, [cookies?.jwt]);
  return (
    <AuthContext.Provider value={{ jwt, setJwt, setJwtCookie }}>
      <Routes />
    </AuthContext.Provider>
  );
};

AuthContext.displayName = "AuthContext";

export default App;
