import React, { useCallback, useMemo } from "react";
import "./header-style.css";
import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Appcontext } from "../../context";
import { useAuth } from "../../Feature/Authorize/Authorize";
import { path } from "../../../server-path";
import { Navbar } from "./Components/Navbar";
import { useWindowResize } from "../../Hooks/useWindowResize";
import { MobileNavbar } from "./Components/MobileNavbar";
import { useProfile } from "../../Hooks/useProfile";

export function ParentNavbar() {
  const [isHamClicked, setHamClicked] = useState(false);
  const innerWidth = useWindowResize();

  const userData = useAuth(true); //* custom hook for checking if user logged in or not
  const { pathname } = useLocation(); //* used to rerender the component if we hit back button to come here
  const navigate = useNavigate();
  const { changeUserData } = useContext(Appcontext);

  changeUserData(userData);

  const isSmallScreenWidth = innerWidth > 740 ? false : true;
  useMemo(() => {
    if (!isSmallScreenWidth) {
      setHamClicked(false);
    }
  }, [isSmallScreenWidth]);

  const userProfileData = useProfile(path, userData?.userID);

  const signoutHandler = useCallback(() => {
    localStorage.removeItem("token");
    if (pathname !== "/") {
      navigate("/", { replace: true });

      return;
    }
    window.location.reload();
  }, [navigate, pathname]);

  const props = useMemo(
    () => ({
      signoutHandler,
      setHamClicked,
      isHamClicked,
      data: userData && { ...userData, ...userProfileData?.user },
    }),
    [
      setHamClicked,
      isHamClicked,
      signoutHandler,
      userData,
      userProfileData?.user,
    ]
  );

  return (
    <>
      {isSmallScreenWidth ? <MobileNavbar {...props} /> : ""}

      {useMemo(() => {
        return (
          <>
            {
              <Navbar
                {...{
                  ...props,
                  isSmallScreenWidth,
                  path: pathname,
                }}
              />
            }
          </>
        );
      }, [isSmallScreenWidth, props, pathname])}
    </>
  );
}
