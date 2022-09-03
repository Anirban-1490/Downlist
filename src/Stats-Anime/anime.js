import React from "react";
import "./animestyle.css";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Appcontext } from "./context";
import { useContext } from "react";
import react from "react";
import Fog from "vanta/dist/vanta.fog.min";
import animeSectionImage from "./Home_page_images/information-anime.JPG";
import characterSectionImage from "./Home_page_images/information-character.JPG";
import addingStuffToListGIF from "./Home_page_images/information-adding-stuff.gif";

import openSourceImages from "./Home_page_images/github-github-com.svg";
import simpleParallax from "simple-parallax-js";

function Main() {
  const mydiv = useRef();
  //* Vanta.js fog animated background initializer
  const [vantaEffect, setVantaEffect] = useState();

  const [parallaxEffect, setParallaxEffect] = useState();

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

  useEffect(() => {
    console.log(document.querySelector(".vanta-canvas"));
    if (!parallaxEffect) {
      const instance = new simpleParallax(mydiv.current, {
        scale: 2.1,
        orientation: "down",
        customWrapper: ".parent-wrapper",
      });
      setParallaxEffect(instance);
    }
    return () => {
      parallaxEffect?.destroy();
    };
  }, [parallaxEffect]);

  return (
    <>
      <div className="parent-wrapper">
        <div
          className="container1"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          ref={mydiv}
        >
          <Content />
        </div>
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
  const [opacity, setOpacity] = useState(1);

  const searchContainer = useRef();
  const mainheader = useRef();
  const mainionfo = useRef();
  const wrapper = useRef();
  const mainContainerRef = useRef();

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

  useEffect(() => {
    const scrollHandler = (e) => {
      const offsetFromTop =
        window.scrollY +
        mainContainerRef.current.getBoundingClientRect().top -
        150;

      const heightOfElement = mainContainerRef.current.offsetHeight;
      const scrollToTop = document.documentElement.scrollTop;

      if (scrollToTop > offsetFromTop) {
        const op = 1 - (scrollToTop - offsetFromTop) / heightOfElement;
        setOpacity(op >= 0 ? op : 0);
      }
    };
    window.addEventListener("scroll", scrollHandler);

    return () => window.removeEventListener("scroll", scrollHandler);
  });

  return (
    <>
      <div
        className="main-container"
        ref={mainContainerRef}
        style={{ opacity: `${opacity}` }}
      >
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
  const textContainerRef = useRef();
  const childNodesOfTextContainer = textContainerRef.current?.childNodes;
  let colors = [
    "lightgreen",
    "#FFD700",
    "#FF6103",
    "#ADD8E6",
    "#D4C2B0",
    "#D15D84",
  ];

  useEffect(() => {
    let activeChildrensIndex = [];

    let allChildrens = [];
    childNodesOfTextContainer?.forEach((node, index) => {
      if (node.nodeName === "H1") {
        allChildrens = [...allChildrens, ...node.children];
      }
    });
    // *maybe a external package will be more appearant in this case , but this will do the job

    function getRandomChildrens(limit) {
      let i = 0;

      while (i < limit) {
        const randomChildIndex = pickARndomChildrenIndex(
          activeChildrensIndex,
          allChildrens.length
        );

        const randomChild = allChildrens[randomChildIndex];
        const randomColorIndex = Math.floor(Math.random() * 10) % colors.length;

        randomChild.style.color = `${colors[randomColorIndex]}`;
        activeChildrensIndex.push(randomChildIndex);
        i++;
      }
    }

    function pickARndomChildrenIndex(activeChildrensIndex, totalChildrens) {
      const randomIndex = Math.floor(Math.random() * 100) % totalChildrens;

      return activeChildrensIndex.includes(randomIndex)
        ? pickARndomChildrenIndex(activeChildrensIndex, totalChildrens)
        : randomIndex;
    }

    const interId = setInterval(() => {
      //* remove the styles for activated childrens
      allChildrens.forEach((childNode, index) => {
        if (activeChildrensIndex.includes(index)) {
          childNode.style.color = "#ffffffe1";
        }
      });

      //* clear all the array
      activeChildrensIndex.length = 0;

      const getARandomLimit =
        (Math.floor(Math.random() * 10) % (allChildrens.length - 5)) + 1;

      getRandomChildrens(getARandomLimit);
    }, 1450);

    return () => clearInterval(interId);
  });

  return (
    <>
      <section className="home-section-1">
        <div className="main-text-container" ref={textContainerRef}>
          <h1>
            <span>y</span>
            <span>o</span>
            <span>u</span>
            <span>r</span>
          </h1>
          <h1>
            <span>o</span>
            <span>w</span>
            <span>n</span>
          </h1>
          <h1>
            <span>w</span>
            <span>o</span>
            <span>r</span>
            <span>l</span>
            <span>d</span>
          </h1>
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
            <img
              src={characterSectionImage}
              className="character-section-img"
              alt=""
            />
          </div>
          <div className="line-separator line-separator-1"></div>
          <div className="information">
            <h3>At your fingertip </h3>
            <p>
              Check out your favorites from a large list of anime and character
              collection, new or even top ones.
            </p>
          </div>
        </div>
        <div className="site-info-container">
          <div className="visual-content">
            <img src={addingStuffToListGIF} className="addto-list-gif" alt="" />
          </div>
          <div className="line-separator"></div>
          <div className="information">
            <h3>Add it to your list</h3>
            <p>
              One click, to add your favorites into <span>your list.</span>
            </p>
          </div>
        </div>
        <div className="site-info-container">
          <div className="visual-content">
            <img src={openSourceImages} className="github-image" alt="" />
          </div>
          <div className="line-separator"></div>
          <div className="information">
            <h3>Open to all</h3>
            <p>
              <a
                href="https://github.com/Anirban-1490/Uplist"
                target={"_blank"}
                rel="noreferrer"
              >
                Uplist
              </a>
              is a open-source project, meaning anyone can contribute their new
              ideas.
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
