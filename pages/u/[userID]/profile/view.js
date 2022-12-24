import { useState, useEffect, useContext, useRef } from "react";
import { useQueryClient } from "react-query";

import axios from "axios";

//* timeago

import { useWindowResize } from "Hooks/useWindowResize";
import { Appcontext } from "context";
import { Spinner } from "Components/Global/LoadingSpinner";
import { path } from "server-path";
import { useProfile } from "Hooks/useProfile";
import { MainProfile } from "Components/Profile/Profile";
import { PageNotFound } from "Components/Global/PageNotFound/PageNotFound";
import { Activity } from "Components/Profile/Activity";

const MainUserProfile = ({ userID }) => {
    const refForm = useRef();
    const windowsize = useWindowResize();

    // const { changeEditState } = useContext(Appcontext);

    const [userProfileDetails, isError] = useProfile(path, userID);

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

    if (isError) {
        return <PageNotFound />;
    }

    return (
        <>
            {!userProfileDetails ? (
                <Spinner />
            ) : (
                <MainProfile
                    {...userProfileDetails.user}
                    userID={userID}
                    isCurrentUsersProfile={true}>
                    <Activity
                        windowSize={windowsize}
                        activity={userProfileDetails.user.activity}
                    />
                </MainProfile>
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

    return {
        props: { userID },
    };
}

export default MainUserProfile;
