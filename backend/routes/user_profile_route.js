const express = require("express");
const router = express.Router({mergeParams:true});

const {updateProfile,viewProfile,activity} = require("../controller/user_profile")


router.put("/update",updateProfile);
router.get("/view",viewProfile);
router.put("/activity",activity)

module.exports = router