import React from "react";
import "./Styles/about-style.css";
import downlistBackground from "../../logo/DownlistLogoNew.svg";

export const About = () => {
  return (
    <>
      <div className="about-page-contianer">
        <div className="banner">
          <img src={downlistBackground} alt="" />
        </div>
        <p className="main-details">
          Downlist is a place for <b>Anime Lovers</b>.
          <br /> It's a place where you can view any <strong>Upcoming </strong>
          anime or some of the <strong>Top</strong> ones. <br />
          <br /> Want to checkout any of your favourite anime ? don't worry we
          have <b>Live Search </b>
          through which you can check details of any of your favourite anime.
          <br />
          <br />
          Want to checkout out about your favourite <strong>Character</strong>?
          the character section got information about <strong>Top </strong>
          characters and much more....
        </p>
        <h3>
          This Project is made using Jikan API -{" "}
          <a
            href="https://github.com/jikan-me/jikan"
            target={"_blank"}
            rel="noreferrer"
          >
            More details
          </a>
        </h3>
        <h3>
          More information on <i>Downlist</i> -{" "}
          <a
            href="https://github.com/Anirban-1490/Downlist"
            target={"_blank"}
            rel="noreferrer"
          >
            Github Page
          </a>
        </h3>

        <h3 className="connect">Connect with me</h3>
        <ul className="social">
          <a
            href="https://www.linkedin.com/in/anirban-pratihar-48a591226/"
            target={"_blank"}
            rel="noreferrer"
          >
            <i class="fab fa-linkedin"></i>
          </a>

          <a
            href="https://github.com/Anirban-1490"
            target={"_blank"}
            rel="noreferrer"
          >
            <i class="fab fa-github"></i>
          </a>
          <a
            href="https://twitter.com/Anirban45555"
            target={"_blank"}
            rel="noreferrer"
          >
            <i class="fab fa-twitter"></i>
          </a>
        </ul>
      </div>
    </>
  );
};
