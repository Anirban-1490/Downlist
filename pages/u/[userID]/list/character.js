import { CoreList } from "Components/UserList/CoreList";
import { useAuth } from "Feature/Authorize/Authorize";
import { useList } from "Hooks/useList";
import { useState } from "react";
import { Container } from "Style/EmotionComponents";
import { ironOptions } from "lib/IronOption";
import { withIronSessionSsr } from "iron-session/next";
function CharactersList({ userID, user }) {
    const [whatToSortBy, setWhatToSortBy] = useState(undefined);

    const returnedPackage = useList("character", userID, 6, whatToSortBy);
    return (
        <>
            <Container>
                <CoreList
                    clientData={user}
                    switch_item={"character"}
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

export default CharactersList;
