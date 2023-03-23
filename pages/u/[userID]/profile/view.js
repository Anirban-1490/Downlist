import { useState, useEffect, useContext, useRef } from "react";
import { QueryClient, useQuery } from "react-query";

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

//* dynamically laods the pinneditemspicker as it's condiitonal and needed
//* only when the user clicks the "add your picks" button"
const PinnedItemsPicker = dynamic(
    () =>
        import("Components/Profile/PinnedItemsPicker").then(
            ({ PinneditemsPicker }) => PinneditemsPicker
        ),
    { ssr: false }
);

const MainUserProfile = ({ user: { _id, ...userDetail } }) => {
    const windowsize = useWindowResize();
    const [showPins, setPins] = useState(false);

    const { data, isLoading, isError, error, refetch } = useQuery(
        "pinnedItems",
        async () =>
            await axios.post(`${serverlessPath.domain}api/pins/info`, {
                pinnedItems: userDetail.pinnedItems,
            }),
        { retry: 1, refetchOnWindowFocus: false }
    );

    // const updateProfile = async (e) => {
    //     e.preventDefault();

    //     const formData = new FormData(e.target);

    //     //! use FormData only and don't convert it to a object as doing that will remove the headers provided by formData and the request will not contain the multipart/ file

    //     try {
    //         await axios.post(
    //             `${path.domain}user/${userID}/profile/update`,
    //             formData
    //         );
    //         window.location.reload();
    //     } catch (error) {
    //         console.log(error);
    //         changeEditState(e);
    //     }
    // };

    const propsForMainProfile = {
        ...userDetail,
        loggedInUserID: _id,

        isCurrentUsersProfile: true,
        setPins,
        pinnedItemsDetails: data?.data.pinnedItemsDetails,
        isError,
        error,
        isLoading,
        refetch,
    };
    const propsForPinnedItemsPicker = {
        userID: _id,
        setPins,
        pinnedItems: userDetail.pinnedItems,
    };

    return (
        <>
            <CustomHead
                contentTitle={`${userDetail.name} | Downlist`}
                imageUrl={userDetail.image}
                url={`u/${_id}/profile/view`}
            />

            <MainProfile {...propsForMainProfile}>
                <Activity
                    windowSize={windowsize}
                    activity={userDetail.activity}
                />
            </MainProfile>

            {showPins && <PinnedItemsPicker {...propsForPinnedItemsPicker} />}
        </>
    );
};

// const SideProfile = ({
//     windowSize,
//     name,
//     bio,
//     status,
//     image,
//     view,
//     following,
//     followers,
// }) => {
//     const { changeEditState, editState } = useContext(Appcontext);

//     return (
//         <>
//             <aside className="side-profile">
//                 <div className="img-outer-container">
//                     <div className="img-container">
//                         <img src={image} alt="" />
//                     </div>

//                     {editState ? (
//                         <div className="img-edit">
//                             <label htmlFor="imgFile" id="label-img">
//                                 <ion-icon name="pencil"></ion-icon>
//                             </label>
//                             <input type="file" name="img" id="imgFile" hidden />
//                         </div>
//                     ) : (
//                         ""
//                     )}
//                 </div>

//                 {windowSize < 846 ? (
//                     !editState ? (
//                         <h2 className="username username-nonedit">{name}</h2>
//                     ) : (
//                         <input
//                             type="text"
//                             name="name"
//                             id=""
//                             className="username username-edit"
//                             defaultValue={name}
//                             maxLength={18}
//                         />
//                     )
//                 ) : (
//                     ""
//                 )}
//                 <p className="profile-view">Profile View: {view}</p>
//                 <div className="follower-following-container">
//                     <p className="following">{following.length} Following</p>
//                     <p className="followers">{followers.length} Followers</p>
//                 </div>
//                 {!editState ? (
//                     <div className="inner-side-container">
//                         {bio && <h4 className="bio"> {bio} </h4>}
//                         {status && <h6 className="status">{status}</h6>}
//                         <button className="edit" onClick={changeEditState}>
//                             Edit profile
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="inner-side-container">
//                         <textarea
//                             name="bio"
//                             id=""
//                             className="bio bio-edit"
//                             cols="30"
//                             rows="10"
//                             maxLength={35}
//                             defaultValue={bio}
//                             placeholder="Custom bio..."></textarea>
//                         <input
//                             type="text"
//                             name="status"
//                             id=""
//                             className="status status-edit"
//                             placeholder="Custom status..."
//                             maxLength={12}
//                             defaultValue={status}
//                             autoComplete="off"
//                         />

//                         <button type="submit" className="edit save">
//                             Save
//                         </button>
//                     </div>
//                 )}

//                 <button className="settings">Settings</button>
//             </aside>
//         </>
//     );
// };

export const getServerSideProps = withIronSessionSsr(
    async ({ params, req }) => {
        const { userID } = params;

        if (!req.session.user)
            return {
                redirect: {
                    destination: `/u/${userID}/profile/read-only`,
                    permanent: false,
                },
            };

        return {
            props: {
                user: req.session.user,
                userID,
            },
        };
    },
    ironOptions
);

export default MainUserProfile;
