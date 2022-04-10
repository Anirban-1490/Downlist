const express = require("express");
const router = express.Router();


const {login_handler,newUser_handler,authorizeUser} = require("../controller/auth_controller")

router.post("/signin",login_handler);
router.post("/signup",newUser_handler);
router.get("/authorize",authorizeUser)

module.exports = router