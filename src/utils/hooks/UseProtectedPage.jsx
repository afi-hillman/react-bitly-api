import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../App";
import { getUserId } from "../api";

const useProtectedPage = () => {
  const { jwtCookie, setJwtCookie } = useContext(AuthContext);
  const navigate = useNavigate();

  const getAuthId = async () => {
    await getUserId(jwtCookie)
      .then((res) => res.data)
      .catch((error) => {
        console.log(error);
        setJwtCookie(null);
      });
  };

  useEffect(() => {
    if (!jwtCookie) {
      navigate("/login");
    } else {
      getAuthId();
    }
  }, [jwtCookie]);
};

export default useProtectedPage;
