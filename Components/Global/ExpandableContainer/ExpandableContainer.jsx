import react, { useEffect, useState, useRef } from "react";
import { Card } from "../Card/Card";
import { Spinner } from "../LoadingSpinner";
import containerStyle from "Components/Global/ExpandableContainer/contianer.module.scss";

export const ExpandableContainer = react.memo(({ data, path, observerRef }) => {
  const [, setWindowsize] = useState(0);
  const [btnstate, setbtnState] = useState(false);
  const showMorebtn_handle = useRef();
  const inner_character_container_handler = useRef();

  const [height, setHeight] = useState("270px");

  //*determine the container height for the characetr/roles section
  const rolesContainerSize = react.useCallback(() => {
    if (data) {
      if (inner_character_container_handler.current.scrollHeight < 250) {
        setHeight("270px");
        showMorebtn_handle.current.style.display = "none";
      } else if (
        inner_character_container_handler.current.scrollHeight > 200 &&
        inner_character_container_handler.current.scrollHeight < 500
      ) {
        setHeight("34em");
        showMorebtn_handle.current.style.display = "none";
      } else if (inner_character_container_handler.current.scrollHeight > 490) {
        setHeight("34em");
        showMorebtn_handle.current.style.display = "block";
      }
    }
  }, [inner_character_container_handler.current?.scrollHeight, data]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowsize(window.innerWidth);
    });

    rolesContainerSize(); //*whenever window size changes check for the container size

    return () =>
      window.removeEventListener("resize", () => {
        setWindowsize(window.innerWidth);
      });
  }, [rolesContainerSize, setWindowsize]);

  //*handler for "see more" button
  function handle_container(e) {
    if (!btnstate) {
      //* gets the innercontent height
      const height =
        inner_character_container_handler.current.scrollHeight + 40;
      e.target.style.boxShadow = "none";
      setbtnState(true);
      setHeight(height + "px");
    } else {
      setHeight("34em");
      setbtnState(false);
      e.target.style.boxShadow = "0 0 36px 20px black";
    }
  }

  return (
    <>
      <div
        className={containerStyle["exp-container"]}
        style={{ height: height }}
        ref={observerRef}
      >
        {data == undefined ? (
          <Spinner />
        ) : (
          <>
            <div
              className={containerStyle["exp-inner-container"]}
              ref={inner_character_container_handler}
            >
              {data &&
                data.map(
                  ({
                    name,
                    mal_id,
                    images: {
                      jpg: { image_url },
                    },
                    role,
                    language,
                    title,
                    type,
                  }) => {
                    const mainTitle = name || title;
                    const subTitle = role || language;
                    const animeType = type || "";
                    const props = {
                      mal_id,
                      path,
                      image_url,
                      mainTitle,
                      subTitle,
                      animeType,
                      key: mal_id,
                    };

                    return <Card {...props} />;
                  }
                )}
            </div>
            <button
              type="button"
              ref={showMorebtn_handle}
              onClick={handle_container}
            >
              {btnstate ? "Show less" : "Show more"}
            </button>
          </>
        )}
      </div>
      <div className={containerStyle["empty-for-no-reason"]}></div>
    </>
  );
});
