import React from "react";
import {
  useQueries,
  useQueryClient,
  QueryClient,
  dehydrate,
  useQuery,
} from "react-query";
import axios from "axios";

import { StyledMainHeader } from "Components/Top/StyledMainHeader";
import { StyledSection } from "Components/Top/StyledSection";
import { PageNotFound } from "Components/Global/PageNotFound/PageNotFound";
import { Spinner } from "Components/Global/LoadingSpinner";

import { jikanQueries } from "JikanQueries";
import topStyle from "Style/Top/top.module.scss";
import { TopFromlist } from "Components/Top/TopFromList";

function TopCharcter() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  let tempyear = year;
  if (month < 6) {
    tempyear = year - 1;
  }
  if (month < 9) {
    tempyear = year - 1;
  }
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

  const { data, isFetching } = useQuery(
    "top_char",
    () => jikanQueries("top_char"),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <>
      {results.some((item) => item.isFetching) || isFetching ? (
        <Spinner />
      ) : (
        <div className={topStyle["container-topsection"]}>
          <StyledMainHeader
            content={{
              text: ["Character", "VERSE"],
              isanimateable: false,
              subtext: "great ones...",
            }}
          />
          <div className={`${topStyle["section"]} ${topStyle["section-1"]}`}>
            <StyledSection
              data={data}
              switch_details={"character"}
              text_={"Top Characters"}
              headerColor={"#9579f0"}
              subHeadingText={"All time favourites"}
            />
            <div
              className={`${topStyle["anime-character"]} ${topStyle["character-1"]}`}
            >
              <img src={"/AnimeCharacter1.png"} alt="" />
            </div>
            <div
              className={`${topStyle["custom-shape-divider-bottom-1668163489"]} ${topStyle["custom-shape-divider"]}`}
            >
              <svg
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                  className={topStyle["shape-path-1"]}
                ></path>
              </svg>
            </div>
          </div>
          <div className={`${topStyle["section"]} ${topStyle["section-2"]}`}>
            <StyledSection
              data={results[0].data}
              switch_details={"character"}
              text_={"Top Upcoming"}
              headerColor={"#d9a3ee"}
              subHeadingText={"Something to look forward too"}
            />
            <div
              className={`${topStyle["custom-shape-divider-bottom-1668170175"]} ${topStyle["custom-shape-divider"]}`}
            >
              <svg
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                  className={topStyle["shape-path-2"]}
                ></path>
              </svg>
            </div>
            <div
              className={`${topStyle["anime-character"]} ${topStyle["character-2"]}`}
            >
              <img src={"/AnimeCharacter2.png"} alt="" />
            </div>
          </div>
          <div className={`${topStyle["section"]} ${topStyle["section-3"]}`}>
            <StyledSection
              data={results[1].data}
              switch_details={"character"}
              text_={"Most Popular"}
              headerColor={"#ec95bb"}
              subHeadingText={"All time favorites"}
            />
            <div
              className={`${topStyle["custom-shape-divider-bottom-1668509441"]} ${topStyle["custom-shape-divider"]}`}
            >
              <svg
                data-name="Layer 1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M598.97 114.72L0 0 0 120 1200 120 1200 0 598.97 114.72z"
                  className={topStyle["shape-path-3"]}
                ></path>
              </svg>
            </div>
          </div>
          <div className={`${topStyle["section"]} ${topStyle["section-4"]}`}>
            <TopFromlist />
          </div>
        </div>
      )}
    </>
  );
}

export async function getStaticProps({ params }) {
  const client = new QueryClient();
  try {
    await client.prefetchQuery("top_char", () => jikanQueries("top_char"));
    // await client.prefetchQuery("popular_anime", () =>
    //   jikanQueries("top_anime", "bypopularity", 1, 20)
    // );
    // await client.prefetchQuery("airing_anime", () =>
    //   jikanQueries("top_anime", "airing", 1, 20)
    // );
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: { dehydratedState: dehydrate(client) },
    revalidate: 20,
  };
}
export default TopCharcter;
