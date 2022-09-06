import React from "react";
import "./header-style.css";
import { useState, useRef, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Appcontext } from "./context";
import axios from "axios";
import { useQuery } from "react-query";
import { useAuth } from "./authorize";
import { path } from "../server-path";

function Main() {
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
      <Smallnav
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

export function Navbar({ data, signoutHandler }) {
  const { ishamclick, toggle } = useContext(Appcontext);
  const [isexpand, setIsexpand] = useState(false);
  const [isScrolling, setScrolling] = useState(false);
  const path = window.location.pathname;
  const refdropmenu = useRef(null);
  const userbtn = useRef(null);
  const borderRef = useRef(null);
  const ulRef = useRef(null);
  const navParentRef = useRef(null);

  const toggelnav = () => {
    [...document.getElementsByClassName("parts")].forEach((ele) =>
      ele.classList.add("animate")
    );
    toggle(true);
  };

  //*get the position to move from left
  function getLeft(index, parentEle, currentEle) {
    var i = index;
    var totaLWidth = 0;
    while (i > 0) {
      totaLWidth += parentEle.childNodes[i].clientWidth;
      i--;
    }

    const left = 54.4 * index + totaLWidth + 2 + 42 * (index - 1);
    borderRef.current.style.display = "block";
    borderRef.current.style.left = `${index === 0 ? 42 : left}px`;
    borderRef.current.style.width = `${currentEle.clientWidth}px`;
  }

  useEffect(() => {
    //*check for any path match
    const isMatch = [...ulRef.current.childNodes].some((node) => {
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
      [...ulRef.current.childNodes].forEach((node, index) => {
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
  }, [path]);

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

  useEffect(() => {
    //* a scroll event handler to let the sticky navbar have a background color change
    const scrollHandler = (e) => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };
    window.addEventListener("scroll", scrollHandler);

    //* remove the event listner on unmount
    return () => window.removeEventListener("scroll", scrollHandler);
  });
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
        <Link to="/" className="logo-container">
          <h3 className={`logo-text ${isScrolling ? `sticky` : ``}`}>Uplist</h3>
        </Link>
        <ul ref={ulRef}>
          <nav onClick={bottomBorderHandler}>
            <Link className="link" to="/topanime">
              Anime
            </Link>
          </nav>
          <nav onClick={bottomBorderHandler}>
            <Link className="link" to="/topcharacters">
              Characters
            </Link>
          </nav>
          <nav onClick={bottomBorderHandler}>
            <Link className="link" to="/about">
              About
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
              {data.status && <h5 className="user-status">{data.status}</h5>}
              <Link to={`user/${data.userID}/view`}>
                <button className="your-anime">Profile</button>
              </Link>
              <Link to={`useranimelist/${data.userID}`}>
                <button className="your-anime">Anime list</button>
              </Link>
              <Link to={`usercharacterlist/${data.userID}`}>
                <button className="your-anime">Character list</button>
              </Link>
              <button className="sign-out" onClick={signoutHandler}>
                <p>Sign out</p>
                <ion-icon name="exit-outline"></ion-icon>
              </button>
            </div>
          </div>
        ) : (
          <Link to="userauth" className="signup">
            Sign in
          </Link>
        )}

        <i
          className={`fas fa-bars menutoggle ${
            ishamclick ? "toggle-style-ham" : ""
          }`}
          onClick={toggelnav}
        ></i>
      </div>
    </>
  );
}

//* mobile view navbar ----

export function Smallnav({ data, signoutHandler }) {
  //*end animation after clicking a navigation link or the close button
  const clickhandler = () => {
    [...document.getElementsByClassName("parts")].forEach((ele) =>
      ele.classList.remove("animate")
    );

    toggle(false);
  };
  const { ishamclick, toggle } = useContext(Appcontext);

  return (
    <>
      <div
        className="smallnav"
        style={
          ishamclick
            ? { opacity: "1", width: "100%", transition: "none" }
            : { opacity: "0", width: "0", transition: " all 0.24s 1.7s" }
        }
      >
        <i
          className="fas fa-times"
          style={
            ishamclick ? { opacity: "1" } : { opacity: "0", transition: "none" }
          }
          onClick={clickhandler}
        ></i>
        <div className="smallnav-parts-container">
          <div
            className="parts part-1 anime-default"
            style={{ "--i": "1" }}
          ></div>
          <div
            className="parts part-2 anime-default"
            style={{ "--i": "2" }}
          ></div>
          <div
            className="parts part-3 anime-default"
            style={{ "--i": "3" }}
          ></div>
          <div
            className="parts part-4 anime-default"
            style={{ "--i": "4" }}
          ></div>
        </div>
        {data && (
          <button
            className="sign-out"
            style={{ color: "white", display: ishamclick ? "block" : "none" }}
            onClick={signoutHandler}
          >
            <p>Sign out</p>
            <ion-icon name="exit-outline"></ion-icon>
          </button>
        )}
        <div
          className="smallnav-nav-container"
          style={
            ishamclick
              ? {
                  transition: "visibility 1s ease 0.55s",
                  visibility: "visible",
                }
              : {
                  visibility: "hidden",
                  transition: "none",
                }
          }
        >
          {/* //* ------------------ navigation links */}
          {data && (
            <div className="user-details-container">
              <div
                className="profile-img-container"
                style={{
                  margin: "0 auto",
                  width: "40px",
                  height: "40px",
                }}
              >
                <img src={data?.image} alt="" />
              </div>
              <h4
                className="user-name"
                style={{
                  color: "darkorange",
                  fontSize: "1.55em",
                  textAlign: "center",
                }}
              >
                HI, {data?.name}
              </h4>

              <h5 className="user-status">{data?.status}</h5>
            </div>
          )}

          <div className="smallnav-nav">
            <Link className="navlink" onClick={clickhandler} to="/topanime">
              Anime
            </Link>
            <Link
              className="navlink"
              onClick={clickhandler}
              to="/topcharacters"
            >
              Characters
            </Link>
            <Link onClick={clickhandler} className="navlink" to="/about">
              About
            </Link>
            {!data && (
              <h4>Please Login to see your List of anime/characters</h4>
            )}
          </div>
          {data && (
            <div className="smallnav-userlist">
              <div className="smallnav-list-nav">
                <Link
                  className="navlink"
                  to={`useranimelist/${data.userID}`}
                  onClick={clickhandler}
                >
                  Anime List
                </Link>
                <Link
                  className="navlink"
                  to={`usercharacterlist/${data.userID}`}
                  onClick={clickhandler}
                >
                  Character List
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Main;
