import { useState, useRef, useContext, useEffect } from "react";
import { Appcontext } from "../../../context";

import { Link } from "react-router-dom";
import downlistLogo from "../../../logo/DownlistLogoNew.svg";
import { useScroll } from "../../../Hooks/useScroll";

export function Navbar({ data, signoutHandler }) {
  const { ishamclick, toggle } = useContext(Appcontext);
  const [isexpand, setIsexpand] = useState(false);
  const path = window.location.pathname;
  const refdropmenu = useRef(null);
  const userbtn = useRef(null);
  const borderRef = useRef(null);
  const ulRef = useRef(null);

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

  function getScrollStatus() {
    if (window.scrollY > 0) return true;
    return false;
  }

  const isScrolling = useScroll(getScrollStatus);
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
        <Link to="/" className={`logo-container ${isScrolling && `sticky`}`}>
          <img src={downlistLogo} className="logo" alt="downlistlogo" />
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
