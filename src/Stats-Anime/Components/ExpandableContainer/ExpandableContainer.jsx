import react, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

export const ExpandableContainer = react.memo(({ data, path }) => {
  const [, setWindowsize] = useState(0);
  const [btnstate, setbtnState] = useState(false);
  const showMorebtn_handle = useRef();
  const inner_character_container_handler = useRef();
  const main_container = useRef();
  const [height, setHeight] = useState("270px");

  //*determine the container height for the characetr/roles section
  const rolesContainerSize = react.useCallback(() => {
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
  }, [inner_character_container_handler.current?.scrollHeight]);

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
      const height = main_container.current.scrollHeight + 40;
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
        className="characters-container"
        style={{ height: height }}
        ref={main_container}
      >
        <div
          className="characters-container-inner"
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
              }) => {
                const itemName = name || title;

                return (
                  <Link
                    to={path ? path + `/${mal_id}` : ``}
                    className="cards"
                    key={mal_id}
                  >
                    {image_url ? <img src={image_url} alt="" /> : ""}

                    <div className="details-char">
                      <h5
                        style={
                          title
                            ? {
                                padding: "1em 0",
                              }
                            : null
                        }
                      >
                        {itemName}
                      </h5>
                      {(role || language) && <h5>{role || language}</h5>}
                    </div>
                  </Link>
                );
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
      </div>
      <div className="empty-for-no-reason"></div>
    </>
  );
});
