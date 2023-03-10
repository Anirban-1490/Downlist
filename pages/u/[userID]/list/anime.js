import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { useList } from "Hooks/useList";
import { CoreList } from "Components/UserList/CoreList";
import { useAuth } from "Feature/Authorize/Authorize";
import { Container } from "Style/EmotionComponents";
import { ironOptions } from "lib/IronOption";
import { withIronSessionSsr } from "iron-session/next";

function AnimeList({ userID, user }) {
    const [whatToSortBy, setWhatToSortBy] = useState(undefined);

    const returnedPackage = useList("anime", userID, 6, whatToSortBy);

    //* --if user not logged in then redirect to login page

    return (
        <>
            <Container>
                <CoreList
                    clientData={user}
                    switch_item={"anime"}
                    userID={userID}
                    setWhatToSortBy={setWhatToSortBy}
                    {...returnedPackage}
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
