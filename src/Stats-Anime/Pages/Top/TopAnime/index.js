import React from "react";
import "../Styles/topanimestyle.css";
import { DifferentGenres } from "./Components/DifferentGenres";
import { useQueries, useQueryClient } from "react-query";
import axios from "axios";
import { Spinner } from "../../../Components/LoadingSpinner";

import { PageNotFound } from "../../../Components/PageNotFound/PageNotFound";
import { StyledSection } from "../Components/StyledSection";
import { StyledMainHeader } from "../Components/StyledMainHeader";

import { StyledListCarousel } from "../Components/StyledListCarousel";

//* --- custom hook for fetching top anime/character from the user list

export function TopAnimeMain() {
  const client = useQueryClient();
  const token = localStorage.getItem("token");
  const user = client.getQueryData(["user", token]);
  const delay = (ms = 3000) => new Promise((r) => setTimeout(r, ms));
  const fetchQuery = async (url) => {
    await delay();
    return axios.get(url).then(({ data: { data } }) => [...data].slice(0, 16));
  };

  const results = useQueries([
    {
      queryKey: "upcoming_anime",
      queryFn: () =>
        fetchQuery("https://api.jikan.moe/v4/top/anime?filter=upcoming&page=1"),
      retry: false,
      refetchOnWindowFocus: false,
    },
    {
      queryKey: "popular_anime",
      queryFn: () =>
        fetchQuery(
          "https://api.jikan.moe/v4/top/anime?filter=bypopularity&page=1"
        ),
      retry: false,
      refetchOnWindowFocus: false,
    },
    {
      queryKey: "airing_anime",
      queryFn: () =>
        fetchQuery("https://api.jikan.moe/v4/top/anime?filter=airing&page=1"),
      retry: false,
      refetchOnWindowFocus: false,
    },
  ]);

  return (
    <>
      {results.some((item) => item.isFetching) ? (
        <Spinner />
      ) : results.some((item) => item.isError) ? (
        <PageNotFound />
      ) : (
        <div className="container-topsection">
          <div className="section-1">
            <StyledMainHeader
              content={{
                text: ["An", "l", "me", "WORLD"],
                isanimateable: true,
                subtext: "it's anime EVERYWHERE...",
              }}
            />
            <StyledSection
              data={results[2].data}
              switch_details={"anime"}
              text_={"Top Airing"}
              className="airing"
            />
            <div className="cotntext-1">
              <span>
                <h2>See the</h2>
              </span>
              <span>
                <h2>upcomings</h2>
              </span>
            </div>
          </div>
          <div className="section-2">
            <StyledSection
              data={results[0].data}
              switch_details={"anime"}
              text_={"Top Upcoming"}
              className="airing upcoming"
            />
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
            <StyledSection
              data={results[1].data}
              switch_details={"anime"}
              text_={"Most Popular"}
              className="airing popular"
            />
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
            {!results.some((item) => item.isLoading) ? (
              <StyledListCarousel
                text_={"Top anime from your list"}
                switch_details={"anime"}
                userId={user?.userID}
              />
            ) : (
              ""
            )}
          </div>
          <section className="section-5">
            <DifferentGenres />
          </section>
        </div>
      )}
    </>
  );
}
