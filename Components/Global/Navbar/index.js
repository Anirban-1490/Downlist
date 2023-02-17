import React, { useCallback, useMemo } from "react";
import axios from "axios";
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
    const { pathname, asPath, replace } = router;
    const [isHamClicked, setHamClicked] = useState(false);
    const innerWidth = useWindowResize();
    const [userData, _] = useAuth(true);
    const [userProfileData] = useProfile(path, userData?.userID);

    const isSmallScreenWidth = innerWidth > 740 ? false : true;

    useMemo(() => {
        if (!isSmallScreenWidth) {
            setHamClicked(false);
        }
    }, [isSmallScreenWidth]);

    const signoutHandler = useCallback(async () => {
        try {
            const response = await axios.patch(
                `${path.domain}api/v1/auth/log-out`,
                {
                    userID: userData?.userID,
                }
            );

            if (response.status == 200) {
                localStorage.removeItem("token");

                window.location.href = "/";
            }
        } catch (error) {
            return;
        }
    }, [replace]);

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
