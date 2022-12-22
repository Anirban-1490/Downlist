import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { useList } from "Hooks/useList";
import { CoreList } from "Components/UserList/CoreList";
import { useAuth } from "Feature/Authorize/Authorize";

function AnimeList({ userID }) {
    const [whatToSortBy, setWhatToSortBy] = useState(undefined);

    const [userData, _] = useAuth(true);

    const returnedPackage = useList("anime", userID, whatToSortBy);

    //* --if user not logged in then redirect to login page

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
                        switch_item={"anime"}
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

export default AnimeList;
