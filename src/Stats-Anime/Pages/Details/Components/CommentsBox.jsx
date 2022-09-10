import react, { useState, useRef } from "react";
import { useQueryClient } from "react-query";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { Link } from "react-router-dom";
import default_img from "../../../logo/default-placeholder.png";
import { useQuery } from "react-query";
import axios from "axios";
import { path } from "../../../../server-path";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export const CommentsBox = react.memo(({ user, malid }) => {
  const [isBtnVisable, btnVisibilityHandler] = useState(false);
  const [likedComments, setLikedCommetns] = useState(user?.likedComments);

  const [dislikedComments, setDislikedComments] = useState(
    user?.dislikeComments
  );

  let isThereValue = false;
  const formRef = useRef();
  const textInputref = useRef();

  const token = localStorage.getItem("token");
  const client = useQueryClient();
  const clientDetails = client.getQueryData(["user", token]);

  const lc = user?.likedComments;

  //* initialize the likedComments state optimally
  react.useMemo(() => {
    console.log("ran 2 times");
    setLikedCommetns(user?.likedComments);
    setDislikedComments(user?.dislikeComments);
  }, [lc]);

  //* fetch all comments from the DB
  const getCommentList = async () => {
    return (await axios.get(`${path.domain}${malid}/comment/list`)).data;
  };
  const { data } = useQuery(["commentList", malid], getCommentList, {
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  //* toggle the comment and cancel button depending on if there is value or not in the comment text field
  const getValue = (e) => {
    if (e.target.value && !isThereValue) {
      btnVisibilityHandler(true);
      isThereValue = true;
    } else if (!e.target.value && isThereValue) {
      btnVisibilityHandler(false);
      isThereValue = false;
    }
  };

  //* handler to submit the value to server
  async function submitValue(e) {
    e.preventDefault();

    const formValue = new FormData(formRef.current);
    const formValueObject = Object.fromEntries(formValue);
    textInputref.current.disabled = true;

    try {
      const response = (
        await axios.post(
          `${path.domain}${malid}/comment/user/${clientDetails?.userID}/add`,
          formValueObject
        )
      ).data;

      console.log(response);
      textInputref.current.value = "";
      textInputref.current.disabled = false;
      await client.refetchQueries(["commentList", malid]);
      btnVisibilityHandler(false);

      //* two extra re-renders one cause of the refetch and one cause of the state change for submit button
    } catch (error) {
      console.log(error);
    }
  }

  //* handler for the cancel button
  const cancelBtnHandler = (e) => {
    e.preventDefault();
    e.target.previousSibling.previousSibling.value = "";
    btnVisibilityHandler(false);
  };

  //* handler for like and dislike button
  const like_dislikeHandler = async (userID, _id, malID, e, like) => {
    console.log("running like/dislike handler");
    try {
      let response;
      //* condiiton for liked button

      response = (
        await axios.put(
          `${path.domain}${malid}/comment/${like ? "like" : "dislike"}`,
          { userID, _id, malID }
        )
      ).data;

      //* refetch this queries so it will update and re-render the result

      await client.prefetchQuery(["profile", token]);
      await client.prefetchQuery(["commentList", malid]);

      setLikedCommetns(response.userLikedComment);
      setDislikedComments(response.userDislikedComment);
    } catch (error) {
      //* should be a popup message
      console.log(error);
    }
  };

  const throttledLikeDislikeHnadler = function (cb, timeout = 2000) {
    let timeoutID;

    return (...args) => {
      console.log(timeoutID);
      if (!timeoutID) {
        cb.apply(this, ...args);
      }
      clearTimeout(timeoutID);
      timeoutID = setTimeout(() => {
        timeoutID = null;
      }, timeout);
    };
  };

  return (
    <>
      <div className="comment-box-container">
        {!user ? (
          <p className="comments-login-text">
            Please {<Link to={"/userauth"}>sign in</Link>} to comment.
          </p>
        ) : (
          <form className="comment-input-container" ref={formRef}>
            <input
              type="text"
              name="comment"
              id="comment"
              ref={textInputref}
              onChange={getValue}
              autoComplete="off"
              placeholder="Comment something...."
            />

            {isBtnVisable && (
              <button type="submit" onClick={submitValue}>
                Comment
              </button>
            )}
            {isBtnVisable && (
              <button className="cancel" onClick={cancelBtnHandler}>
                {" "}
                Cancel
              </button>
            )}
          </form>
        )}
        <p className="comments-counter">
          {data?.maincomments + data?.subcomments || 0} Comments
        </p>
        <div className="comments">
          {!data ? (
            <p>No comments yet...</p>
          ) : (
            <div className="comments-inner">
              {data.comments.map(
                ({
                  body,
                  date,
                  dislikeCount,
                  likeCount,
                  userID,
                  userName,
                  userProfileImg,
                  _id,
                }) => {
                  //* if the comment is in user's liked comment list
                  const isLiked = likedComments?.find(
                    (ele) => ele.commentId === _id
                  );
                  const isDisliked = dislikedComments?.find(
                    (ele) => ele.commentId === _id
                  );

                  return (
                    <div className="item-container" key={_id}>
                      <div className="user-profile-img-container">
                        <img
                          src={userProfileImg}
                          onError={function (e) {
                            e.target.src = default_img;
                          }}
                          alt=""
                        />
                      </div>
                      <div className="body-container">
                        <div className="username-container">
                          <span>
                            <Link
                              to={
                                userID !== clientDetails?.userID
                                  ? `/user/${userID}`
                                  : `/user/${userID}/view`
                              }
                            >
                              {" "}
                              {userName}
                            </Link>{" "}
                            &bull;
                          </span>
                          <span>
                            {timeAgo.format(new Date(date), "mini-minute-now")}
                          </span>
                        </div>
                        <p>{body}</p>
                        <div className="extra-features">
                          <ion-icon
                            name={!isLiked ? "thumbs-up-outline" : "thumbs-up"}
                            onClick={throttledLikeDislikeHnadler(
                              (e) =>
                                like_dislikeHandler(
                                  clientDetails?.userID,
                                  _id,
                                  malid,
                                  e,
                                  true
                                ),
                              3000
                            )}
                          ></ion-icon>

                          <p className="like-counter counter">{likeCount}</p>

                          <ion-icon
                            name={
                              !isDisliked
                                ? "thumbs-down-outline"
                                : "thumbs-down"
                            }
                            onClick={throttledLikeDislikeHnadler(
                              (e) =>
                                like_dislikeHandler(
                                  clientDetails?.userID,
                                  _id,
                                  malid,
                                  e,
                                  false
                                ),
                              3000
                            )}
                          ></ion-icon>
                          <p className="dislike-counter counter">
                            {dislikeCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
});
