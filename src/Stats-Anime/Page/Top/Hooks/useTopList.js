import { useList } from "../../../../../Hooks/useList";
import { useRef, useCallback, useState, useLayoutEffect } from "react";
import each from "awaity/each";
import axios from "axios";

export function useToplist(switch_item, userID) {
  const [listitem, setListitem] = useState([]);
  const [listCount, setListcount] = useState(0);

  //* get users saved anime or character list
  let { data } = useList(switch_item, userID, "fav");

  let userList = data?.pages?.[0].list;
  //* this is used so that the data don't get lost at a rerender
  const listData = useRef();

  const delay = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

  const fetchTopItemFromList = useCallback(async () => {
    if (userList) {
      //*sort the data based on score or favorite
      listData.current = userList
        .sort((a, b) => (a.score ? b.score - a.score : b.fav - a.fav))
        .slice(0, 3);
      setListcount(listData.current?.length);
      let temparray = [];

      await each(listData.current, async (item) => {
        //*for each entry fetching some additional details from the API
        const { malid, img_url, title } = item;

        const response = await axios(
          `https://api.jikan.moe/v3/${switch_item}/${malid}`
        );
        const result = await response.data;
        temparray = [
          ...temparray,
          {
            malid,
            img_url,
            title,
            about: switch_item === "anime" ? result.synopsis : result.about,
          },
        ];

        await delay();
      });

      setListitem(temparray);
    }
  }, [userList, switch_item]);

  useLayoutEffect(() => {
    fetchTopItemFromList();
  }, [fetchTopItemFromList]);
  return [listitem, listCount];
}
