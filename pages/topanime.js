import React from "react";
import {
  useQueries,
  useQueryClient,
  QueryClient,
  dehydrate,
} from "react-query";
import axios from "axios";

import { StyledListCarousel } from "Components/Top/StyledListCarousel";
import { StyledMainHeader } from "Components/Top/StyledMainHeader";
import { StyledSection } from "Components/Top/StyledSection";
import { PageNotFound } from "Components/Global/PageNotFound/PageNotFound";
import { Spinner } from "Components/Global/LoadingSpinner";
import { DifferentGenres } from "Components/Top/TopAnime/DifferentGenres";
import { jikanQueries } from "JikanQueries";
import topStyle from "Style/Top/top.module.scss";

//* --- custom hook for fetching top anime/character from the user list

function TopAnime() {
  const client = useQueryClient();
  const token =
    typeof localStorage !== "undefined" && localStorage.getItem("token");
  const user = client.getQueryData(["user", token]);

  const results = useQueries([
    {
      queryKey: "upcoming_anime",
      queryFn: () => jikanQueries("top_anime", "upcoming", 1, 20),
      retry: false,
      refetchOnWindowFocus: false,
    },
    {
      queryKey: "popular_anime",
      queryFn: () => jikanQueries("top_anime", "bypopularity", 1, 20),
      retry: false,
      refetchOnWindowFocus: false,
    },
    {
      queryKey: "airing_anime",
      queryFn: () => jikanQueries("top_anime", "airing", 1, 20),
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
        <div className={topStyle["container-topsection"]}>
          <div className={topStyle["section-1"]}>
            <StyledMainHeader
              content={{
                text: ["AnIme", "WORLD"],
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
          </div>
          <div className={topStyle["section-2"]}>
            <StyledSection
              data={results[0].data}
              switch_details={"anime"}
              text_={"Top Upcoming"}
              className="airing upcoming"
            />
          </div>
          <div className={topStyle["section-3"]}>
            <StyledSection
              data={results[1].data}
              switch_details={"anime"}
              text_={"Most Popular"}
              className="airing popular"
            />
          </div>
          <div className={topStyle["section-4"]}>
            {/* {!results.some((item) => item.isLoading) ? (
              <StyledListCarousel
                text_={"Top anime from your list"}
                switch_details={"anime"}
                userId={user?.userID}
              />
            ) : (
              ""
            )} */}
          </div>
          <section className={topStyle["section-5"]}>
            <DifferentGenres />
          </section>
        </div>
      )}
    </>
  );
}

export async function getStaticProps({ params }) {
  const client = new QueryClient();
  try {
    await client.prefetchQuery("upcoming_anime", () =>
      jikanQueries("top_anime", "upcoming", 1, 20)
    );
    await client.prefetchQuery("popular_anime", () =>
      jikanQueries("top_anime", "bypopularity", 1, 20)
    );
    await client.prefetchQuery("airing_anime", () =>
      jikanQueries("top_anime", "airing", 1, 20)
    );
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

export default TopAnime;
