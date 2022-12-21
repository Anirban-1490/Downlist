import React, { useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "react-query";
import { useList } from "Hooks/useList";
import { CoreList } from "Components/UserList/CoreList";
import { useAuth } from "Feature/Authorize/Authorize";

function AnimeList({ header, switch_item, userID }) {
    // const { userID } = useParams();
    const router = useRouter();

    console.log(userID);
    const [whatToSortBy, setWhatToSortBy] = useState(undefined);

    // const client = useQueryClient();
    // const clientData = client.getQueryData(["user", token]);
    const [userData, _] = useAuth(true);

    const returnedPackage = useList("anime", userID, whatToSortBy);

    //* --if user not logged in then redirect to login page
    // if (!userData?.userID) {
    //     router.replace("/userauth");
    // }
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
                        header={header}
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
    console.log(userID);
    // const client = new QueryClient();
    // try {
    //   if (Number(malid) !== NaN) {
    //     await client.prefetchQuery(["char_details", malid], () =>
    //       jikanQueries("char_details", malid)
    //     );
    //   }
    // } catch (error) {
    //   return {
    //     notFound: true,
    //   };
    // }

    return {
        props: { userID },
    };
}

export default AnimeList;
