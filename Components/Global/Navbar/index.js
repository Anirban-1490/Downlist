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
    const [userData, isLoading, isFetching, isError] = useAuth(true);

    const isSmallScreenWidth = innerWidth > 740 ? false : true;
    useMemo(() => {
        if (!isSmallScreenWidth) {
            setHamClicked(false);
        }
    }, [isSmallScreenWidth]);

    const signoutHandler = useCallback(async () => {
        try {
            await axios.patch(`${path.domain}api/v1/auth/log-out`, {
                userID: userData.user._id,
            });
            //*delete the cookies
            await axios.delete("/api/logout");
            localStorage.removeItem("token");

            router.replace("/");
        } catch (error) {
            return;
        }
    }, [userData]);

    const props = useMemo(
        () => ({
            signoutHandler,
            setHamClicked,
            isHamClicked,
            data: userData?.user,
            isLoading,
            isFetching,
            isError,
        }),
        [
            setHamClicked,
            isHamClicked,
            signoutHandler,
            userData,
            isLoading,
            isFetching,
            isError,
        ]
    );

    return (
        <>
            {isSmallScreenWidth === true && <MobileNavbar {...props} />}

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
