import { useState, useRef, useLayoutEffect, useEffect } from "react";

import Link from "next/link";

import { useScroll } from "Hooks/useScroll";
import navbarStyle from "Components/Global/Navbar/Style/Navbar.module.scss";

export const Navbar = ({
    data,
    signoutHandler,
    isSmallScreenWidth,
    isHamClicked,
    setHamClicked,
    path,
}) => {
    const [isexpand, setIsexpand] = useState(false);

    const refdropmenu = useRef(null);
    const userbtn = useRef(null);
    const borderRef = useRef(null);
    const ulRef = useRef(null);
    const toggelnav = (e) => {
        setHamClicked(true);
    };

    useEffect(() => {
        //*check for any path match
        if (!isSmallScreenWidth) {
            const isMatch = [...ulRef.current.children].some((node) => {
                if (node.nodeName === "NAV") {
                    if (node.children[0].pathname === path) {
                        return true;
                    } else {
                        return false;
                    }
                }
                return false;
            });

            //* if atleast one then show the bottom border
            if (isMatch) {
                [...ulRef.current.children].forEach((node, index) => {
                    if (node.nodeName === "NAV") {
                        if (node.children[0].pathname === path) {
                            getLeft(index, ulRef.current, node);
                        }
                    }
                });
            } else {
                //* else just hide it
                borderRef.current.style.display = "none";
            }
        }
    }, [path, isSmallScreenWidth]);

    //* a click handler to check if the click event has appeared on the user ICON. If it's outside of that ICON then close the dropdown menu if opened

    typeof document !== "undefined" &&
        document.addEventListener("click", (e) => {
            const inBoundary = e.composedPath().includes(userbtn.current);
            if (refdropmenu.current) {
                if (inBoundary) {
                    if (!isexpand) {
                        refdropmenu.current.style.height = "auto";
                        setIsexpand(true);
                    } else {
                        refdropmenu.current.style.height = "0px";
                        setIsexpand(false);
                    }
                } else {
                    refdropmenu.current.style.height = "0px";
                    setIsexpand(false);
                }
            }
        });

    function getScrollStatus() {
        if (window.scrollY > 0) return true;
        return false;
    }

    const isScrolling =
        typeof window !== "undefined" && useScroll(getScrollStatus);

    //*get the position to move from left
    function getLeft(index, parentEle, currentEle) {
        borderRef.current.style.left = `${currentEle.offsetLeft}px`;
        borderRef.current.style.width = `${
            currentEle.getBoundingClientRect().width + 4
        }px`;
        borderRef.current.style.display = "block";
    }

    const bottomBorderHandler = (e) => {
        const index = [
            ...e.target.parentElement.parentElement.childNodes,
        ].findIndex((node) => node.children === e.currentTarget.children);

        getLeft(index, e.target.parentElement.parentElement, e.currentTarget);
    };

    return (
        <>
            <div
                className={`${navbarStyle["nav-container"]} ${
                    isScrolling && navbarStyle[`sticky`]
                }`}>
                <div
                    className={`${navbarStyle["nav-scroll-background"]} ${
                        isScrolling ? navbarStyle[`scrolling`] : ``
                    }`}></div>
                <Link href="/">
                    <a
                        className={`${navbarStyle["logo-container"]} ${
                            isScrolling && navbarStyle[`sticky`]
                        }`}>
                        {" "}
                        <img
                            src={"/DownlistLogoNew.svg"}
                            className={navbarStyle["logo"]}
                            alt="downlistlogo"
                        />
                    </a>
                </Link>
                {!isSmallScreenWidth && (
                    <>
                        <ul ref={ulRef}>
                            <nav onClick={bottomBorderHandler}>
                                <Link href="/topanime">
                                    <a className={navbarStyle["link"]}>
                                        {" "}
                                        Anime
                                    </a>
                                </Link>
                            </nav>
                            <nav onClick={bottomBorderHandler}>
                                <Link href="/topcharacters">
                                    <a className={navbarStyle["link"]}>
                                        Characters
                                    </a>
                                </Link>
                            </nav>
                            <nav onClick={bottomBorderHandler}>
                                <Link href="/about">
                                    <a className={navbarStyle["link"]}>About</a>
                                </Link>
                            </nav>
                            <div
                                className={navbarStyle["bottom-border"]}
                                ref={borderRef}></div>
                        </ul>
                        {data ? (
                            <>
                                <div
                                    className={navbarStyle["user"]}
                                    ref={userbtn}>
                                    <img src={data.image} alt="" />
                                </div>
                                <div
                                    className={navbarStyle["yourlist"]}
                                    ref={refdropmenu}>
                                    <h4 className={navbarStyle["user-name"]}>
                                        HI, <br />
                                        {data.name}
                                    </h4>
                                    {data.status && (
                                        <h5
                                            className={
                                                navbarStyle["user-status"]
                                            }>
                                            {data.status}
                                        </h5>
                                    )}
                                    <Link
                                        href={`/u/${data.userID}/profile/view`}>
                                        <a
                                            className={
                                                navbarStyle["your-anime"]
                                            }>
                                            Profile
                                        </a>
                                    </Link>
                                    <div
                                        className={
                                            navbarStyle["list-links-wrapper"]
                                        }>
                                        <div className={navbarStyle["label"]}>
                                            <div
                                                className={
                                                    navbarStyle["line"]
                                                }></div>
                                            <h4>List</h4>
                                            <div
                                                className={
                                                    navbarStyle["line"]
                                                }></div>
                                        </div>
                                        <Link
                                            href={`/u/${data.userID}/list/anime`}>
                                            <a
                                                className={
                                                    navbarStyle["your-anime"]
                                                }>
                                                Anime
                                            </a>
                                        </Link>
                                        <Link
                                            href={`/u/${data.userID}/list/character`}>
                                            <a
                                                className={
                                                    navbarStyle["your-anime"]
                                                }>
                                                Characters
                                            </a>
                                        </Link>
                                    </div>
                                    <button
                                        className={navbarStyle["sign-out"]}
                                        onClick={signoutHandler}>
                                        <p>Log Out</p>
                                        <ion-icon name="exit-outline"></ion-icon>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link href="/userauth">
                                <a className={navbarStyle["signup"]}>
                                    {" "}
                                    Sign in
                                </a>
                            </Link>
                        )}
                    </>
                )}
                {!isHamClicked && isSmallScreenWidth && (
                    <ion-icon
                        name="menu"
                        onClick={toggelnav}
                        id={navbarStyle["menu"]}></ion-icon>
                )}
            </div>
        </>
    );
};
