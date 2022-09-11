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
      setHeight("530px");
      showMorebtn_handle.current.style.display = "none";
    } else if (inner_character_container_handler.current.scrollHeight > 490) {
      setHeight("530px");
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
  function handle_container() {
    if (!btnstate) {
      //* gets the innercontent height
      const height = main_container.current.scrollHeight;
      main_container.current.style.height = height + "px";
      main_container.current.style.transition = "0.35s";
      setbtnState(true);
    } else {
      main_container.current.style.height = "530px";
      setbtnState(false);
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
                    <div>
                      <div className="img-container">
                        {image_url ? <img src={image_url} alt="" /> : ""}
                      </div>
                      <div className="details-char">
                        <h5
                          style={
                            title
                              ? {
                                  fontSize: "0.8em",
                                  padding: "0 2%",
                                  textAlign: "center",
                                }
                              : null
                          }
                        >
                          {itemName.length <= 37
                            ? itemName
                            : itemName.substr(0, 37) + "..."}
                        </h5>
                        {(role || language) && <h5>{role || language}</h5>}
                      </div>
                    </div>
                  </Link>
                );
              }
            )}
        </div>
        <button
          type="button"
          ref={showMorebtn_handle}
          onClick={() => handle_container()}
        >
          {btnstate ? "Show less" : "Show more"}
        </button>
      </div>
      <div className="empty-for-no-reason"></div>
    </>
  );
});
