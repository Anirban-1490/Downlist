import { useRef, useEffect, useCallback, useState } from "react";
import { useQueryClient } from "react-query";
import dropdownStyle from "Components/Global/DropDownSelectMenu/DropDown.module.scss";

export const Dropdown = (prop) => {
  const { options, setID, placeholder, stats_anime } = prop;
  const [isDropDownActive, setDropDownActive] = useState(false);
  const client = useQueryClient();
  const displayCurrentOptionRef = useRef();

  const dropDownToggle = (e) => {
    setDropDownActive(true);
  };

  //* when moving to diff page(from anime list -> char list) this will clear out the set key value for sorting the lists
  const clrDrop = useCallback(() => {
    if (stats_anime) {
      setID("");
      displayCurrentOptionRef.current.value = null;
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

    displayCurrentOptionRef.current.value = name;
    setDropDownActive(false);
  };

  return (
    <div
      className={`${dropdownStyle["wrapper-input"]} ${
        isDropDownActive && dropdownStyle["active"]
      }`}
    >
      <ion-icon name="chevron-down-outline"></ion-icon>
      <input
        className={dropdownStyle["genre-display"]}
        placeholder={placeholder}
        type="text"
        name=""
        readOnly
        onClick={dropDownToggle}
        ref={displayCurrentOptionRef}
      />
      <div
        className={`${dropdownStyle.option} ${
          isDropDownActive && dropdownStyle["active"]
        }`}
      >
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
