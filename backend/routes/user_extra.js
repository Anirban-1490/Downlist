const router = require("express").Router({mergeParams:true})

const {followHandler} = require("../controller/user_extra_controller")



router.put("/follow",followHandler)


module.exports = router;