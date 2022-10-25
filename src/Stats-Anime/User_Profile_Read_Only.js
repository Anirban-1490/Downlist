import axios from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { path } from "../../server-path";

import "./User_Profile_Read_Only_Style.css";
import { useState, useMemo, useContext } from "react";
import { Appcontext } from "../../context";

export const ReadOnlyProfileMain = () => {
  const { userID } = useParams();

  const fetchDetails = async () => {
    return (await axios.get(`${path.domain}user/${userID}/profile/view`)).data;
  };

  const { data } = useQuery(["follow", userID], fetchDetails, {
    refetchOnWindowFocus: false,
  });
  return (
    <>
      <ReadOnlyProfile {...data?.user} userToFollowUserID={userID} />
    </>
  );
};

const ReadOnlyProfile = ({
  name,
  image,
  bio,
  followers,
  following,
  top,
  userToFollowUserID,
}) => {
  const { userData } = useContext(Appcontext);

  const [isFollowing, setFollow] = useState(undefined);

  useMemo(() => {
    if (followers && userData?.userID) {
      setFollow(
        followers?.find((followerID) => followerID === userData?.userID)
          ? true
          : false
      );
    }
  }, [followers, userData?.userID]);

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
      <div className="container-profile">
        <div className="img-container">
          <img src={image} alt="" />
        </div>
        <h2 className="name">{name}</h2>
        {bio && <h4 className="bio">{bio}</h4>}
        <div className="follow-container">
          <h5 className="follow">{followers?.length} Followers</h5>
          <h5 className="follow">{following?.length} Following</h5>
        </div>
        <button
          className={isFollowing ? "follow-btn following" : "follow-btn"}
          onClick={function (e) {
            followHandler.call(this, e, userData?.userID, userToFollowUserID);
          }.bind(this)}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>

        <div className="picks-container">
          <h4>Top Picks</h4>
          <div className="picks-container-inner">
            {top || <p>Very muuuuuchhhh empty...</p>}
          </div>
        </div>
      </div>
    </>
  );
};
