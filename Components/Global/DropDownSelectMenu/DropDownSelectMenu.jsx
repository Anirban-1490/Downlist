import { useRef, useEffect, useCallback } from "react";
import { useQueryClient } from "react-query";
import dropdownStyle from "./DropDown.module.scss";

export const Dropdown = (prop) => {
  const { options, setID, placeholder, stats_anime } = prop;
  const optionref = useRef();

  const client = useQueryClient();

  const dropDownToggle = () => {
    optionref.current.classList.toggle("active");
    document.querySelector(".wrapper-input").classList.toggle("active");
  };

  //* when moving to diff page(from anime list -> char list) this will clear out the set key value for sorting the lists
  const clrDrop = useCallback(() => {
    if (stats_anime) {
      setID("");
      document.querySelector(".genre-display").value = null;
    }
  }, [stats_anime]);

  useEffect(() => {
    clrDrop();
  }, [clrDrop]);

  const optionClickHandler = async (_name, genre_id, name) => {
    //* if _name is valid meaning if this is a userlist page
    if (_name) setID(_name);
    else {
      //* refetch the query on diffrent genre id
      await client.refetchQueries(["genre", genre_id]);
      setID(genre_id);
    }

    document.querySelector(".genre-display").value = name;
    optionref.current.classList.toggle("active");
    document.querySelector(".wrapper-input").classList.toggle("active");
  };

  return (
    <div className={dropdownStyle["wrapper-input"]}>
      <ion-icon name="chevron-down-outline"></ion-icon>
      <input
        className="genre-display"
        placeholder={placeholder}
        type="text"
        name=""
        readOnly
        onClick={dropDownToggle}
      />
      <div className={dropdownStyle.option} ref={optionref}>
        {options.map((option) => {
          const { genre_id, name, _name } = option;
          return genre_id ? (
            <div
              onClick={optionClickHandler.bind(this, _name, genre_id, name)}
              key={genre_id}
            >
              <h4>{name}</h4>
            </div>
          ) : (
            ""
          );
        })}
      </div>
    </div>
  );
};
