const commnetModel = require("../Model/comment");
const userModel = require("../Model/user");
const crypto = require("crypto");

const addComment = async (req, res) => {
  const { objectID, userID } = req.params;
  const { comment } = req.body;

  //* check if there is a entry for this MalID already exist in the DB
  const commentForObject = await commnetModel.findOne({ malid: objectID });

  let doc;
  let userProfileImgPath;
  let userName;

  if (userID) {
    const { name, image } = await userModel.findById(userID);

    userName = name;
    userProfileImgPath = image;
  }

  //* if dosen't exist then create a new document

  if (!commentForObject) {
    doc = await commnetModel.create({
      malid: objectID + "",
      maincomments: 1,
      subcomments: 0,
      comments: [
        {
          body: comment + "",
          userID: userID + "",
          userProfileImg: userProfileImgPath,
          userName,
          date: new Date(),
          commentID: crypto.randomBytes(7).toString("hex"),
        },
      ],
    });
  } else {
    //* else add the comment in the existing document
    doc = commentForObject.addComment(
      comment,
      userID,
      userName,
      userProfileImgPath
    );
  }

  res.status(200).json({ messgae: "comment added successfully", doc });
};

const fetchComment = async (req, res) => {
  const { objectID } = req.params;

  const doc = await commnetModel.findOne({ malid: objectID });
  if (!doc) return res.status(404).send("No comments found for this MalID");

  return res.status(200).json(doc);
};

const likeCommentHandler = async (req, res, next) => {
  const { userID, _id, malID } = req.body;
  try {
    const user = await userModel.findById(userID);

    const commentForObject = await commnetModel.findOne({ malid: malID });

    const isCommentHaveLike = user.likedComments.find(
      (comment) => comment.commentId == _id
    );

    const isCommentHaveDislike = user.dislikeComments.find(
      (comment) => comment.commentId == _id
    );

    if (!isCommentHaveLike && !isCommentHaveDislike) {
      user.addLikedComment(_id, malID);
      commentForObject.addLikeOrDislike(_id, true);
    } else if (isCommentHaveDislike) {
      user.removeComment(_id, false); //* remove comment from dislike comments array
      commentForObject.addLikeOrDislike(_id, false, "dislikeCount"); //* remove the dislike

      user.addLikedComment(_id, malID); //* add to liked comments array
      commentForObject.addLikeOrDislike(_id, true); //* increase like counter
    } else if (isCommentHaveLike) {
      user.removeComment(_id, true);
      commentForObject.addLikeOrDislike(_id, false);
    }
    await user.save();
    await commentForObject.save();
    res.status(200).json({
      message: "success",
      userLikedComment: user.likedComments,
      userDislikedComment: user.dislikeComments,
    });
  } catch (error) {
    //* pass error to error hnadling middleware
    next(error);
  }
};
const dislikeCommentHandler = async (req, res, next) => {
  const { userID, _id, malID } = req.body;
  try {
    const user = await userModel.findOne({ _id: userID });
    const commentForObject = await commnetModel.findOne({ malid: malID });

    const isCommentHaveLike = user.likedComments.find(
      (comment) => comment.commentId == _id
    );

    const isCommentHaveDislike = user.dislikeComments.find(
      (comment) => comment.commentId == _id
    );

    if (!isCommentHaveLike && !isCommentHaveDislike) {
      user.addDislikedComment(_id, malID);
      commentForObject.addLikeOrDislike(_id, true, "dislikeCount");
    } else if (isCommentHaveLike) {
      user.removeComment(_id, true); //* remove comment from like comments array

      commentForObject.addLikeOrDislike(_id, false, "likeCount"); //* remove the like

      user.addDislikedComment(_id, malID); //* add to disliked comments array

      commentForObject.addLikeOrDislike(_id, true, "dislikeCount"); //* increase dislike counter
    } else if (isCommentHaveDislike) {
      user.removeComment(_id, false);
      commentForObject.addLikeOrDislike(_id, false, "dislikeCount");
    }

    await user.save();
    await commentForObject.save();

    res.status(200).json({
      message: "success",
      userDislikedComment: user.dislikeComments,
      userLikedComment: user.likedComments,
    });
  } catch (error) {
    //* pass error to error hnadling middleware
    next(error);
  }
};

module.exports = {
  addComment,
  fetchComment,
  likeCommentHandler,
  dislikeCommentHandler,
};
