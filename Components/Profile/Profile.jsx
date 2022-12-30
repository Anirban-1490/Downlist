import axios from "axios";
import { useState, useMemo } from "react";
import profileStyle from "Components/Profile/Style/Profile.module.scss";
import { Card } from "Components/Global/Card/Card";
import { NoItem } from "Components/Global/NoItemFound/NoItemFound";

export const MainProfile = ({
    name,
    image,
    bio,
    followers,
    following,
    pinnedItems,
    status,
    userToFollowUserID,
    userID,
    isCurrentUsersProfile,
    children,
    setPins,
}) => {
    // const { userData } = useContext(Appcontext);

    const [isFollowing, setFollow] = useState(undefined);

    useMemo(() => {
        if (followers?.length && userID && !isCurrentUsersProfile) {
            setFollow(
                followers?.find((followerID) => followerID === userID)
                    ? true
                    : false
            );
        }
    }, [followers, userID]);

    async function followHandler(e, visitorID, userToFollowUserID) {
        e.preventDefault();

        try {
            const response = await (
                await axios.put(`${path.domain}/u/follow`, {
                    visitorID,
                    userToFollowUserID,
                })
            ).data;

            const isFollowerinArray = response?.find(
                (followerID) => followerID === userToFollowUserID
            )
                ? true
                : false;
            setFollow(isFollowerinArray);
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
                                className={
                                    isFollowing
                                        ? profileStyle["follow-btn following"]
                                        : profileStyle["follow-btn"]
                                }
                                onClick={function (e) {
                                    followHandler.call(
                                        this,
                                        e,
                                        userID,
                                        userToFollowUserID
                                    );
                                }.bind(this)}>
                                {isFollowing ? "Following" : "Follow"}
                            </button>
                        )}
                    </div>
                    <div className={profileStyle["picks-container"]}>
                        <h4>Top Picks</h4>
                        <button
                            className={profileStyle["add-picks-btn"]}
                            onClick={() => setPins(true)}>
                            add your picks
                        </button>
                        <div className={profileStyle["picks-container-inner"]}>
                            {pinnedItems.map(
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
                            ) || (
                                <NoItem
                                    content={"pinned items will be shown here"}
                                />
                            )}
                        </div>
                    </div>
                    <h2 className={profileStyle["activity-header-text"]}>
                        Recent Activity
                    </h2>
                    {children}
                </div>
            </div>
        </>
    );
};
