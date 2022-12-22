import { CoreList } from "Components/UserList/CoreList";
import { useAuth } from "Feature/Authorize/Authorize";
import { useList } from "Hooks/useList";
import { useState } from "react";

function CharactersList({ userID }) {
    const [whatToSortBy, setWhatToSortBy] = useState(undefined);

    const [userData, _] = useAuth(true);

    const returnedPackage = useList("character", userID, whatToSortBy);
    return (
        <>
            <div
                className="container1"
                style={{
                    height: "auto",
                    minHeight: "100vh",
                    zIndex: "1",
                    position: "relative",
                }}>
                {returnedPackage.data !== undefined ? (
                    <CoreList
                        clientData={userData}
                        switch_item={"character"}
                        userID={userID}
                        setWhatToSortBy={setWhatToSortBy}
                        {...returnedPackage}
                    />
                ) : (
                    ""
                )}
            </div>
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
