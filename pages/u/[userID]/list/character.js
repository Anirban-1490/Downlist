import { CoreList } from "Components/UserList/CoreList";
import { useAuth } from "Feature/Authorize/Authorize";
import { useList } from "Hooks/useList";
import { useState } from "react";
import { Container } from "Style/EmotionComponents";

function CharactersList({ userID }) {
    const [whatToSortBy, setWhatToSortBy] = useState(undefined);

    const [userData, _] = useAuth(true);

    const returnedPackage = useList("character", userID, 6, whatToSortBy);
    return (
        <>
            <Container>
                <CoreList
                    clientData={userData}
                    switch_item={"character"}
                    userID={userID}
                    setWhatToSortBy={setWhatToSortBy}
                    {...returnedPackage}
                />
            </Container>
        </>
    );
}

export async function getServerSideProps({ params }) {
    const { userID } = params;

    return {
        props: { userID },
    };
}

export default CharactersList;
