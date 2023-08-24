import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import { getAllLinks } from "../api";

const useGetAllLinks = (deps = []) => {
  const { jwtCookie } = useContext(AuthContext);
  const [fetchDataState, setFetchDataState] = useState("pending");
  const [data, setData] = useState([]);

  const fetchLinks = async () => {
    try {
      setFetchDataState("loading");
      const dataLinks = await getAllLinks(jwtCookie);
      console.log(dataLinks.data.data);
      setFetchDataState("success");
      setData(dataLinks.data.data);
    } catch (error) {
      setFetchDataState("error");
    }
  };
  useEffect(() => {
    fetchLinks();
  }, [...deps]);

  return { fetchDataState, data };
};

export default useGetAllLinks;
