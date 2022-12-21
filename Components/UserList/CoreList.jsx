import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { path } from "server-path";
import Link from "next/link";
import { Dropdown } from "Components/Global/DropDownSelectMenu/DropDownSelectMenu";
import ListStyle from "Components/UserList/Styles/List.module.css";
import { StatsBadge } from "Components/Global/StatsBadge/StatsBadge";
export function CoreList(props) {
    const {
        header,
        switch_item,
        data,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        userID,
        setWhatToSortBy,
        refetch,
        clientData,
    } = props;

    const containerRef = useRef();

    const { ref, inView } = useInView({ threshold: 0 });

    const [stat, setStat] = useState("");
    //* sorting by options
    const options = [
        { genre_id: 1, name: "Favourite", _name: "fav" },
        switch_item !== "character"
            ? { genre_id: 2, name: "Score", _name: "score" }
            : {},
    ];

    //*sort by which ?

    useEffect(() => {
        //* if the sort parameter is set , then first update the state and then refetch the query
        (async () => {
            await setWhatToSortBy(stat);
            await refetch({
                refetchPage: (lastPage, index, allPages) => {
                    return true;
                },
            });
        })();
    }, [stat]);

    useEffect(() => {
        if (inView && data?.pages[data?.pages.length - 1]?.list?.length > 0) {
            fetchNextPage();
        }
    }, [inView]);

    return (
        <>
            <h2 className={ListStyle["header"]}>
                {`${clientData?.name.split(" ")[0]}'s ${switch_item} List`}
            </h2>
            <div className={ListStyle["option-container"]}></div>

            <ul
                className={ListStyle["search-container"]}
                style={
                    data?.pages?.[0]?.list
                        ? { border: "none" }
                        : { border: "2.7px solid #8080804a" }
                }
                ref={containerRef}>
                {data?.pages[0]?.list?.length > 0 ? (
                    data?.pages?.map((page) => {
                        return (
                            <>
                                {page?.list?.map((item) => {
                                    const {
                                        favorites,
                                        malid,
                                        episodes,
                                        img_url,
                                        score,
                                        title,
                                    } = item;

                                    return (
                                        <Link
                                            href={`/${switch_item}/${malid}`}
                                            key={malid}>
                                            <a
                                                className={
                                                    ListStyle["items-container"]
                                                }>
                                                <div
                                                    className={
                                                        ListStyle[
                                                            "img-container"
                                                        ]
                                                    }>
                                                    <img src={img_url} alt="" />
                                                </div>
                                                <div
                                                    className={
                                                        ListStyle["details"]
                                                    }>
                                                    <div
                                                        className={
                                                            ListStyle["title"]
                                                        }>
                                                        <h4>
                                                            {title?.length > 35
                                                                ? title.substr(
                                                                      0,
                                                                      35
                                                                  ) + "..."
                                                                : title}
                                                        </h4>
                                                    </div>
                                                    <div
                                                        className={
                                                            ListStyle["stats"]
                                                        }>
                                                        <div
                                                            className={
                                                                ListStyle[
                                                                    "score"
                                                                ]
                                                            }>
                                                            <h4>
                                                                {score && score}
                                                            </h4>
                                                        </div>
                                                        <div
                                                            className={
                                                                ListStyle[
                                                                    "favorites"
                                                                ]
                                                            }>
                                                            {favorites && (
                                                                <StatsBadge
                                                                    content={
                                                                        favorites
                                                                    }
                                                                    badgeIcon="star"
                                                                    badgeIconStyle={{
                                                                        color: "yellow",
                                                                    }}
                                                                    badgeStyle={{
                                                                        backgroundColor:
                                                                            "transparent",
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                        <div
                                                            className={
                                                                ListStyle[
                                                                    "episodes"
                                                                ]
                                                            }>
                                                            {episodes && (
                                                                <StatsBadge
                                                                    content={
                                                                        episodes
                                                                    }
                                                                    badgeIcon="tv-outline"
                                                                    badgeStyle={{
                                                                        backgroundColor:
                                                                            "transparent",
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </a>
                                        </Link>
                                    );
                                })}
                            </>
                        );
                    })
                ) : (
                    <h3 className="empty">Looks pretty empty...</h3>
                )}
                {}
            </ul>

            {data?.pages[0]?.list?.length > 0 && (
                <h5 className="thats-it" ref={ref}>
                    {inView && hasNextPage && isFetchingNextPage
                        ? "loading..."
                        : "Looks like that's it..."}
                </h5>
            )}
            <div style={{ height: "100px" }}></div>
        </>
    );
}
