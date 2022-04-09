const express = require("express");
const router = express.Router();


const {login_handler,newUser_handler} = require("../controller/auth_controller")

router.post("/signin",login_handler);
router.post("/signup",newUser_handler);

module.exports = router