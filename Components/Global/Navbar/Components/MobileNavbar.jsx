/** @jsxImportSource @emotion/react */
import Link from "next/link";

import mobileNavStyle from "Components/Global/Navbar/Style/MobileNav.module.scss";
import { AnyIcons } from "Components/Global/AnyIcons/AnyIcons";
import { css } from "@emotion/react";

export function MobileNavbar({
    data,
    signoutHandler,
    isHamClicked,
    setHamClicked,
}) {
    const positionRight = isHamClicked ? "0" : "-50%";

    const navLinks = [
        { path: "/topanime", label: "Anime" },
        { path: "/topcharacters", label: "Characters" },
        { path: "/about", label: "About" },
    ];
    !data &&
        navLinks.push({
            path: "/userauth",
            label: "Sign in",
            className: "sign-in",
        });
    data &&
        navLinks.push(
            {
                path: `/u/${data._id}/list/anime`,
                label: "Anime list",
            },
            {
                path: `/u/${data._id}/list/character`,
                label: "Characters list",
            }
        );

    const clickhandler = (e) => {
        setHamClicked(false);
    };

    return (
        <>
            <nav
                className={mobileNavStyle["mobile-navbar"]}
                css={{ right: positionRight }}>
                <button
                    onClick={clickhandler}
                    className={mobileNavStyle["close-btn"]}
                    aria-label="close button">
                    <AnyIcons badgeIcon={"close"} />
                </button>

                {!!data && (
                    <header>
                        <div
                            className={mobileNavStyle["profile-img"]}
                            title={data.name}>
                            <img src={data.image} alt={data.name} />
                        </div>
                        <Link href={`/u/${data._id}/profile/view`}>
                            <a
                                onClick={clickhandler}
                                className={mobileNavStyle["user-name"]}>
                                {data.name}
                            </a>
                        </Link>
                    </header>
                )}
                <div className={mobileNavStyle["nav-links"]}>
                    {navLinks.map((link) => {
                        return (
                            <Link key={link.path} href={link.path}>
                                <a
                                    className={mobileNavStyle[link.className]}
                                    onClick={clickhandler}>
                                    {link.label}
                                </a>
                            </Link>
                        );
                    })}
                </div>
                {!!data && (
                    <button
                        aria-label="log out"
                        className={mobileNavStyle["sign-out"]}
                        onClick={(e) => {
                            clickhandler(e);
                            signoutHandler();
                        }}>
                        Log Out
                        <AnyIcons badgeIcon={"exit-outline"} />
                    </button>
                )}
            </nav>
        </>
    );
}
