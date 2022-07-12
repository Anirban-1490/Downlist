const user = require("../Model/user")


const followHandler = async(req,res,next)=>{

    const {visitorID,userToFollowUserID} = req.body;

    try {
        let userToFollow = await user.findById(userToFollowUserID)
        const visitor = await user.findById(visitorID)
        
        if(!userToFollow.followers.find(followerID=>followerID=== visitorID)){
            userToFollow.followers = [...userToFollow.followers,visitorID]
            visitor.following = [...visitor.following,userToFollowUserID]
            

        }
        else{
            console.log("hello");
            userToFollow.followers = userToFollow.followers.filter(followerID=> followerID !== visitorID )
            visitor.following = visitor.following.filter(followingID=> followingID !== userToFollowUserID )
            
        }

        userToFollow.save();
        visitor.save()

       
        return res.status(200).json(visitor.following)

        


    } catch (error) {
        next(error)

    }
    

}

module.exports = {followHandler};