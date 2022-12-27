import pinnedStyle from "Components/Profile/Style/PinnedItemsPicker.module.scss";
import { useList } from "Hooks/useList";
import { useMemo, forwardRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export const PinneditemsPicker = forwardRef(
    (
        {
            setPins,
            data,
            hasNextPage,
            isFetchingNextPage,
            fetchNextPage,
            refetch,

            inView,
        },
        ref
    ) => {
        useEffect(() => {
            console.log(inView);
            if (hasNextPage && inView) {
                fetchNextPage();
            }
        }, [inView]);

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
                    </div>
                </div>
            </>
        );
    }
);
