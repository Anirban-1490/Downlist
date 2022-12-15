import Link from "next/link";

import mobileNavStyle from "Components/Global/Navbar/Style/MobileNav.module.scss";

export function MobileNavbar({
  data,
  signoutHandler,
  isHamClicked,
  setHamClicked,
}) {
  //*end animation after clicking a navigation link or the close button

  const clickhandler = async () => {
    // [...document.getElementsByClassName("parts")].forEach((ele) =>
    //   ele.classList.remove("animate")
    // );
    setHamClicked(false);
    // setTimeout(() => {

    // }, 4000);
  };

  return (
    <>
      <div
        className={`${mobileNavStyle["smallnav"]} ${
          isHamClicked && mobileNavStyle["toggle"]
        }`}
      >
        {isHamClicked ? (
          <ion-icon
            name="close"
            id={mobileNavStyle["close-btn"]}
            onClick={clickhandler}
          ></ion-icon>
        ) : (
          ""
        )}

        <div className={mobileNavStyle["smallnav-parts-container"]}>
          <div
            className={`${mobileNavStyle["parts"]} ${
              mobileNavStyle["part-1"]
            } ${!isHamClicked && mobileNavStyle["anime-default"]} ${
              isHamClicked && mobileNavStyle["animate"]
            }`}
          ></div>
          <div
            className={`${mobileNavStyle["parts"]} ${
              mobileNavStyle["part-2"]
            } ${!isHamClicked && mobileNavStyle["anime-default"]} ${
              isHamClicked && mobileNavStyle["animate"]
            }`}
          ></div>
          <div
            className={`${mobileNavStyle["parts"]} ${
              mobileNavStyle["part-3"]
            } ${!isHamClicked && mobileNavStyle["anime-default"]} ${
              isHamClicked && mobileNavStyle["animate"]
            }`}
          ></div>
          <div
            className={`${mobileNavStyle["parts"]} ${
              mobileNavStyle["part-4"]
            } ${!isHamClicked && mobileNavStyle["anime-default"]} ${
              isHamClicked && mobileNavStyle["animate"]
            }`}
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
              
                {data && (
                  <h4
                    className={mobileNavStyle["user-name"]}
                  >
                    HI, {data?.name}
                  </h4>
                )}
                <Link href="/topanime">
                  <a
                    onClick={clickhandler}
                    className={mobileNavStyle["navlink"]}
                  >
                    Anime
                  </a>
                </Link>
                <Link href="/topcharacters">
                  <a
                    onClick={clickhandler}
                    className={mobileNavStyle["navlink"]}
                  >
                    Characters
                  </a>
                </Link>
                <Link href="/about">
                  <a
                    onClick={clickhandler}
                    className={mobileNavStyle["navlink"]}
                  >
                    About
                  </a>
                </Link>
                {!data && (
                  <Link href="/userauth">
                    <a
                      onClick={clickhandler}
                      className={mobileNavStyle["signup-sm"]}
                    >
                      {" "}
                      Sign in
                    </a>
                  </Link>
                )}

                {data && (
                  <>
                    <Link
                      href={`/anime/list/u/${data.userID}`}
                      onClick={clickhandler}
                    >
                      <a className={mobileNavStyle["navlink"]}>Anime List</a>
                    </Link>
                    <Link
                      href={`/character/list/u/${data.userID}`}
                      onClick={clickhandler}
                    >
                      <a className={mobileNavStyle["navlink"]}>
                        Character List
                      </a>
                    </Link>
                  </>
                )}
              
            </div>
          </>
        )}
      </div>
    </>
  );
}
