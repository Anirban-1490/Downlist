import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { v4 as generateUUID } from "uuid";
import { path } from "../../../server-path";

export const useAuth = (isenabled, redirect = false) => {
  //? custom hook to check if user is logged in or not when routing to any page

  const navigate = useNavigate();
  const token = localStorage.getItem("token") || "anonymous";

  const authorizeUser = async () => {
    const uniqueID = generateUUID();

    return (
      await axios.get(`${path.domain}api/v1/auth/authorize?reqID=${uniqueID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    ).data;
  };

  const { data } = useQuery(["user", token], () => authorizeUser(), {
    refetchOnWindowFocus: false,
    retry: false,
    notifyOnChangeProps: ["data"],
    onSettled: (data, err) => {
      if (err) {
        console.log(err?.response?.data);
        return;
      }

      //*this will remove the current route(the signup route) from history stack so user's can't go back to it. and also redirect the user to the home page
      if (redirect) return navigate("/", { replace: true });
    },
    enabled: !!isenabled,
  });

  return data;
};
