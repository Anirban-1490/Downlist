import pinnedStyle from "Components/Profile/Style/PinnedItemsPicker.module.scss";
import { useList } from "Hooks/useList";
import { useMemo, forwardRef, useEffect, useState } from "react";
import axios from "axios";

import { path } from "server-path";
import { useQuery, QueryClient } from "react-query";

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
        const [status, setStatus] = useState("");
        const queryClient = new QueryClient();
        useEffect(() => {
            if (hasNextPage && inView) {
                fetchNextPage();
            }
        }, [inView]);

        const isFetching = status == "sending";
        const isError = status !== "Successfully pinned items";

        const pinnedItemsHandler = async (e) => {
            setStatus("sending");
            e.preventDefault();
            const formHandler = new FormData(e.target);
            const newItemsToBePinned = ![...formHandler].length
                ? []
                : [...formHandler].reduce((acc, currentItem) => {
                      return [...acc, currentItem[1]];
                  }, []);

            try {
                const { data } = await queryClient.fetchQuery(
                    ["pinItems"],
                    () =>
                        axios.put(
                            `${path.domain}user/${userID}/profile/add/pinned`,
                            {
                                newItemsToBePinned,
                            }
                        ),
                    { staleTime: 100, cacheTime: 0, retry: 1 }
                );

                if (data) {
                    setStatus(data.message);
                    window.location.reload();
                }
            } catch (error) {
                setStatus(error.response.data.message);
            }
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
                                                                      defaultChecked={[
                                                                          ...pinnedItems,
                                                                      ].find(
                                                                          (
                                                                              item
                                                                          ) =>
                                                                              item.mal_id ==
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
                                    {!isFetching && status}
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
