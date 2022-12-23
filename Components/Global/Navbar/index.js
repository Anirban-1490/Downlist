import React, { useCallback, useMemo } from "react";
// import "./header-style.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "Feature/Authorize/Authorize";
import { path } from "server-path";

import { useWindowResize } from "Hooks/useWindowResize";
import { MobileNavbar } from "./Components/MobileNavbar";
import { useProfile } from "Hooks/useProfile";
import { Navbar } from "./Components/Navbar";

export function ParentNavbar() {
    const router = useRouter();
    const { pathname, asPath } = router;
    const [isHamClicked, setHamClicked] = useState(false);
    const innerWidth = useWindowResize();
    const [userData, _] = useAuth(true);

    //* custom hook for checking if user logged in or not
    //* used to rerender the component if we hit back button to come here

    const isSmallScreenWidth = innerWidth > 740 ? false : true;

    useMemo(() => {
        if (!isSmallScreenWidth) {
            setHamClicked(false);
        }
    }, [isSmallScreenWidth]);

    const [userProfileData] = useProfile(path, userData?.userID);

    const signoutHandler = useCallback(() => {
        localStorage.removeItem("token");

        window.location.href = "/";
    }, [router, pathname]);

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
            {isSmallScreenWidth === true ? <MobileNavbar {...props} /> : ""}

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
