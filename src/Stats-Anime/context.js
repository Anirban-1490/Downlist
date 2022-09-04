import React from "react";
import react from "react";
import { useState } from "react";

const Appcontext = react.createContext();

const Approvider = ({ children }) => {
  const [ishamclick, setIshamclick] = useState(false);
  const [editState, setEditState] = useState(false);
  const [userData, setUserData] = useState();
  const [userProfileDetails, setUserProfileDetails] = useState({});

  const toggle = (bool) => {
    setIshamclick(bool);
  };
  const changeEditState = (e) => {
    e.preventDefault();
    setEditState(!editState);
  };

  const changeUserData = (user) => {
    setUserData(user);
  };

  //* for storing user's profile details between renders
  const changeUserProfileDetails = (userData) => {
    setUserProfileDetails(userData);
  };

  return (
    <Appcontext.Provider
      value={{
        ishamclick,
        toggle,
        changeEditState,
        editState,
        changeUserData,
        userData,
        changeUserProfileDetails,
        userProfileDetails,
      }}
    >
      {children}
    </Appcontext.Provider>
  );
};

export { Approvider, Appcontext };
