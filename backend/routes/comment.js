const {addComment,fetchComment,dislikeCommentHandler,likeCommentHandler} = require("../controller/comment_controller")

const router = require("express").Router({mergeParams:true})



router.post("/user/:userID/add",addComment);
router.get("/list",fetchComment);
router.put("/like",likeCommentHandler)
router.put("/dislike",dislikeCommentHandler)

module.exports  = router;