const userList = require("../Model/user")


const updateProfile =async (req,res,next)=>{

    const {userID} = req.params;
    const data = req.body;
    try {
        const userDetails = await userList.findOne({userid:userID})
        const {bio,status} = userDetails.updateProfile(data)
        res.status(200).json({message:"Profile updated successfully",user:{bio,status}})
        
    } catch (error) {
        next(error)
    }
}
const viewProfile = async (req,res,next)=>{
    const {userID} = req.params;
    try {
        const userDetails = await userList.findOne({userid:userID})
        const {bio,name,status} = userDetails;
        res.status(200).json({message:"Profile updated successfully",user:{bio,status,name}})
        
    } catch (error) {
        next(error)
    }

}

module.exports = {updateProfile,viewProfile}