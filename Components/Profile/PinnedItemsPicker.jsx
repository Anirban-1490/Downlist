import pinnedStyle from "Components/Profile/Style/PinnedItemsPicker.module.scss";
import { useList } from "Hooks/useList";
import React, { useMemo, forwardRef, useEffect, useState } from "react";
import axios from "axios";

import { path } from "server-path";
import { useQuery, QueryClient, useMutation } from "react-query";
import { NoItem } from "Components/Global/NoItemFound/NoItemFound";
import { getRandomID } from "Feature/RandomID";
import { CircularSpinner } from "Components/Global/CircularSpinner";
import { useInView } from "react-intersection-observer";

export const PinneditemsPicker = ({ setPins, userID, pinnedItems }) => {
    const { ref, inView } = useInView({ threshold: 0 });
    const {
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        refetch,
        isError,
        error: listItemsError,
    } = useList("anime", userID, 10, undefined);

    const {
        data: pinnedItemsStatus,
        mutate,
        error: pinnedItemsError,
        isError: isErrorForPinnedItems,
        isLoading,
    } = useMutation(
        ["pinItems"],
        (newItemsToBePinned) =>
            axios.put(`${path.domain}user/${userID}/profile/add/pinned`, {
                newItemsToBePinned,
            }),
        {
            retry: 1,
            onSuccess: () => {
                window.location.reload();
            },
        }
    );

    if (hasNextPage && inView) {
        fetchNextPage();
    }

    const pinnedItemsHandler = async (e) => {
        e.preventDefault();
        const formHandler = new FormData(e.target);
        const newItemsToBePinned = ![...formHandler].length
            ? []
            : [...formHandler].reduce((acc, currentItem) => {
                  return [...acc, currentItem[1]];
              }, []);
        mutate(newItemsToBePinned);
    };

    return (
        <>
            <div className={pinnedStyle["background"]}>
                <div className={pinnedStyle["items-container"]}>
                    <div className={pinnedStyle["header-container"]}>
                        <h5>Pin Items</h5>
                        <ion-icon
                            name="close-outline"
                            onClick={() => setPins(false)}></ion-icon>
                    </div>
                    <form onSubmit={pinnedItemsHandler}>
                        <ul>
                            {(!data || !data.pages?.length) && <NoItem />}
                            {data?.pages[0]?.list?.length > 0 &&
                                data?.pages?.map((page) => {
                                    return (
                                        <React.Fragment
                                            key={() => getRandomID()}>
                                            {page?.list?.map(
                                                ({ malid, title }) => {
                                                    return (
                                                        <li key={malid}>
                                                            <input
                                                                type="checkbox"
                                                                name="pinned_anime"
                                                                id={`anime_${malid}`}
                                                                value={malid}
                                                                defaultChecked={[
                                                                    ...pinnedItems,
                                                                ].includes(
                                                                    malid + ""
                                                                )}
                                                            />
                                                            <label
                                                                htmlFor={`anime_${malid}`}>
                                                                <strong>
                                                                    {title}
                                                                </strong>
                                                            </label>
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </React.Fragment>
                                    );
                                })}

                            <div
                                ref={ref}
                                className={pinnedStyle["loading-text"]}>
                                <CircularSpinner enabled={!!hasNextPage} />
                            </div>
                        </ul>

                        <div className={pinnedStyle["submit-btn-container"]}>
                            <div
                                className={pinnedStyle["response-text"]}
                                style={{
                                    color: isErrorForPinnedItems
                                        ? "red"
                                        : "#11aa11",
                                }}>
                                {!isLoading &&
                                    (pinnedItemsStatus?.data.message ||
                                        pinnedItemsError?.response.data
                                            .message)}
                            </div>
                            <button
                                type="submit"
                                disabled={!data || !data.pages?.length}>
                                {isLoading ? "Loading..." : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
