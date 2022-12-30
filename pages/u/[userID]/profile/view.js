import { useState, useEffect, useContext, useRef } from "react";
import { QueryClient } from "react-query";

import axios from "axios";
import map from "awaity/map";
//* timeago

import { useWindowResize } from "Hooks/useWindowResize";
import { Appcontext } from "context";
import { Spinner } from "Components/Global/LoadingSpinner";
import { path } from "server-path";
import { useProfile } from "Hooks/useProfile";
import { MainProfile } from "Components/Profile/Profile";
import { PageNotFound } from "Components/Global/PageNotFound/PageNotFound";
import { Activity } from "Components/Profile/Activity";
import { PinneditemsPicker } from "Components/Profile/PinnedItemsPicker";
import { useList } from "Hooks/useList";
import { useInView } from "react-intersection-observer";
import { jikanQueries } from "JikanQueries";

const MainUserProfile = ({ userID, userDetails }) => {
    const refForm = useRef();
    const windowsize = useWindowResize();
    const [showPins, setPins] = useState(false);

    const returnedPackage = useList("anime", userID, 10, undefined, showPins);
    // const [userProfileDetails, isError] = useProfile(path, userID);
    const { ref, inView } = useInView({ threshold: 0 });
    const updateProfile = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        //! use FormData only and don't convert it to a object as doing that will remove the headers provided by formData and the request will not contain the multipart/ file

        try {
            await axios.post(
                `${path.domain}user/${userID}/profile/update`,
                formData
            );
            window.location.reload();
        } catch (error) {
            console.log(error);
            changeEditState(e);
        }
    };

    return (
        <>
            <MainProfile
                {...userDetails}
                userID={userID}
                isCurrentUsersProfile={true}
                setPins={setPins}>
                <Activity
                    windowSize={windowsize}
                    activity={userDetails.activity}
                />
            </MainProfile>

            {showPins && (
                <PinneditemsPicker
                    ref={ref}
                    inView={inView}
                    userID={userID}
                    setPins={setPins}
                    pinnedItems={userDetails.pinnedItems}
                    {...returnedPackage}
                />
            )}
            <div
                className="empty-container"
                style={{ marginTop: "4em", height: "4em" }}></div>
        </>
    );
};

const SideProfile = ({
    windowSize,
    name,
    bio,
    status,
    image,
    view,
    following,
    followers,
}) => {
    const { changeEditState, editState } = useContext(Appcontext);

    return (
        <>
            <aside className="side-profile">
                <div className="img-outer-container">
                    <div className="img-container">
                        <img src={image} alt="" />
                    </div>

                    {editState ? (
                        <div className="img-edit">
                            <label htmlFor="imgFile" id="label-img">
                                <ion-icon name="pencil"></ion-icon>
                            </label>
                            <input type="file" name="img" id="imgFile" hidden />
                        </div>
                    ) : (
                        ""
                    )}
                </div>

                {windowSize < 846 ? (
                    !editState ? (
                        <h2 className="username username-nonedit">{name}</h2>
                    ) : (
                        <input
                            type="text"
                            name="name"
                            id=""
                            className="username username-edit"
                            defaultValue={name}
                            maxLength={18}
                        />
                    )
                ) : (
                    ""
                )}
                <p className="profile-view">Profile View: {view}</p>
                <div className="follower-following-container">
                    <p className="following">{following.length} Following</p>
                    <p className="followers">{followers.length} Followers</p>
                </div>
                {!editState ? (
                    <div className="inner-side-container">
                        {bio && <h4 className="bio"> {bio} </h4>}
                        {status && <h6 className="status">{status}</h6>}
                        <button className="edit" onClick={changeEditState}>
                            Edit profile
                        </button>
                    </div>
                ) : (
                    <div className="inner-side-container">
                        <textarea
                            name="bio"
                            id=""
                            className="bio bio-edit"
                            cols="30"
                            rows="10"
                            maxLength={35}
                            defaultValue={bio}
                            placeholder="Custom bio..."></textarea>
                        <input
                            type="text"
                            name="status"
                            id=""
                            className="status status-edit"
                            placeholder="Custom status..."
                            maxLength={12}
                            defaultValue={status}
                            autoComplete="off"
                        />

                        <button type="submit" className="edit save">
                            Save
                        </button>
                    </div>
                )}

                <button className="settings">Settings</button>
            </aside>
        </>
    );
};

export async function getServerSideProps({ params }) {
    const { userID } = params;
    const queryClient = new QueryClient();
    try {
        const {
            data: { user: userDetails },
        } = await queryClient.fetchQuery(
            ["profile", userID],
            () => axios.get(`${path.domain}user/${userID}/profile/view`),
            { retry: 1 }
        );

        if (!userDetails) {
            return {
                notFound: true,
            };
        }

        const pinedItemsDetail = await map(
            userDetails.pinnedItems,
            async (malIdOfItem) => {
                const {
                    images: {
                        jpg: { image_url },
                    },
                    title,
                    title_english,
                } = await queryClient.fetchQuery(
                    ["anime", malIdOfItem],
                    () => jikanQueries("details", malIdOfItem),
                    { retry: 1 }
                );
                return {
                    image_url,
                    mal_id: malIdOfItem,
                    title,
                    title_english,
                };
            }
        );

        return {
            props: {
                userID,
                userDetails: { ...userDetails, pinnedItems: pinedItemsDetail },
            },
        };
    } catch (error) {
        console.log(error);
        return {
            notFound: true,
        };
    }
}

export default MainUserProfile;
