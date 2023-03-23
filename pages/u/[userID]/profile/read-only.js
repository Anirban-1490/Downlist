import { useState, useEffect, useContext, useRef } from "react";
import { QueryClient, useQuery, useQueryClient } from "react-query";

import axios from "axios";

import { useWindowResize } from "Hooks/useWindowResize";
import { path } from "server-path";
import { MainProfile } from "Components/Profile/Profile";
import { Activity } from "Components/Profile/Activity";
import { useList } from "Hooks/useList";
import { serverlessPath } from "Serverlesspath";
import dynamic from "next/dynamic";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "lib/IronOption";
import { CustomHead } from "Components/Global/CustomHead";
import { useProfile } from "Hooks/useProfile";

const ReadOnlyProfile = ({ user, loggedInUser, userToFollow }) => {
    const windowsize = useWindowResize();

    const { data, isLoading, isError, error, refetch } = useQuery(
        ["pinnedItems_for_read_only_profile"],
        async () =>
            await axios.post(`${serverlessPath.domain}api/pins/info`, {
                pinnedItems: userToFollow.pinnedItems,
            }),
        { retry: 1, refetchOnWindowFocus: false }
    );
    const propsForMainProfile = {
        ...userToFollow,
        loggedInUserID: loggedInUser?._id,
        isCurrentUsersProfile: false,

        pinnedItemsDetails: data?.data.pinnedItemsDetails,
        isError,
        error,
        isLoading,
        refetch,
    };

    return (
        <>
            <CustomHead
                contentTitle={`${userToFollow.name} | Downlist`}
                imageUrl={userToFollow.image}
                url={`u/${userToFollow._id}/profile/read-only`}
            />

            <MainProfile {...propsForMainProfile} />
        </>
    );
};

export const getServerSideProps = withIronSessionSsr(
    async ({ params, req }) => {
        const { userID } = params;
        const loggedInUser = req.session.user || null;

        //*if the current logged in use is trying to access read-only
        //* page of him , redirect to the view page again

        if (loggedInUser?._id === userID) {
            return {
                redirect: {
                    destination: `/u/${userID}/profile/view`,
                    permanent: false,
                },
            };
        }

        const queryClient = new QueryClient();
        try {
            const data = await queryClient.fetchQuery(
                ["read_only_profile", userID],
                () => axios.get(`${path.domain}user/${userID}/profile/view`)
            );

            return {
                props: { userToFollow: data.data.user, loggedInUser },
            };
        } catch (error) {
            return {
                notFound: true,
            };
        }
    },
    ironOptions
);
export default ReadOnlyProfile;
