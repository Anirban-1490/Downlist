import axios from "axios";
import { useState, useMemo } from "react";
import profileStyle from "Components/Profile/Style/Profile.module.scss";

export const MainProfile = ({
    name,
    image,
    bio,
    followers,
    following,
    top,
    status,
    userToFollowUserID,
    userID,
    isCurrentUsersProfile,
    children,
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
                <div className={profileStyle["img-container"]}>
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

                <div className={profileStyle["picks-container"]}>
                    <h4>Top Picks</h4>
                    <div className={profileStyle["picks-container-inner"]}>
                        {top || <p>Very muuuuuchhhh empty...</p>}
                    </div>
                </div>
                <h2 className={profileStyle["activity-header-text"]}>
                    Recent Activity
                </h2>
                {children}
            </div>
        </>
    );
};
