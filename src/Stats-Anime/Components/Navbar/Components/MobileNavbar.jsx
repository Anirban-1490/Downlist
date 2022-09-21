import { Link } from "react-router-dom";

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
        className="smallnav"
        style={
          isHamClicked
            ? { opacity: "1", width: "100%", transition: "none" }
            : { opacity: "0", width: "0", transition: " all 0.24s 1.7s" }
        }
      >
        <i
          className="fas fa-times"
          style={
            isHamClicked
              ? { opacity: "1" }
              : { opacity: "0", transition: "none" }
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

        {isHamClicked && (
          <>
            {data && (
              <button
                className="sign-out"
                style={{ color: "white" }}
                onClick={signoutHandler}
              >
                <p>Sign out</p>
                <ion-icon name="exit-outline"></ion-icon>
              </button>
            )}
            <div
              className={`smallnav-nav-container ${isHamClicked && "active"}`}
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
                  <Link to="userauth" className="signup-sm">
                    Sign in
                  </Link>
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
          </>
        )}
      </div>
    </>
  );
}
