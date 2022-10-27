import Link from "next/link";

import mobileNavStyle from "Components/Global/Navbar/Style/MobileNav.module.scss";

export function MobileNavbar({
  data,
  signoutHandler,
  isHamClicked,
  setHamClicked,
}) {
  //*end animation after clicking a navigation link or the close button

  const clickhandler = () => {
    [...document.getElementsByClassName("parts")].forEach((ele) =>
      ele.classList.remove("animate")
    );

    setHamClicked(false);
  };

  return (
    <>
      <div
        className={mobileNavStyle["smallnav"]}
        style={
          isHamClicked
            ? { opacity: "1", width: "100%", transition: "none" }
            : { opacity: "0", width: "0", transition: " all 0.24s 1.7s" }
        }
      >
        <i
          className={mobileNavStyle["fas fa-times"]}
          style={
            isHamClicked
              ? { opacity: "1" }
              : { opacity: "0", transition: "none" }
          }
          onClick={clickhandler}
        ></i>
        <div className={mobileNavStyle["smallnav-parts-container"]}>
          <div
            className={`${mobileNavStyle["parts"]} ${mobileNavStyle["part-1"]} ${mobileNavStyle["anime-default"]}`}
            style={{ "--i": "1" }}
          ></div>
          <div
            className={`${mobileNavStyle["parts"]} ${mobileNavStyle["part-2"]} ${mobileNavStyle["anime-default"]}`}
            style={{ "--i": "2" }}
          ></div>
          <div
            className={`${mobileNavStyle["parts"]} ${mobileNavStyle["part-3"]} ${mobileNavStyle["anime-default"]}`}
            style={{ "--i": "3" }}
          ></div>
          <div
            className={`${mobileNavStyle["parts"]} ${mobileNavStyle["part-4"]} ${mobileNavStyle["anime-default"]}`}
            style={{ "--i": "4" }}
          ></div>
        </div>

        {isHamClicked && (
          <>
            {data && (
              <button
                className={mobileNavStyle["sign-out"]}
                style={{ color: "white" }}
                onClick={signoutHandler}
              >
                <p>Sign out</p>
                <ion-icon name={mobileNavStyle["exit-outline"]}></ion-icon>
              </button>
            )}
            <div
              className={`${mobileNavStyle["smallnav-nav-container"]} ${
                isHamClicked && mobileNavStyle["active"]
              }`}
            >
              {/* //* ------------------ navigation links */}
              {data && (
                <div className={mobileNavStyle["user-details-container"]}>
                  <div
                    className={mobileNavStyle["profile-img-container"]}
                    style={{
                      margin: "0 auto",
                      width: "40px",
                      height: "40px",
                    }}
                  >
                    <img src={data?.image} alt="" />
                  </div>
                  <h4
                    className={mobileNavStyle["user-name"]}
                    style={{
                      color: "darkorange",
                      fontSize: "1.55em",
                      textAlign: "center",
                    }}
                  >
                    HI, {data?.name}
                  </h4>

                  <h5 className={mobileNavStyle["user-status"]}>
                    {data?.status}
                  </h5>
                </div>
              )}

              <div className={mobileNavStyle["smallnav-nav"]}>
                <Link onClick={clickhandler} href="/topanime">
                  <a className={mobileNavStyle["navlink"]}>Anime</a>
                </Link>
                <Link onClick={clickhandler} href="/topcharacters">
                  <a className={mobileNavStyle["navlink"]}>Characters</a>
                </Link>
                <Link onClick={clickhandler} href="/about">
                  <a className={mobileNavStyle["navlink"]}>About</a>
                </Link>
                {!data && (
                  <Link onClick={clickhandler} href="/userauth">
                    <a className={mobileNavStyle["signup-sm"]}> Sign in</a>
                  </Link>
                )}
              </div>
              {data && (
                <div className={mobileNavStyle["smallnav-userlist"]}>
                  <div className={mobileNavStyle["smallnav-list-nav"]}>
                    <Link
                      href={`/useranimelist/${data.userID}`}
                      onClick={clickhandler}
                    >
                      <a className={mobileNavStyle["navlink"]}>Anime List</a>
                    </Link>
                    <Link
                      href={`/usercharacterlist/${data.userID}`}
                      onClick={clickhandler}
                    >
                      <a className={mobileNavStyle["navlink"]}>
                        Character List
                      </a>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
