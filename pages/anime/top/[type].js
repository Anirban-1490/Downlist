import axios from "axios";
import { AnimeGenre } from "Components/AnimeContent/AnimeGenre";
import { CustomHead } from "Components/Global/CustomHead";
import { getAllGenres } from "genres";
import { jikanQueries } from "JikanQueries";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { QueryClient, useInfiniteQuery } from "react-query";

function PopularAnime({
    initialData,
    headerContent,
    sort,
    orderBy,
    newTypeForFilter,
    type,
}) {
    const { ref, inView } = useInView();
    let modifiedData = [initialData];

    const {
        data,
        isLoading,
        isError,
        error,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteQuery(
        ["top_anime", newTypeForFilter],
        async ({ pageParam = 2 }) => {
            return (
                await axios.get(
                    `https://api.jikan.moe/v4/top/anime?filter=${newTypeForFilter}&page=${pageParam}&order_by=${orderBy}&sort=${sort}&sfw=true`
                )
            ).data;
        },
        {
            getNextPageParam: (lastPage) => {
                return lastPage?.pagination.has_next_page
                    ? lastPage.pagination.current_page + 1
                    : undefined;
            },
            refetchOnWindowFocus: false,
            retry: 1,
            enabled: !!inView,
        }
    );
    modifiedData = data?.pages
        ? [...modifiedData, ...data?.pages]
        : modifiedData;

    useMemo(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);
    return (
        <>
            <CustomHead
                description={`Check full list of ${headerContent} anime`}
                url={`anime/top/${type}`}
                contentTitle={`${headerContent.toUpperCase()} Anime | Downlist`}
            />
            <AnimeGenre
                ref={ref}
                headerContent={headerContent}
                data={modifiedData}
                hasNextPage={hasNextPage || modifiedData[0].data.length > 0}
            />
        </>
    );
}

export async function getServerSideProps({ params, query }) {
    const { type } = params;
    const types = ["all-time", "upcoming", "airing"];

    const queryClient = new QueryClient();

    try {
        if (!types.includes(type)) throw new Error("invalid url parameter");
        const newTypeForFilter = type === "all-time" ? "bypopularity" : type;
        const orderBy = query?.order_by || null;
        const sort = query?.sort || null;

        const { pages, pageParams } = await queryClient.fetchInfiniteQuery(
            ["top_anime", newTypeForFilter],
            async ({ pageParam = 1 }) => {
                return (
                    await axios.get(
                        `https://api.jikan.moe/v4/top/anime?filter=${newTypeForFilter}&page=${pageParam}&order_by=${orderBy}&sort=${sort}&sfw=true`
                    )
                ).data;
            },
            {
                getNextPageParam: (lastPage) => {
                    return lastPage[0]?.pagination.has_next_page
                        ? lastPage[0].pagination.current_page + 1
                        : undefined;
                },
            }
        );
        // console.log(pageParams);
        return {
            props: {
                initialData: pages[0],
                headerContent: `top ${(type !== "all-time" && type) || " "}`,
                orderBy,
                sort,
                newTypeForFilter,
                type,
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}

export default PopularAnime;
