import React from "react";
import "./animestyle.css";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Appcontext } from "./context";
import { useContext } from "react";
import react from "react";
import Fog from "vanta/dist/vanta.fog.min";
import animeSectionImage from "./Home_page_images/information-anime.JPG"
import characterSectionImage from "./Home_page_images/information-character.JPG"
import addingStuffToListGIF from "./Home_page_images/information-adding-stuff.gif"

import openSourceImages from "./Home_page_images/github-github-com.svg"

function Main() {
    
  const mydiv = useRef();
  const [vantaEffect, setVantaEffect] = useState();
  //* Vanta.js fog animated background initializer

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        Fog({
          el: mydiv.current,
          highlightColor: 0xe2b34,
          midtoneColor: 0x98368b,
          lowlightColor: 0x9285cf,
          baseColor: 0x148b93,
          speed: 1.3,
          zoom: 0.6,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <>
      <div
        className="container1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "scaleY(1.15)",
          top: "-50px",
          height: "90vh",
        }}
        ref={mydiv}
      >
        <Content />
      </div>
      <HomeHeader />
      <HomeExtraInformation />
    </>
  );
}

function Content() {
  const { toggle_loading_state, loading, set_loading_text } =
    useContext(Appcontext);
  const [keyward, setKeyward] = useState("");
  const [searchresult, setSearchresult] = useState([]);

  const searchContainer = useRef();
  const mainheader = useRef();
  const mainionfo = useRef();
  const wrapper = useRef();

  //* set up a axios cancel token
  const [cancel, setcancel] = useState(null);

  //* show the live search result
  const getResult = react.useCallback(() => {
    if (keyward !== "") {
      setSearchresult([]);
      toggle_loading_state(true); //*show loading text
      set_loading_text("Loading...");
      searchContainer.current.classList.remove(
        "search-result-container-toggle"
      );
      mainheader.current.classList.remove("title1-toggle");
      mainionfo.current.classList.remove("info1-toggle");
      wrapper.current.classList.remove("wrapper-toggle");

      if (cancel) {
        //* if there is a previous controller then abort it
        cancel.abort();
      }
      //*create a new abortcontroller object
      const abortController = new AbortController();
      setcancel(abortController);

      axios
        .get(`https://api.jikan.moe/v3/search/anime?q=${keyward}&page=1`, {
          signal: abortController.signal,
        })
        .then((res) => {
          setSearchresult([...res.data.results].slice(0, 4));
          toggle_loading_state(false);
        })
        .catch((err) => {
          console.log(err);
          set_loading_text("No results");
        });
    } else {
      searchContainer.current.classList.add("search-result-container-toggle");
      mainheader.current.classList.add("title1-toggle");
      mainionfo.current.classList.add("info1-toggle");
      wrapper.current.classList.add("wrapper-toggle");
      setKeyward("");
      setSearchresult([]);
    }
  }, [keyward]);

  useEffect(() => getResult(), [getResult]);

  return (
    <>
      <div className="main-container">
        <h2 className="title1" ref={mainheader}>
          <span>S</span>earch an <span>A</span>nime
        </h2>
        <p className="info1" ref={mainionfo}>
          Check details about your favourite anime
        </p>
        <div className="wrapper" ref={wrapper}>
          <input
            type="text"
            name=""
            id="search"
            placeholder="Search e.g. naruto ,fate"
            value={keyward}
            autoComplete="off"
            onChange={(e) => {
              e.preventDefault();
              setKeyward(e.target.value);
            }}
          />

          <span className="search-cover"></span>
          <div className="search-result-container" ref={searchContainer}>
            {loading && <Loading />}
            {
              //* show the search result ----
              searchresult.map((result) => {
                const { mal_id, title, image_url } = result;

                return (
                  <Link to={`anime/${mal_id}`} className="link" key={mal_id}>
                    <div className="search-result">
                      <div className="img-container">
                        <img src={image_url} alt="" />
                      </div>
                      <h5>{title}</h5>
                    </div>
                  </Link>
                );
              })
            }
          </div>
        </div>
      </div>
    </>
  );
}

function HomeHeader() {
  return (
    <>
      <section className="home-section-1">
        <div className="main-text-container">
          <h1>your</h1>
          <h1>own</h1>
          <h1>world</h1>
          <p>
            Explore a vast list of Anime and Characters. Comes with full details
            on them.
          </p>
        </div>
      </section>
    </>
  );
}

function HomeExtraInformation() {
  return (
    <section className="home-section-2">
      <div className="flex-container">
        <div className="site-info-container">
          <div className="visual-content">
            <img src={animeSectionImage} className="anime-section-img" alt="" />
            <img src={characterSectionImage} className="character-section-img" alt="" />
          </div>
          <div className="information">
            <h3>At your fingertip </h3>
            <p>Check out your favorites from a large list of anime and character collection, new or even top ones.</p>
          </div>
        </div>
        <div className="site-info-container">
          <div className="visual-content">
            <img src={addingStuffToListGIF} className="addto-list-gif"  alt="" />
          </div>
          <div className="information">
            <h3>Add it to your list</h3>
            <p>One click, to add your favorites into <span>
            your list.
            </span>
            </p>
          </div>
        </div>
        <div className="site-info-container">
          <div className="visual-content">

            <img src={openSourceImages} className="github-image" alt="" />
          </div>
          <div className="information">
            <h3>Open to all</h3>
            <p>
                <a href="https://github.com/Anirban-1490/Uplist" target={"_blank"} rel="noreferrer" >Uplist</a> 
                
                is a open-source project, meaning anyone can contribute their new ideas.
            </p>
            
          </div>
        </div>
        
      </div>
    </section>
  );
}

//* Loading text ----

function Loading() {
  const { loadingtext } = useContext(Appcontext);
  return (
    <>
      <h3 style={{ color: "white" }} className="loading">
        {loadingtext}
      </h3>
    </>
  );
}

export default Main;
