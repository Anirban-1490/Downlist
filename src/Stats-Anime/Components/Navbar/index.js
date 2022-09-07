import React from "react";
import "./header-style.css";
import { useState, useRef, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Appcontext } from "../../context";
import axios from "axios";
import { useQuery } from "react-query";
import { useAuth } from "../../Feature/Authorize/Authorize";
import { path } from "../../../server-path";
import { Navbar } from "./Components/Navbar";
import { MobileNavbar } from "./Components/MobileNavbar";

export function ParentNavbar() {
  const userData = useAuth(true); //* custom hook for checking if user logged in or not

  useLocation(); //* used to rerender the component if we hit back button to come here

  const { changeUserData, changeUserProfileDetails } = useContext(Appcontext);
  changeUserData(userData);

  const token = localStorage.getItem("token");
  function fetchUserProfile() {
    return axios.get(`${path.domain}user/${userData.userID}/profile/view`);
  }

  const { data } = useQuery(["profile", token], fetchUserProfile, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    cacheTime: 0,
    enabled: !!userData,
    onSettled: (data, err) => {
      if (err) return console.log(err);
      console.log(data);
      changeUserProfileDetails(data); //*store the data in the context
      return data.data.user.image;
    },
  });

  const signoutHandler = () => {
    localStorage.removeItem("token");
    if (window.location.pathname !== "/") {
      window.location.replace("/");

      return;
    }
    window.location.reload();
  };

  return (
    <>
      <MobileNavbar
        data={userData && { ...userData, ...data?.data.user }}
        signoutHandler={signoutHandler}
      />

      {
        <Navbar
          data={userData && { ...userData, ...data?.data.user }}
          signoutHandler={signoutHandler}
        />
      }
    </>
  );
}
