import { CoreList } from "Components/UserList/CoreList";
import { useAuth } from "Feature/Authorize/Authorize";
import { useList } from "Hooks/useList";
import { useEffect, useState } from "react";
import { Container } from "Style/EmotionComponents";
import { ironOptions } from "lib/IronOption";
import { withIronSessionSsr } from "iron-session/next";
import { CustomHead } from "Components/Global/CustomHead";

function CharactersList({ userID, user }) {
    const [whatToSortBy, setWhatToSortBy] = useState("");
    const [orderBy, setOrderBy] = useState("");

    const characterList = useList(
        "character",
        userID,
        6,
        whatToSortBy,
        orderBy
    );

    useEffect(() => {
        characterList.refetch();
    }, [whatToSortBy, orderBy]);

    return (
        <>
            <CustomHead
                description={`Character list of ${user.name}`}
                url={`/u/${userID}/list/character`}
                contentTitle={`Character list | ${user.name} | Downlist`}
            />
            <Container>
                <CoreList
                    clientData={user}
                    switch_item={"character"}
                    userID={userID}
                    setWhatToSortBy={setWhatToSortBy}
                    setOrderBy={setOrderBy}
                    orderBy={orderBy}
                    whatToSortBy={whatToSortBy}
                    {...characterList}
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

export default CharactersList;
