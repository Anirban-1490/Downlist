const commnetModel = require("../Model/comment")
const userModel = require("../Model/user")
const crypto = require("crypto");

const addComment = async(req,res)=>{
    const {objectID,userID} = req.params;
    const {comment} = req.body;

    //* check if there is a entry for this MalID already exist in the DB
    const commentForObject = await commnetModel.findOne({malid:objectID})
    let doc;
    let userProfileImgPath;
    let userName;

    if(userID){
        const {name,image} = await userModel.findById(userID);

        userName = name;
        userProfileImgPath = image
    }

    //* if dosen't exist then create a new document



    if(!commentForObject){
         doc = await commnetModel.create({
            malid:objectID+"",
            maincomments:1,
            subcomments:0,
            comments:[{
                body:comment+"",
                userID:userID+"",
                userProfileImg:userProfileImgPath,
                userName,
               date: new Date(),
                commentID:crypto.randomBytes(7).toString("hex")

                
            }]
        })
      
        
    }
    else{

        //* else add the comment in the existing document 
        doc =  commentForObject.addComment(comment,userID,userName,userProfileImgPath)
    }   

    
   
    res.status(200).json({messgae:"comment added successfully",doc})
}

const fetchComment = async(req,res)=>{
    const {objectID} = req.params;

    const doc = await commnetModel.findOne({malid:objectID})

    if(!doc) return res.status(404).send("No comments found for this MalID");

    return res.status(200).json(doc);

}


module.exports = {addComment,fetchComment};