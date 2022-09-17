import { Link } from "react-router-dom";
import axios from "axios";
import { useReducer, useRef, useState } from "react";
import { reducerForSearchResult } from "../../../Reducer/reducer";
import { Loading } from "../Helper/LoadingText";
import { useScroll } from "../../../Hooks/useScroll";

export function Content({ isMotionEnabled }) {
  //*set up a canceltoken
  const [cancel, setcancel] = useState(null);

  const [data, dispatch] = useReducer(reducerForSearchResult, {
    searchResult: [],
    isLoading: true,
    text: "",
  });

  const searchContainer = useRef();
  const mainheader = useRef();
  const mainionfo = useRef();
  const wrapper = useRef();
  const mainContainerRef = useRef();

  const searchHandler = (e) => {
    e.preventDefault();
    const textValue = e.target.value;
    if (textValue !== "") {
      dispatch({ type: "loading" });

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
        .get(`https://api.jikan.moe/v3/search/anime?q=${textValue}&page=1`, {
          signal: abortController.signal,
        })
        .then((res) => {
          dispatch({
            type: "success",
            searchResult: [...res.data.results].slice(0, 4),
            isLoading: false,
          });
        })
        .catch((err) => {
          console.log(err);
          dispatch({ type: "error" });
        });
    } else {
      searchContainer.current.classList.add("search-result-container-toggle");
      mainheader.current.classList.add("title1-toggle");
      mainionfo.current.classList.add("info1-toggle");
      wrapper.current.classList.add("wrapper-toggle");
      dispatch({ type: "initial" });
    }
  };

  function getOpacity() {
    let op = 1;
    if (!isMotionEnabled) {
      const offsetFromTop =
        window.scrollY +
        mainContainerRef.current?.getBoundingClientRect().top -
        150;

      const heightOfElement = mainContainerRef.current?.offsetHeight;
      const scrollToTop = document.documentElement?.scrollTop;

      if (scrollToTop > offsetFromTop) {
        op = 1 - (scrollToTop - offsetFromTop) / heightOfElement;
      }
    }
    return op >= 0 ? op : 0;
  }

  //* subscribing to external api
  const opacity = useScroll(getOpacity);

  return (
    <>
      <div
        className="main-container"
        ref={mainContainerRef}
        style={{
          opacity,
          scale: `${!isMotionEnabled ? `0.48` : ``}`,
        }}
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
            autoComplete="off"
            onChange={searchHandler}
          />

          <span className="search-cover"></span>
          <div
            className="search-result-container search-result-container-toggle"
            ref={searchContainer}
          >
            {data.isLoading && <Loading loadingtext={data.text} />}
            {
              //* show the search result ----
              data?.searchResult.map((result) => {
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
