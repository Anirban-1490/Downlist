import axios from "axios";
import { useState, useMemo } from "react";
import profileStyle from "Components/Profile/Style/Profile.module.scss";
import { Card } from "Components/Global/Card/Card";
import {
    NoItem,
    NoItemContiner,
} from "Components/Global/NoItemFound/NoItemFound";
import { SkeletonLoaderMulti } from "Components/Global/SkeletionLoader/SkeletionLoaderMulti";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { serverlessPath } from "Serverlesspath";
import { getUserToken } from "GetuserToken";
import { useRouter } from "next/router";

export const MainProfile = ({
    name,
    image,
    bio,
    followers,
    following,
    loggedInUserID,

    isCurrentUsersProfile,
    children,
    setPins,
    pinnedItemsDetails,
    isError,
    error,
    isLoading,
    refetch,
    _id: userToFollow_UserID,
}) => {
    const { push } = useRouter();
    const queryClient = useQueryClient();
    const isFollowing = !isCurrentUsersProfile
        ? following.includes(userToFollow_UserID)
        : null;

    const followQuery = useMutation(
        ({ visitorID, userToFollow_UserID }) => {
            return axios.put(`${path.domain}/u/follow`, {
                visitorID,
                userToFollow_UserID,
            });
        },
        {
            onSettled: (data, error) => {
                queryClient.invalidateQueries(["user", getUserToken()]);
            },
        }
    );

    async function followHandler(e, visitorID, userToFollow_UserID) {
        e.preventDefault();

        if (!visitorID) {
            push("/userauth");
        }

        try {
            mutate({ visitorID, userToFollow_UserID });
            // const isFollowerinArray = response?.find(
            //     (followerID) => followerID === userToFollow_UserID
            // )
            //     ? true
            //     : false;
            // setFollow(isFollowerinArray);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className={profileStyle["container-profile"]}>
                <div className={profileStyle["inner-profile-container"]}>
                    <div className={profileStyle["personal-info-container"]}>
                        <div className={profileStyle["profile-img-container"]}>
                            <img src={image} alt="" />
                        </div>

                        <h2 className={profileStyle["name"]}>{name}</h2>
                        {bio && <h4 className={profileStyle["bio"]}>{bio}</h4>}
                        <div className={profileStyle["follow-container"]}>
                            <h5 className={profileStyle["follow"]}>
                                {followers?.length} Followers
                            </h5>
                            <h5 className={profileStyle["follow"]}>
                                {following?.length} Following
                            </h5>
                        </div>
                        {!isCurrentUsersProfile && (
                            <button
                                aria-label={`${
                                    isFollowing ? "unfollow" : "follow"
                                }`}
                                data-following={`${
                                    isFollowing ? "true" : "false"
                                }`}
                                className={profileStyle["follow-btn"]}
                                onClick={function (e) {
                                    followHandler.call(
                                        this,
                                        e,
                                        loggedInUserID,
                                        userToFollow_UserID
                                    );
                                }.bind(this)}>
                                {isFollowing ? "Following" : "Follow"}
                            </button>
                        )}
                    </div>
                    <div className={profileStyle["picks-container"]}>
                        <h4>Top Picks</h4>
                        {isCurrentUsersProfile && (
                            <button
                                className={profileStyle["add-picks-btn"]}
                                onClick={() => setPins(true)}>
                                add your picks
                            </button>
                        )}
                        <div className={profileStyle["picks-container-inner"]}>
                            {isLoading && <SkeletonLoaderMulti />}

                            {isError && (
                                <NoItem
                                    content={error.response.data.message}
                                    refetchFn={refetch}
                                    isForError={isError}
                                />
                            )}
                            {(!pinnedItemsDetails ||
                                !pinnedItemsDetails?.length) &&
                                !isError &&
                                !isLoading && (
                                    <NoItem
                                        content={
                                            "pinned items will be shown here"
                                        }
                                    />
                                )}

                            {!isLoading &&
                                pinnedItemsDetails?.length > 0 &&
                                pinnedItemsDetails.map(
                                    ({
                                        image_url,
                                        mal_id,
                                        title,
                                        title_english,
                                    }) => {
                                        const props = {
                                            mal_id,
                                            image_url,
                                            mainTitle: title || title_english,
                                            path: "/anime",
                                        };
                                        return <Card {...props} />;
                                    }
                                )}
                        </div>
                    </div>
                    {isCurrentUsersProfile && (
                        <div>
                            <h2
                                className={
                                    profileStyle["activity-header-text"]
                                }>
                                Recent Activity
                            </h2>
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
