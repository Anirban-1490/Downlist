import axios from "axios";
import { path } from "../server-path";
import { useInfiniteQuery } from "react-query";

export function useList(
    switch_item,
    userID,
    limit,
    sortBy = undefined,
    enabled = true
) {
    async function fetchUserList({ pageParam = 0 }) {
        if (switch_item === "character")
            return (
                await axios.get(
                    `${
                        path.domain
                    }user/${userID}/list/character?cursor=${pageParam}${
                        limit ? `&limit=${limit}` : ``
                    }${sortBy ? `&sortby=${sortBy}` : ``}`
                )
            ).data;

        return (
            await axios.get(
                `${path.domain}user/${userID}/list/anime?cursor=${pageParam}${
                    limit ? `&limit=${limit}` : ``
                }${sortBy ? `&sortby=${sortBy}` : ``}`
            )
        ).data;
    }

    const {
        data,
        isLoading,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
        refetch,
    } = useInfiniteQuery(
        switch_item === "anime" ? "userAnimeList" : "userCharList",

        fetchUserList,
        {
            getNextPageParam: (lastPage) => {
                // console.log(lastPage);
                return lastPage.nextPage ?? undefined;
            },
            refetchOnWindowFocus: false,
            staleTime: 0,
            cacheTime: 0,
            enabled: !!enabled,
        }
    );

    return {
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        isLoading,
        refetch,
    };
}
