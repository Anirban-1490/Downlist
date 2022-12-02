import axios from "axios";
import {
  useCallback,
  useReducer,
  useRef,
  useMemo,
  useEffect,
  useState,
} from "react";
import { reducerForSearchResult } from "Feature/Reducer/reducer";

import Link from "next/link";
import { useScroll } from "Hooks/useScroll";

import mainStyle from "Components/Home/Style/MainContainer.module.scss";
import { Spinner } from "Components/Global/LoadingSpinner";
import { NoItem } from "Components/Global/NoItemFound/NoItemFound";
import { getUserToken } from "GetuserToken";

export function Content({ isMotionEnabled }) {
  const [data, dispatch] = useReducer(reducerForSearchResult, {
    searchResult: [],
    isLoading: true,
    isError: false,
    text: "",
  });

  const searchContainer = useRef();
  const mainheader = useRef();
  const mainionfo = useRef();
  const wrapper = useRef();
  const mainContainerRef = useRef();
  const [hasSearchQuery, setSearchQuery] = useState(false);
  const token = getUserToken();

  const throttledSearchHandler = useCallback((fn, timeout) => {
    let id = null;

    return (...args) => {
      clearTimeout(id);

      if (args[0]) {
        id = setTimeout(() => {
          fn(...args);
          id = null;
        }, timeout);
      }
    };
  }, []);

  const getSearchResult = async (textValue) => {
    try {
      const {
        data: { data: searchResult },
      } = await axios.get(`https://api.jikan.moe/v4/anime?q=${textValue}`);

      if (searchResult?.length === 0) {
        dispatch({ type: "error" });
        return;
      }

      dispatch({
        type: "success",
        searchResult: [...searchResult].slice(0, 4),
      });
    } catch (error) {
      dispatch({ type: "error" });
    }
  };

  const debounce = useMemo(
    () => throttledSearchHandler(getSearchResult, 1000),
    [throttledSearchHandler]
  );

  const searchHandler = (e) => {
    e.preventDefault();
    const textValue = e.target.value;

    if (textValue !== "") {
      dispatch({ type: "loading" });
      setSearchQuery(true);
    } else {
      dispatch({ type: "initial" });
      setSearchQuery(false);
    }
    debounce(textValue);
  };

  function getOpacity() {
    let op = 1;
    if (!isMotionEnabled) {
      const offsetFromTop =
        typeof window !== "undefined"
          ? window.scrollY +
            mainContainerRef.current?.getBoundingClientRect().top -
            150
          : 0;

      const heightOfElement = mainContainerRef.current?.offsetHeight;
      const scrollToTop =
        typeof document !== "undefined" && document.documentElement?.scrollTop;

      if (scrollToTop > offsetFromTop) {
        op = 1 - (scrollToTop - offsetFromTop) / heightOfElement;
      }
    }
    return op >= 0 ? op : 0;
  }

  useEffect(() => {
    if (!isMotionEnabled) {
      mainContainerRef.current.style.scale = "0.48";
    } else {
      mainContainerRef.current.style.scale = "1";
    }
  }, [isMotionEnabled]);

  //* subscribing to external api
  const opacity = useScroll(getOpacity);

  return (
    <>
      <div
        className={mainStyle["main-container"]}
        ref={mainContainerRef}
        style={{
          opacity,
        }}
      >
        <h2 className={mainStyle["title1"]} ref={mainheader}>
          <span>S</span>earch an <span>A</span>nime
        </h2>
        <p className={mainStyle["info1"]} ref={mainionfo}>
          Check details about your favourite anime
        </p>
        <div className={mainStyle["wrapper"]} ref={wrapper}>
          <input
            type="text"
            name=""
            id={mainStyle["search"]}
            placeholder="Search e.g. naruto ,fate"
            autoComplete="off"
            onChange={searchHandler}
          />

          <span className={mainStyle["search-cover"]}></span>
          <div
            className={`${mainStyle["search-result-container"]} ${
              !hasSearchQuery && mainStyle["search-result-container-toggle"]
            }`}
            ref={searchContainer}
          >
            {data.isLoading ? (
              <Spinner />
            ) : data.isError ? (
              <NoItem textColor={"#dfdfdf"} />
            ) : (
              data?.searchResult.map((result) => {
                const {
                  mal_id,
                  title,
                  images: {
                    jpg: { image_url },
                  },
                } = result;

                return (
                  <Link
                    href={`anime/${mal_id}`}
                    className={mainStyle["link"]}
                    key={mal_id}
                  >
                    <a>
                      <div className={mainStyle["search-result"]}>
                        <div className={mainStyle["img-container"]}>
                          <img src={image_url} alt="" />
                        </div>
                        <h5>{title}</h5>
                      </div>
                    </a>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
