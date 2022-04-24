const express = require("express");
const router = express.Router({mergeParams:true});

const {updateProfile,viewProfile} = require("../controller/user_profile")


router.put("/update",updateProfile);
router.get("/view",viewProfile);

module.exports = router