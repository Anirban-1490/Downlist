import pinnedStyle from "Components/Profile/Style/PinnedItemsPicker.module.scss";
import { useList } from "Hooks/useList";
import { useMemo, forwardRef, useEffect, useState } from "react";
import axios from "axios";

import { path } from "server-path";
import { useQuery } from "react-query";

export const PinneditemsPicker = forwardRef(
    (
        {
            setPins,
            data,
            hasNextPage,
            isFetchingNextPage,
            fetchNextPage,
            refetch,
            userID,
            inView,
            pinnedItems,
        },
        ref
    ) => {
        const [items, setItems] = useState([]);

        useEffect(() => {
            if (hasNextPage && inView) {
                fetchNextPage();
            }
        }, [inView]);

        const {
            data: response,
            isError,
            isLoading,
            error,
            isFetching,
        } = useQuery(
            "pinItems",
            () => {
                return axios.put(
                    `${path.domain}user/${userID}/profile/add/pinned`,
                    { items }
                );
            },
            {
                refetchOnWindowFocus: false,
                enabled: items.length > 0,
                onSettled: (data, err) => {
                    setItems([]);
                    if (!err) {
                        window.location.reload();
                    }
                },
                retry: 0,
                staleTime: 0,
                cacheTime: 0,
            }
        );

        const pinnedItemsHandler = async (e) => {
            e.preventDefault();
            const formHandler = new FormData(e.target);
            const newItemsToBePinned = [...formHandler].reduce(
                (acc, currentItem) => {
                    return [...acc, currentItem[1]];
                },
                []
            );

            setItems([...newItemsToBePinned]);
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
                                {data?.pages[0]?.list?.length > 0
                                    ? data?.pages?.map((page) => {
                                          return (
                                              <>
                                                  {page?.list?.map(
                                                      ({ malid, title }) => {
                                                          return (
                                                              <li key={malid}>
                                                                  <input
                                                                      type="checkbox"
                                                                      name="pinned_anime"
                                                                      id={`anime_${malid}`}
                                                                      value={
                                                                          malid
                                                                      }
                                                                      defaultChecked={pinnedItems.includes(
                                                                          malid
                                                                      )}
                                                                  />
                                                                  <label
                                                                      htmlFor={`anime_${malid}`}>
                                                                      <strong>
                                                                          {
                                                                              title
                                                                          }
                                                                      </strong>
                                                                  </label>
                                                              </li>
                                                          );
                                                      }
                                                  )}
                                              </>
                                          );
                                      })
                                    : ""}
                                {hasNextPage && (
                                    <div
                                        ref={ref}
                                        className={pinnedStyle["loading-text"]}>
                                        Loading...
                                    </div>
                                )}
                            </ul>

                            <div
                                className={pinnedStyle["submit-btn-container"]}>
                                <div
                                    className={pinnedStyle["response-text"]}
                                    style={{
                                        color: isError ? "red" : "#11aa11",
                                    }}>
                                    {!isError
                                        ? response?.data.message
                                        : error.response.data.message}
                                </div>
                                <button type="submit">
                                    {isFetching ? "Loading..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        );
    }
);
