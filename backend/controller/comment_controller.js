const commnetModel = require("../Model/comment")
const crypto = require("crypto");

const addComment = async(req,res)=>{
    const {objectID,userID} = req.params;
    const {comment} = req.body;

    //* check if there is a entry for this MalID already exist in the DB
    const commentForObject = await commnetModel.findOne({malid:objectID})
    let doc;

    //* if dosen't exist then create a new document
    if(!commentForObject){
         doc = await commnetModel.create({
            malid:objectID+"",
            maincomments:1,
            subcomments:0,
            comments:[{
                body:comment+"",
                userID:userID+"",
               date: new Date(),
                commentID:crypto.randomBytes(7).toString("hex")

                
            }]
        })
      
        
    }
    else{

        //* else add the comment in the existing document 
        doc =  commentForObject.addComment(comment,userID)
    }   

    
   
    res.status(200).json({messgae:"comment added successfully",doc})
}



module.exports = addComment;