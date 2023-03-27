import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { useList } from "Hooks/useList";
import { CoreList } from "Components/UserList/CoreList";
import { useAuth } from "Feature/Authorize/Authorize";
import { Container } from "Style/EmotionComponents";
import { ironOptions } from "lib/IronOption";
import { withIronSessionSsr } from "iron-session/next";
import { CustomHead } from "Components/Global/CustomHead";

function AnimeList({ userID, user }) {
    const [whatToSortBy, setWhatToSortBy] = useState("");
    const [orderBy, setOrderBy] = useState("");

    const animeList = useList("anime", userID, 6, whatToSortBy, orderBy);

    //* if there is something to sortBy then refetch the query again
    useEffect(() => {
        animeList.refetch();
    }, [whatToSortBy, orderBy]);

    return (
        <>
            <CustomHead
                description={`Anime list of ${user.name}`}
                url={`/u/${userID}/list/anime`}
                contentTitle={`Anime list | ${user.name} | Downlist`}
            />
            <Container>
                <CoreList
                    clientData={user}
                    switch_item={"anime"}
                    userID={userID}
                    setWhatToSortBy={setWhatToSortBy}
                    setOrderBy={setOrderBy}
                    orderBy={orderBy}
                    whatToSortBy={whatToSortBy}
                    {...animeList}
                />
            </Container>
        </>
    );
}

export const getServerSideProps = withIronSessionSsr(
    async ({ params, req }) => {
        const { userID } = params;

        if (!req.session.user)
            return {
                redirect: "/userauth",
            };

        return {
            props: {
                user: req.session.user,
                userID,
            },
        };
    },
    ironOptions
);

export default AnimeList;
