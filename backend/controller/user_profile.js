const userList = require("../Model/user")


const updateProfile =async (req,res,next)=>{

    const {userID} = req.params;
    let data = req.body;
    
    const url = req.protocol + "://" + req.headers.host;
    const imageFilePath = url + "/public/" + req.file.filename
    
     data = {...data,imageFilePath};

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
        let {bio,name,status,activity,image} = userDetails;
        activity = activity.sort((a,b)=> new Date(b.doneAt) - new Date(a.doneAt)).slice(0,5)

        res.status(200).json({message:"Profile updated successfully",user:{bio,status,name,activity,image}})
        
    } catch (error) {
        next(error)
    }

}


const activity = async (req,res,next)=>{
    const {userID} = req.params;
    try {
        const userDetails = await userList.findOne({userid:userID})

        const activityResult = userDetails.addActivity(req.body)  
        
        res.status(200).json(activityResult)
       
        
    } catch (error) {
        next(error)
    }
}


module.exports = {updateProfile,viewProfile,activity}