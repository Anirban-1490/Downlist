import react, { useState, useRef } from "react";
import { useQueryClient, useQuery, useMutation } from "react-query";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import Link from "next/link";

import axios from "axios";
import { path } from "server-path";
import commentStyle from "Components/Details/Style/Comment.module.scss";
import { NoItem } from "Components/Global/NoItemFound/NoItemFound";
import { useInView } from "react-intersection-observer";
import { CircularSpinner } from "Components/Global/CircularSpinner";
import { CustomButton } from "Components/Global/CustomButton/CustomButton";

TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo("en-US");

export const CommentsBox = react.memo(({ user, malid }) => {
    const [isBtnVisable, btnVisibilityHandler] = useState(false);
    const [likedComments, setLikedCommetns] = useState(user?.likedComments);

    const [dislikedComments, setDislikedComments] = useState(
        user?.dislikeComments
    );

    const textInputref = useRef();

    const token =
        typeof localStorage !== "undefined" && localStorage.getItem("token");
    const client = useQueryClient();
    const clientDetails = client.getQueryData(["user", token]);
    const lc = user?.likedComments;

    const { ref: commentBoxRef, inView, entry } = useInView({ threshold: 0 });
    const { mutate, isLoading, error, isError, isSuccess, reset } = useMutation(
        async (comment) => {
            return axios.post(
                `${path.domain}${malid}/comment/add?userID=${user._id}`,
                comment
            );
        },
        {
            onSuccess: ({ data }) => {
                textInputref.current.value = "";

                btnVisibilityHandler(false);
                client.refetchQueries(["commentList", malid]);
            },
        }
    );

    const {
        data,
        isLoading: isCommentsLoading,
        isFetching,
        error: errorForFetchingComments,
        isError: isCommentsError,
    } = useQuery(
        ["commentList", malid],
        () => {
            return axios.get(`${path.domain}${malid}/comment/list`);
        },
        { enabled: !!inView, refetchOnWindowFocus: false }
    );
    let comments = data?.data;

    console.log(comments);
    //* initialize the likedComments state optimally
    react.useMemo(() => {
        console.log("ran 2 times");
        setLikedCommetns(user?.likedComments);
        setDislikedComments(user?.dislikeComments);
    }, [lc]);

    //* toggle the comment and cancel button depending on if there is value or not in the comment text field
    const toggleBtn = (e) => {
        if (e.target.value) {
            btnVisibilityHandler(true);
        } else if (!e.target.value) {
            btnVisibilityHandler(false);
        }
    };

    //* handler to submit the value to server
    async function submitValue(e) {
        e.preventDefault();

        const formValue = new FormData(e.target);
        const comment = Object.fromEntries(formValue);

        mutate(comment);
    }

    //* handler for the cancel button
    const cancelBtnHandler = (e) => {
        textInputref.current.value = "";
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
                    `${path.domain}${malid}/comment/${
                        like ? "like" : "dislike"
                    }`,
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
            <div
                ref={commentBoxRef}
                className={commentStyle["comment-box-container"]}>
                {!user ? (
                    <p className={commentStyle["comments-login-text"]}>
                        Please
                        {
                            <Link href={"/userauth"}>
                                <a>sign in</a>
                            </Link>
                        }
                        to comment.
                    </p>
                ) : (
                    <form
                        className={commentStyle["comment-input-container"]}
                        onSubmit={submitValue}>
                        <label hidden={true} htmlFor={commentStyle["comment"]}>
                            Comment box
                        </label>
                        <input
                            type="text"
                            name="comment"
                            id={commentStyle["comment"]}
                            ref={textInputref}
                            onChange={toggleBtn}
                            autoComplete="off"
                            placeholder="Comment something...."
                        />

                        {isBtnVisable && (
                            <div className={commentStyle["cmnt-btn-wrapper"]}>
                                {!isLoading && (
                                    <CustomButton
                                        title={"Cancel"}
                                        disabled={isLoading}
                                        className={commentStyle["cnl-btn"]}
                                        backgroundColor={"transparent"}
                                        id={"cnl"}
                                        onClick={cancelBtnHandler}>
                                        Cancel
                                    </CustomButton>
                                )}

                                <CustomButton
                                    title={"Comment"}
                                    disabled={isLoading}
                                    className={commentStyle["cmnt-btn"]}
                                    id={"cm"}
                                    type="submit">
                                    {isLoading ? (
                                        <CircularSpinner
                                            size={20}
                                            color="white"
                                        />
                                    ) : (
                                        "Comment"
                                    )}
                                </CustomButton>
                            </div>
                        )}
                    </form>
                )}
                <h3 className={commentStyle["comments-counter"]}>
                    {comments?.mainCommentCount + comments?.subCommentsCount ||
                        0}{" "}
                    Comments
                </h3>
                <div className={commentStyle["comments"]}>
                    {isCommentsLoading && (
                        <CircularSpinner size={30} color="white" />
                    )}
                    {!comments?.comments.length && !isCommentsLoading && (
                        <NoItem content={"No comments yet..."} />
                    )}

                    {comments?.comments.length > 0 && !isCommentsLoading && (
                        <div className={commentStyle["comments-inner"]}>
                            {comments.comments.map(
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
                                        <div
                                            className={
                                                commentStyle["item-container"]
                                            }
                                            key={_id}>
                                            <div
                                                className={
                                                    commentStyle[
                                                        "user-profile-img-container"
                                                    ]
                                                }>
                                                <img
                                                    src={userProfileImg}
                                                    onError={function (e) {
                                                        e.target.src =
                                                            "/default-placeholder.png";
                                                    }}
                                                    alt={userName}
                                                />
                                            </div>
                                            <div
                                                className={
                                                    commentStyle[
                                                        "body-container"
                                                    ]
                                                }>
                                                <div
                                                    className={
                                                        commentStyle[
                                                            "username-container"
                                                        ]
                                                    }>
                                                    <h4>
                                                        <Link
                                                            href={
                                                                userID !==
                                                                user?._id
                                                                    ? `/u/${userID}/profile/read-only`
                                                                    : `/u/${userID}/profile/view`
                                                            }>
                                                            <a title={userName}>
                                                                {userName}
                                                            </a>
                                                        </Link>
                                                    </h4>
                                                    <h4>•</h4>
                                                    <h4
                                                        title={timeAgo.format(
                                                            new Date(date)
                                                        )}>
                                                        {timeAgo.format(
                                                            new Date(date),
                                                            "mini-minute-now"
                                                        )}
                                                    </h4>
                                                </div>
                                                <p>{body}</p>
                                                <div
                                                    className={
                                                        commentStyle[
                                                            "extra-features"
                                                        ]
                                                    }>
                                                    <ion-icon
                                                        name={
                                                            !isLiked
                                                                ? "thumbs-up-outline"
                                                                : "thumbs-up"
                                                        }
                                                        onClick={throttledLikeDislikeHnadler(
                                                            (e) =>
                                                                like_dislikeHandler(
                                                                    user._id,
                                                                    _id,
                                                                    malid,
                                                                    e,
                                                                    true
                                                                ),
                                                            3000
                                                        )}></ion-icon>

                                                    <p
                                                        className={`${commentStyle["like-counter"]} ${commentStyle["counter"]}`}>
                                                        {likeCount}
                                                    </p>

                                                    <ion-icon
                                                        name={
                                                            !isDisliked
                                                                ? "thumbs-down-outline"
                                                                : "thumbs-down"
                                                        }
                                                        onClick={throttledLikeDislikeHnadler(
                                                            (e) =>
                                                                like_dislikeHandler(
                                                                    user._id,
                                                                    _id,
                                                                    malid,
                                                                    e,
                                                                    false
                                                                ),
                                                            3000
                                                        )}></ion-icon>
                                                    <p
                                                        className={`${commentStyle["dislike-counter"]} ${commentStyle["counter"]}`}>
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
