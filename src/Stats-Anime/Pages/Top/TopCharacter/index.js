import React from "react";
import { StyledListCarousel } from "../Components/StyledListCarousel";
import { useQueries, useQueryClient } from "react-query";
import axios from "axios";
import reduce from "awaity/reduce";
import { Spinner } from "../../../Components/LoadingSpinner/index";
import { useToplist } from "../Hooks/useTopList";
import { PageNotFound } from "../../../Components/PageNotFound/PageNotFound";
import { StyledSection } from "../Components/StyledSection";
import { StyledMainHeader } from "../Components/StyledMainHeader";

export function TopacharMain() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const client = useQueryClient();
  const token = localStorage.getItem("token");
  const user = client.getQueryData(["user", token]);
  console.log(user?.userID);
  let tempyear = year;
  if (month < 6) {
    tempyear = year - 1;
  }
  if (month < 9) {
    tempyear = year - 1;
  }

  const fetchQuery = (url) => {
    return axios.get(url).then(({ data: { data } }) => {
      return [...data].slice(0, 16);
    });
  };

  //* handler for fetching summer/fall top characters as API dosen't provide
  const fetch_broad_request = async (url_init) => {
    //*delay between each request
    const delay = (ms = 4000) => new Promise((r) => setTimeout(r, ms));

    return await axios
      .get(url_init)
      .then(({ data: { data } }) => [...data].slice(0, 4))
      .then((result_summer) => [...result_summer].slice(0, 4))
      .then(async (summer_anime) => {
        return await reduce(
          summer_anime,
          async (acc, anime) => {
            const { mal_id } = anime;
            await delay();
            const value_charater_stuff = await axios
              .get(`https://api.jikan.moe/v4/anime/${mal_id}/characters`)
              .then(({ data: { data } }) => {
                const anime_char_sum = [...data];
                return anime_char_sum; //*return all summer character from sumer anime
              })
              .then((res_char_summer) => {
                return res_char_summer.reduce((acc, char) => {
                  const { role } = char;
                  const { mal_id, name, images } = char.character;

                  //* return only the main character from summer/fall
                  return role === "Main"
                    ? [...acc, { mal_id, title: name, images }]
                    : acc;
                }, []);
              })
              .catch((err) => console.log(err));

            if (value_charater_stuff) {
              acc.push(value_charater_stuff);
            }

            return acc;
          },
          []
        );
      })
      .then((result) => result);
  };

  const results = useQueries([
    {
      queryKey: "top_char",
      queryFn: () => fetchQuery("https://api.jikan.moe/v4/top/characters"),
      refetchOnWindowFocus: false,
      staleTime: 4000,
      cacheTime: Infinity,
      retry: false,
    },
    {
      queryKey: "summer_top_char",
      queryFn: () =>
        fetch_broad_request(
          `https://api.jikan.moe/v4/seasons/${tempyear}/summer`
        ),
      refetchOnWindowFocus: false,
      retryDelay: 2000,
      staleTime: 4000,
      cacheTime: Infinity,
      select: (prevValue) => Array.prototype.concat.apply([], prevValue),
    },
    {
      queryKey: "fall_top_char",
      queryFn: () =>
        fetch_broad_request(
          `https://api.jikan.moe/v4/seasons/${tempyear}/fall`
        ),
      refetchOnWindowFocus: false,
      retry: 12,
      retryDelay: 2000,
      staleTime: 4000,
      cacheTime: Infinity,
      select: (prevValue) => Array.prototype.concat.apply([], prevValue),
    },
  ]);

  console.log(results);
  const [listitem, listcount] = useToplist("character");

  return (
    <>
      {results.some((item) => item.isLoading) || listitem.length < listcount ? (
        <Spinner />
      ) : results.some((item) => item.isError) ? (
        <PageNotFound />
      ) : (
        <div className="container-topsection">
          <div className="section-1">
            <StyledMainHeader
              content={{
                text: ["Character", "", "", "VERSE"],
                isanimateable: false,
                subtext: "Just LOOK at Them...",
              }}
            />
            {!results[0].isLoading ? (
              <StyledSection
                data={results[0].data}
                switch_details={"/character"}
                text_={"Most popular"}
                className="airing"
              />
            ) : (
              ""
            )}
            <div className="cotntext-1">
              <span>
                <h2>Stars of the</h2>
              </span>
              <span>
                <h2>Summer</h2>
              </span>
            </div>
          </div>
          <div className="section-2">
            {!results[1].isLoading ? (
              <StyledSection
                data={results[1].data}
                switch_details={"/character"}
                text_={"Popular in Summer"}
                className="airing upcoming"
              />
            ) : (
              ""
            )}

            <div className="cotntext-2">
              <span>
                <h2>Meet the</h2>
              </span>
              <span>
                <h2>popular</h2>
              </span>
              <span>
                <h2>Kids</h2>
              </span>
            </div>
          </div>
          <div className="section-3">
            {!results[2].isLoading ? (
              <StyledSection
                data={results[2].data}
                switch_details={"/character"}
                text_={"Popular in Fall"}
                className="airing popular"
              />
            ) : (
              ""
            )}
            <div className="cotntext-3">
              <span>
                <h2>What's On Your</h2>
              </span>
              <span>
                <h2>Inventory?</h2>
              </span>
            </div>
          </div>
          <div className="section-4">
            {results.every((item) => !item.isLoading) ? (
              <StyledListCarousel
                text_={"Top characters from your list"}
                switch_details={"character"}
                userId={user?.userID}
              />
            ) : (
              ""
            )}
          </div>
        </div>
      )}
      {results.some((item) => item.isLoading) || listitem.length < listcount
        ? ""
        : ""}
    </>
  );
}
