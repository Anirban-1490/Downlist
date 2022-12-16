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
import { TopFromlist } from "Components/Top/TopFromList";
import { useAuth } from "Feature/Authorize/Authorize";

//* --- custom hook for fetching top anime/character from the user list

function TopAnime() {
    const client = useQueryClient();
    const [userData, _] = useAuth(true);
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
                    <StyledMainHeader
                        content={{
                            text: ["AnIme", "WORLD"],
                            isanimateable: true,
                            subtext: "it's anime EVERYWHERE...",
                        }}
                    />
                    <div
                        className={`${topStyle["section"]} ${topStyle["section-1"]}`}>
                        <StyledSection
                            data={results[2].data}
                            switch_details={"anime"}
                            text_={"Top Airing"}
                            headerColor={"#9579f0"}
                            subHeadingText={"Latest toppers"}
                        />
                        <div
                            className={`${topStyle["anime-character"]} ${topStyle["character-1"]}`}>
                            <img src={"/AnimeCharacter1.png"} alt="" />
                        </div>
                        <div
                            className={`${topStyle["custom-shape-divider-bottom-1668163489"]} ${topStyle["custom-shape-divider"]}`}>
                            <svg
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 1200 120"
                                preserveAspectRatio="none">
                                <path
                                    d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                                    className={topStyle["shape-path-1"]}></path>
                            </svg>
                        </div>
                    </div>
                    <div
                        className={`${topStyle["section"]} ${topStyle["section-2"]}`}>
                        <StyledSection
                            data={results[0].data}
                            switch_details={"anime"}
                            text_={"Top Upcoming"}
                            headerColor={"#d9a3ee"}
                            subHeadingText={"Something to look forward too"}
                        />
                        <div
                            className={`${topStyle["custom-shape-divider-bottom-1668170175"]} ${topStyle["custom-shape-divider"]}`}>
                            <svg
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 1200 120"
                                preserveAspectRatio="none">
                                <path
                                    d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                                    className={topStyle["shape-path-2"]}></path>
                            </svg>
                        </div>
                        <div
                            className={`${topStyle["anime-character"]} ${topStyle["character-2"]}`}>
                            <img src={"/AnimeCharacter2.png"} alt="" />
                        </div>
                    </div>
                    <div
                        className={`${topStyle["section"]} ${topStyle["section-3"]}`}>
                        <StyledSection
                            data={results[1].data}
                            switch_details={"anime"}
                            text_={"Most Popular"}
                            headerColor={"#ec95bb"}
                            subHeadingText={"All time favorites"}
                        />
                    </div>
                    <div
                        className={`${topStyle["section"]} ${topStyle["section-5"]}`}>
                        <h2 className={topStyle["main-heading"]}>
                            From your inventory
                        </h2>
                    </div>
                    <div
                        className={`${topStyle["section"]} ${topStyle["section-6"]}`}>
                        <TopFromlist
                            switchLists={"anime"}
                            userId={userData?.userID}
                        />
                    </div>
                    <section
                        className={`${topStyle["section"]} ${topStyle["section-7"]}`}>
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
