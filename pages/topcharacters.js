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
// import { reduce } from "awaity/reduce";
import reduce from "awaity/reduce";
import { useAuth } from "Feature/Authorize/Authorize";
import { serverlessPath } from "ServerLesspath";

function TopCharcter({ topCharcters }) {
    const [userData, _] = useAuth(true);

    const results = useQueries([
        {
            queryKey: "summer_top_char",
            queryFn: () =>
                axios.get(`${serverlessPath.domain}api/top/characters/summer`),
            refetchOnWindowFocus: false,
            retryDelay: 2000,
            staleTime: 4000,
            cacheTime: Infinity,
        },
        {
            queryKey: "fall_top_char",
            queryFn: () =>
                axios.get(`${serverlessPath.domain}api/top/characters/fall`),
            refetchOnWindowFocus: false,
            retry: 12,
            retryDelay: 2000,
            staleTime: 4000,
            cacheTime: Infinity,
        },
    ]);

    const topSummerCharacters = results[0].data?.data?.popularCharacters;
    const topFallCharacters = results[1].data?.data?.popularCharacters;

    const istopSummerCharactesGivingError = results[0].isError;
    const istopFallCharactesGivingError = results[1].isError;

    return (
        <>
            <div className={topStyle["container-topsection"]}>
                <StyledMainHeader
                    content={{
                        text: ["Character", "VERSE"],
                        isanimateable: false,
                        subtext: "great ones...",
                    }}
                />
                <div
                    className={`${topStyle["section"]} ${topStyle["section-1"]}`}>
                    <StyledSection
                        data={topCharcters}
                        switch_details={"character"}
                        text_={"Top Characters"}
                        headerColor={"#9579f0"}
                        subHeadingText={"All time favourites"}
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
                        data={topSummerCharacters}
                        switch_details={"character"}
                        text_={"Summer toppers"}
                        headerColor={"#d9a3ee"}
                        subHeadingText={"Top entertainers in this heat"}
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
                        data={topFallCharacters}
                        switch_details={"character"}
                        text_={"Winter Toppers"}
                        headerColor={"#ec95bb"}
                        subHeadingText={"Winter soldiers"}
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
                        switchLists={"character"}
                        userId={userData?.userID}
                    />
                </div>
            </div>
        </>
    );
}

export async function getStaticProps({ params }) {
    const client = new QueryClient();
    try {
        const topCharcters = await client.fetchQuery(
            "top_char",
            () => jikanQueries("top_char"),
            { retry: 1 }
        );
        return {
            props: { topCharcters },
            revalidate: 20,
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}
export default TopCharcter;
