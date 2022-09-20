import React, { useCallback, useMemo } from "react";
import "./header-style.css";
import { useState, useRef, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Appcontext } from "../../context";
import axios from "axios";
import { useQuery } from "react-query";
import { useAuth } from "../../Feature/Authorize/Authorize";
import { path } from "../../../server-path";
import { Navbar } from "./Components/Navbar";
import { useWindowResize } from "../../Hooks/useWindowResize";
import { MobileNavbar } from "./Components/MobileNavbar";

export function ParentNavbar() {
  const [isHamClicked, setHamClicked] = useState(false);
  const innerWidth = useWindowResize();

  const userData = useAuth(true); //* custom hook for checking if user logged in or not
  useLocation(); //* used to rerender the component if we hit back button to come here
  const { changeUserData, changeUserProfileDetails } = useContext(Appcontext);
  changeUserData(userData);

  const isSmallScreenWidth = innerWidth > 740 ? false : true;
  useMemo(() => {
    if (!isSmallScreenWidth) {
      setHamClicked(false);
    }
  }, [isSmallScreenWidth]);

  const token = localStorage.getItem("token");
  async function fetchUserProfile() {
    return (
      await axios.get(`${path.domain}user/${userData.userID}/profile/view`)
    ).data;
  }
  const { data } = useQuery(["profile", token], fetchUserProfile, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: 0,
    enabled: !!userData,
    onSettled: (data, err) => {
      if (err) return console.log(err);

      changeUserProfileDetails(data); //*store the data in the context
      return data.data.user.image;
    },
  });

  const signoutHandler = useCallback(() => {
    localStorage.removeItem("token");
    if (window.location.pathname !== "/") {
      window.location.replace("/");

      return;
    }
    window.location.reload();
  }, []);

  const props = useMemo(
    () => ({
      signoutHandler,
      setHamClicked,
      isHamClicked,
      data: userData && { ...userData, ...data?.user },
    }),
    [setHamClicked, isHamClicked, signoutHandler, userData, data?.user]
  );

  return (
    <>
      {isSmallScreenWidth ? <MobileNavbar {...props} /> : ""}

      {useMemo(() => {
        return <>{<Navbar {...{ ...props, isSmallScreenWidth }} />}</>;
      }, [isSmallScreenWidth, props])}
    </>
  );
}
