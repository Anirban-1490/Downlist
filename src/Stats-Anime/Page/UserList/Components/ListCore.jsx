import { useInView } from "react-intersection-observer";
import { useRef, useState, useEffect } from "react";
import { path } from "../../../../../server-path";
import axios from "axios";
import { Link } from "react-router-dom";
import { Dropdown } from "../../../Components/DropDownSelectMenu/DropDownSelectMenu";

export function ListCore(props) {
  const {
    header,
    switch_item,
    data,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    userID,
    setWhatToSortBy,
    refetch,
    clientData,
  } = props;

  const containerRef = useRef();

  const { ref, inView } = useInView({ threshold: 0 });

  const [stat, setStat] = useState("");
  //* sorting by options
  const options = [
    { genre_id: 1, name: "Favourite", _name: "fav" },
    switch_item !== "character"
      ? { genre_id: 2, name: "Score", _name: "score" }
      : {},
  ];

  const clearlist = async () => {
    await axios.delete(`${path.domain}user/${userID}/list/all/${switch_item}`);
    window.location.reload();
  };

  //*sort by which ?

  useEffect(() => {
    //* if the sort parameter is set , then first update the state and then refetch the query
    (async () => {
      await setWhatToSortBy(stat);
      await refetch({
        refetchPage: (lastPage, index, allPages) => {
          return true;
        },
      });
    })();
  }, [stat]);

  useEffect(() => {
    if (inView && data?.pages[data?.pages.length - 1]?.list?.length > 0) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      <h2 className="header">
        {`${clientData?.name.split(" ")[0]}'s ` + header}
      </h2>
      <div className="option-container">
        <div className="wrapper-type">
          {/* //? drop down for sorting */}
          <Dropdown
            options={options}
            setID={setStat}
            placeholder="Sort by..."
            stats_anime={switch_item}
          />
        </div>
        <button className="clr-btn" type="button" onClick={clearlist}>
          <span>
            <i className="fas fa-times"></i>
          </span>{" "}
          <span>Clear list</span>
        </button>
      </div>

      <ul
        className="search-container"
        style={
          data?.pages?.[0]?.list
            ? { border: "none" }
            : { border: "2.7px solid #8080804a" }
        }
        ref={containerRef}
      >
        {data?.pages[0]?.list?.length > 0 ? (
          data?.pages?.map((page) => {
            return (
              <>
                {page?.list?.map((item) => {
                  const { fav, malid, episodes, img_url, score, title } = item;

                  return (
                    <Link
                      to={`/${switch_item}/${malid}`}
                      key={malid}
                      className="items-container"
                    >
                      <li key={malid}>
                        <div className="img-container">
                          <img src={img_url} alt="" />
                        </div>
                        <div className="details">
                          <div className="title">
                            <h4>
                              {title?.length > 35
                                ? title.substr(0, 35) + "..."
                                : title}
                            </h4>
                          </div>
                          <div className="stats">
                            <h4>
                              {score || switch_item !== "character"
                                ? score || "??"
                                : ""}
                            </h4>
                            <h4>
                              <i
                                style={{ marginRight: "10px", color: "yellow" }}
                                className="fas fa-star"
                              ></i>
                              {fav}
                            </h4>
                            <h4>
                              {episodes || switch_item !== "character" ? (
                                <span>
                                  <i
                                    style={{ marginRight: "10px" }}
                                    className="fas fa-tv"
                                  ></i>
                                  {episodes || "??"}
                                </span>
                              ) : (
                                ""
                              )}
                            </h4>
                          </div>
                        </div>
                      </li>
                    </Link>
                  );
                })}
              </>
            );
          })
        ) : (
          <h3 className="empty">Looks pretty empty...</h3>
        )}
        {}
      </ul>

      {data?.pages[0]?.list?.length > 0 && (
        <h5 className="thats-it" ref={ref}>
          {inView && hasNextPage && isFetchingNextPage
            ? "loading..."
            : "Looks like that's it..."}
        </h5>
      )}
      <div style={{ height: "100px" }}></div>
    </>
  );
}
