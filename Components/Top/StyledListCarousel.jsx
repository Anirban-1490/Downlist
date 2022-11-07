import { Spinner } from "Components/Global/LoadingSpinner";
import { useToplist } from "Hooks/useTopList";
import Link from "next/link";
import react, { useRef, useEffect, useState } from "react";

export const StyledListCarousel = react.memo((prop) => {
  const { text_, switch_details, userId } = prop;
  const handle_container = useRef();
  const [listitem, listCount] = useToplist(switch_details, userId);

  const [currnum, setCurrnum] = useState(0);
  const [offset, setoffset] = useState(0);
  const [innerwidth, setInnerwidth] = useState();
  const [trigger_comp, setTriggercomp] = useState(true);
  const [textanime, setTextanime] = useState(false);
  const [windowwidth, setWindowwidth] = useState(window.innerWidth);

  const getinnerwidth = () => {
    setInnerwidth(handle_container.current.clientWidth);

    if (windowwidth < 650) {
      setTriggercomp(true);
    } else {
      setTriggercomp(false);
    }
  };

  //--- This will only run whenever the window size changes and using useCallback prevents unnecessary chind renders
  //---- previously without this setCurrnum or setTextanime was triggering unnecessary state render for setTriggercomp which should only happen when we change the windowsize
  // ----this function is here to to remove/add the extra detail section for the shown top from list

  const windowSizeBreakpoint = react.useCallback(() => {
    if (window.innerWidth < 650) {
      setTriggercomp(true);
    } else {
      setTriggercomp(false);
    }
  }, [windowwidth]);

  useEffect(() => {
    const size = () => {
      if (listitem.length > 0) {
        setInnerwidth(handle_container.current.clientWidth);
        handle_container.current.style.transition = "none";
        windowSizeBreakpoint();
        setWindowwidth(window.innerWidth);
      }
    };
    window.addEventListener("resize", size);

    //switch to current visable slide
    let num = currnum;
    change(num);
    return () => window.removeEventListener("resize", size);
  });

  //* next button
  const gonext = () => {
    handle_container.current.style.transition = "0.4s ease-in";
    let num = currnum;
    if (num === listitem.length - 1) {
      num = 0;
      setCurrnum(num);
      setoffset(0);
      return;
    }
    setCurrnum(num + 1);

    change(num + 1);
  };

  //* previous button
  const goprev = () => {
    handle_container.current.style.transition = "0.4s ease-in";
    let num = currnum;
    if (num <= 0) {
      num = listitem.length - 1;
      setCurrnum(num);

      setoffset(-(innerwidth + 20) * (num - 1));
      return;
    }
    setCurrnum(num - 1);

    change(num - 1);
  };

  //move the slides
  function change(num) {
    setoffset(-(innerwidth + 20) * num);
  }

  const textanimation_enter = () => {
    setTextanime(true);
  };
  const textanimation_leave = () => {
    setTextanime(false);
  };

  return (
    <>
      <h2 className="top-list-header">{text_}</h2>

      <div
        className="main-list-container"
        style={{
          border: listitem.length > 0 ? "none" : "2px solid #f4f4f452",
        }}
      >
        {listitem.length === 0 && listitem.length !== listCount ? (
          <Spinner />
        ) : listitem.length > 0 && listitem.length === listCount ? (
          <div className="top-list">
            <button type="button" className="prev-btn" onClick={goprev}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <button type="button" className="next-btn" onClick={gonext}>
              <i className="fas fa-chevron-right"></i>
            </button>
            <div className="top-list-inner">
              <div
                className="top-list-item-container"
                ref={handle_container}
                onLoad={getinnerwidth}
                style={{ left: `${offset}px`, transition: "none" }}
              >
                {listitem.map((item) => {
                  const { malid, img_url, about, title } = item;
                  return (
                    <div className="list-item" key={malid}>
                      <img src={img_url} alt="" />
                      {trigger_comp === false ? (
                        <div className="info">
                          <h2>{title}</h2>
                          <p>
                            {about
                              ? about.length > 125
                                ? about.substr(0, 125) + "..."
                                : about
                              : "No Information"}
                          </p>
                          <Link
                            to={
                              switch_details ? switch_details + `/${malid}` : ""
                            }
                            className="btn-seemore"
                          >
                            <div className="inner-div">
                              <span>
                                <i className="fas fa-chevron-right"></i>
                              </span>
                              <span>See more</span>
                            </div>
                          </Link>
                        </div>
                      ) : (
                        <div
                          className="info-sc"
                          onMouseEnter={textanimation_enter}
                          onMouseLeave={textanimation_leave}
                        >
                          <h3
                            className="list-heading-sc"
                            style={
                              textanime
                                ? { transform: "translateX(0)" }
                                : { transform: "translateX(-120%)" }
                            }
                          >
                            {title.length > 35
                              ? title.substr(0, 34) + "..."
                              : title}
                          </h3>
                          <p
                            className="list-para-sc"
                            style={
                              textanime
                                ? { transform: "translateX(0)" }
                                : { transform: "translateX(-120%)" }
                            }
                          >
                            {about
                              ? about.length > 75
                                ? about.substr(0, 75) + "..."
                                : about
                              : "No Information"}
                          </p>
                          <Link
                            to={
                              switch_details ? switch_details + `/${malid}` : ""
                            }
                            className="btn-seemore-sc"
                            style={textanime ? { top: "0" } : { top: "25%" }}
                          >
                            See more
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <h4 className="no-item">Looks pretty empty...</h4>
        )}
      </div>
    </>
  );
});
