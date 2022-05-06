const express = require("express");
const router = express.Router({mergeParams:true});
const multer = require("multer");

const {updateProfile,viewProfile,activity,uploadImage} = require("../controller/user_profile")


const storage = multer.diskStorage({
    destination:(req,file,callbc)=>{
        callbc(null,"public/")
    },
    filename:(req,file,callbc)=>{
        const fileName = file.originalname.toLowerCase().split(" ").join("-");
        callbc(null,fileName);
    }
})

const upload = multer({
    storage:storage,
    fileFilter:(req,file,callbc)=>{
        if(["image/png","image/jpg","image/jpeg"].includes(file.mimetype)){
            callbc(null,true)
        }
        else{
            callbc(null,false)
            callbc(new Error("Only .jpg, .jpeg and .png is allowed"))
        }
    }
})



router.post("/update",upload.single("img"),updateProfile);
router.get("/view",viewProfile);
router.put("/activity",activity)
// router.post("/image"
// ,uploadImage)

module.exports = router