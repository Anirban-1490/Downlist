import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import { path } from "server-path";
import Link from "next/link";
import { Dropdown } from "Components/Global/DropDownSelectMenu/DropDownSelectMenu";
import ListStyle from "Components/UserList/Styles/List.module.scss";
import { StatsBadge } from "Components/Global/StatsBadge/StatsBadge";
import { NoItem } from "Components/Global/NoItemFound/NoItemFound";
import { CircularSpinner } from "Components/Global/CircularSpinner";
import { CustomButton } from "Components/Global/CustomButton/CustomButton";
import { useQueryClient } from "react-query";
import { AnyIcons } from "Components/Global/AnyIcons/AnyIcons";

export function CoreList(props) {
    const {
        switch_item,
        data: dataFromUserList,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        userID,
        setWhatToSortBy,
        refetch,
        clientData,
        isError,
        error,
        isLoading,
        setOrderBy,
        orderBy,
        whatToSortBy,
    } = props;

    const { ref, inView } = useInView({ threshold: 0 });

    useEffect(() => {
        if (
            inView &&
            dataFromUserList?.pages[dataFromUserList?.pages.length - 1]?.list
                ?.length > 0
        ) {
            fetchNextPage();
        }
    }, [inView]);

    const statsHeaders = [
        { children: "Score", attrValue: "score", title: "Score" },
        { children: "Favourites", attrValue: "favorites", title: "Favourites" },
        { children: "Episodes", attrValue: "episodes", title: "Episodes" },
    ];

    const sortHandler = async (e) => {
        const sortBy = e.target.dataset["sort_by"];

        setWhatToSortBy((prev) => sortBy);
        if (!orderBy || orderBy === "asc") setOrderBy(() => "dsc");
        else setOrderBy(() => "asc");
    };

    return (
        <>
            <h2 className={ListStyle["header"]}>
                {`${clientData?.name.split(" ")[0]}'s ${switch_item} List`}
            </h2>
            <div className={ListStyle["row-header"]}>
                <div className={ListStyle["column-header"]}>Name</div>
                <div className={ListStyle["stats-header-container"]}>
                    {statsHeaders.map((header, index) => {
                        const isHeaderClicked =
                            whatToSortBy === header.attrValue;
                        const arrowIcon = isHeaderClicked ? (
                            orderBy === "asc" ? (
                                <AnyIcons badgeIcon={"arrow-down-outline"} />
                            ) : (
                                <AnyIcons badgeIcon={"arrow-up-outline"} />
                            )
                        ) : null;

                        if (
                            switch_item === "character" &&
                            header.title !== "Favourites"
                        )
                            return;

                        return (
                            <div
                                key={index}
                                className={ListStyle["column-stats-header"]}>
                                <CustomButton
                                    id={header.title}
                                    title={header.title}
                                    onClick={sortHandler}
                                    dataAttrKey={"sort_by"}
                                    dataAttrValue={header.attrValue}
                                    className={ListStyle["header-btn"]}>
                                    <>
                                        {header.children}
                                        {arrowIcon}
                                    </>
                                </CustomButton>
                            </div>
                        );
                    })}
                </div>
            </div>
            <ul
                className={ListStyle["list-container"]}
                style={
                    !dataFromUserList?.pages[0]?.list?.length
                        ? {
                              justifyContent: "center",
                          }
                        : {}
                }>
                <CircularSpinner enabled={isLoading} />
                {isError && (
                    <NoItem
                        refetchFn={refetch}
                        isForError={true}
                        content={error.response.data.message}
                    />
                )}
                {(!dataFromUserList || !dataFromUserList?.pages.length) &&
                    !isError &&
                    !isLoading && <NoItem />}
                {dataFromUserList?.pages[0]?.list?.length > 0 &&
                    dataFromUserList?.pages?.map((page) => {
                        return (
                            <div
                                className={ListStyle["groups"]}
                                key={page.nextPage}>
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
                                                aria-label={title}
                                                title={title}
                                                className={
                                                    ListStyle["items-container"]
                                                }>
                                                <div
                                                    className={
                                                        ListStyle[
                                                            "img-container"
                                                        ]
                                                    }>
                                                    <img
                                                        src={img_url}
                                                        alt={title}
                                                    />
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
                            </div>
                        );
                    })}
                {}
            </ul>

            {dataFromUserList?.pages[0]?.list?.length > 0 && (
                <div className={ListStyle["thats-it"]} ref={ref}>
                    {inView && hasNextPage && isFetchingNextPage ? (
                        <CircularSpinner enabled={hasNextPage} />
                    ) : (
                        "Looks like that's it..."
                    )}
                </div>
            )}
            <div style={{ height: "100px" }}></div>
        </>
    );
}
