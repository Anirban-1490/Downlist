import axios from "axios";
import { AnimeGenre } from "Components/AnimeContent/AnimeGenre";
import { CustomHead } from "Components/Global/CustomHead";
import { getAllGenres } from "genres";
import { jikanQueries } from "JikanQueries";
import { useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { QueryClient, useInfiniteQuery } from "react-query";

function PopularAnime({ initialData, headerContent, sort, orderBy }) {
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
        ["all_top_character"],
        async ({ pageParam = 2 }) => {
            return (
                await axios.get(
                    `https://api.jikan.moe/v4/characters?order_by=favorites&sort=${sort}&page=${pageParam}`
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
                url={`character/top`}
                contentTitle={`${headerContent.toUpperCase()} Characters | Downlist`}
            />
            <AnimeGenre
                ref={ref}
                headerContent={headerContent}
                isCharacters={true}
                data={modifiedData}
                hasNextPage={hasNextPage || modifiedData[0].data.length > 0}
            />
        </>
    );
}

export async function getServerSideProps({ params, query }) {
    const queryClient = new QueryClient();

    try {
        const orderBy = query?.order_by || null;
        const sort = query?.sort || "desc";

        const { pages, pageParams } = await queryClient.fetchInfiniteQuery(
            ["all_top_character"],
            async ({ pageParam = 1 }) => {
                return (
                    await axios.get(
                        `https://api.jikan.moe/v4/characters?order_by=favorites&sort=${sort}&page=${pageParam}`
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
                headerContent: `top characters`,

                sort,
            },
        };
    } catch (error) {
        return {
            notFound: true,
        };
    }
}

export default PopularAnime;
