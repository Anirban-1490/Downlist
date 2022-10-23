import React from "react";
import { StyledListCarousel } from "../Components/StyledListCarousel";
import { useQueries, useQueryClient } from "react-query";
import axios from "axios";
import reduce from "awaity/reduce";
import { Spinner } from "../../../Components/LoadingSpinner/index";
import { PageNotFound } from "../../../Components/PageNotFound/PageNotFound";
import { StyledSection } from "../Components/StyledSection";
import { StyledMainHeader } from "../Components/StyledMainHeader";

export function TopacharMain() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const client = useQueryClient();
  const token = localStorage.getItem("token");
  const user = client.getQueryData(["user", token]);
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
  const fetchPopularCharacterBasedOnSeason = async (url) => {
    //*delay between each request
    const delay = (ms = 4000) => new Promise((r) => setTimeout(r, ms));

    const seasonalAnime = (await axios.get(url)).data?.data.slice(0, 4);

    return Promise.resolve(
      reduce(
        seasonalAnime,
        async (acc, anime) => {
          const { mal_id } = anime;

          //* delay before starting this request
          await delay();

          //* get all characters of this anime
          const charactersOfAnime = (
            await axios.get(
              `https://api.jikan.moe/v4/anime/${mal_id}/characters`
            )
          ).data?.data;

          //* array of only main roled characters
          const mainCharacters = await reduce(
            charactersOfAnime,
            async (accumulatedCharacters, { role, character }) => {
              const { mal_id, name, images } = character;

              //* if the character is a Main roled then put it in the accumulated array

              if (role === "Main")
                return [
                  ...accumulatedCharacters,
                  { mal_id, title: name, images },
                ];
              return accumulatedCharacters;
            },
            []
          );

          //* if the main roled characters array is not empty then put it in the accumulated array
          if (mainCharacters.length > 0) {
            acc.push(mainCharacters);
          }
          return acc;
        },
        []
      )
    );
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
        fetchPopularCharacterBasedOnSeason(
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
        fetchPopularCharacterBasedOnSeason(
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

  return (
    <>
      {results.some((item) => item.isLoading) ? (
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
    </>
  );
}
