import axios from "axios";
import { AnimeGenre } from "Components/AnimeContent/AnimeGenre";
import { CustomHead } from "Components/Global/CustomHead";
import { getAllGenres } from "genres";
import { jikanQueries } from "JikanQueries";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { QueryClient, useInfiniteQuery } from "react-query";

function AnimeContent({
    rawGenre,
    initialData,
    headerContent,
    genreId,
    sort,
    orderBy,
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
        "anime_by_genres",
        async ({ pageParam = 2 }) => {
            return (
                await axios.get(
                    `https://api.jikan.moe/v4/anime?genres=${genreId}&page=${pageParam}&order_by=${orderBy}&sort=${sort}&sfw=true`
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
                description={`Huge library of ${headerContent} anime`}
                url={`anime/content?genre=${rawGenre}`}
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
    const genres = getAllGenres();
    const queryClient = new QueryClient();

    try {
        if (!genres.has(query.genre)) {
            throw new Error("unknown genre");
        }
        const genreId = genres.get(query.genre);
        const orderBy = query?.order_by || null;
        const sort = query?.sort || null;

        const { pages, pageParams } = await queryClient.fetchInfiniteQuery(
            "anime_by_genres",
            async ({ pageParam = 1 }) => {
                return (
                    await axios.get(
                        `https://api.jikan.moe/v4/anime?genres=${genreId}&page=${pageParam}&order_by=${orderBy}&sort=${sort}&sfw=true`
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
                headerContent: query.genre.split("_").join(" "),
                genreId,
                orderBy,
                sort,
                rawGenre: query.genre,
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}

export default AnimeContent;
