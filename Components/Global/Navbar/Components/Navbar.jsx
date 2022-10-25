import { useState, useRef, useLayoutEffect } from "react";

import Link from "next/link";

import { useScroll } from "Hooks/useScroll";

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

  const toggelnav = () => {
    [...document.getElementsByClassName("parts")].forEach((ele) =>
      ele.classList.add("animate")
    );
    setHamClicked(true);
  };

  useLayoutEffect(() => {
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

  const isScrolling = useScroll(getScrollStatus);

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
      <div className={`nav-container ${isScrolling ? `sticky` : ``}`}>
        <div
          className={`nav-scroll-background ${isScrolling ? `scrolling` : ``}`}
        ></div>
        <Link href="/" className={`logo-container ${isScrolling && `sticky`}`}>
          <a>
            {" "}
            <img
              src={"/DownlistLogoNew.svg"}
              className="logo"
              alt="downlistlogo"
            />
          </a>
        </Link>
        {!isSmallScreenWidth && (
          <>
            <ul ref={ulRef}>
              <nav onClick={bottomBorderHandler}>
                <Link className="link" href="/topanime">
                  <a> Anime</a>
                </Link>
              </nav>
              <nav onClick={bottomBorderHandler}>
                <Link className="link" href="/topcharacters">
                  <a>Characters</a>
                </Link>
              </nav>
              <nav onClick={bottomBorderHandler}>
                <Link className="link" href="/about">
                  <a>About</a>
                </Link>
              </nav>
              <div className="bottom-border" ref={borderRef}></div>
            </ul>
            {data ? (
              <div className="user" ref={userbtn}>
                <div className="profile-img-container">
                  <img src={data.image} alt="" />
                </div>
                <div className="yourlist" ref={refdropmenu}>
                  <h4 className="user-name">
                    HI, <br />
                    {data.name}
                  </h4>
                  {data.status && (
                    <h5 className="user-status">{data.status}</h5>
                  )}
                  <Link href={`user/${data.userID}/view`}>
                    <a className="your-anime">Profile</a>
                  </Link>
                  <Link href={`useranimelist/${data.userID}`}>
                    <a className="your-anime">Anime list</a>
                  </Link>
                  <Link href={`usercharacterlist/${data.userID}`}>
                    <a className="your-anime">Character list</a>
                  </Link>
                  <button className="sign-out" onClick={signoutHandler}>
                    <p>Sign out</p>
                    <ion-icon name="exit-outline"></ion-icon>
                  </button>
                </div>
              </div>
            ) : (
              <Link href="userauth" className="signup">
                <a> Sign in</a>
              </Link>
            )}
          </>
        )}
        <i
          className={`fas fa-bars menutoggle ${
            isHamClicked ? "toggle-style-ham" : ""
          }`}
          onClick={toggelnav}
        ></i>
      </div>
    </>
  );
};
