const mongoose = require("mongoose");
const crypto = require("crypto");

const commentsOn = new mongoose.Schema({
    malid:{
        type:String,
        required:true,
        unique:true
    },
    maincomments:{
        type:Number,
        default:0
    },
    subcomments:{
        type:Number,
        default:0
    },
    comments:[
        {
            body:String,
            userID:String,
            userProfileImg:String,
            userName:String,
            date: Date,
            commentID:String,
            likeCount:{type:Number,default:0},
            dislikeCount:{type:Number,default:0},
            replies:[{
                body:String,
                date:Date ,
                replyID:Number,
                userID:String
            }]
        }
    ]
    
})


commentsOn.methods.addComment = function(comment,userID,userName,userProfileImgPath){

    this.maincomments = this.maincomments +1;
    let commentsArr = this.comments;
    commentsArr.push({
        body:comment+"",
        userID:userID+"",
        userName,
        userProfileImg:userProfileImgPath,
       date: new Date(),
        commentID:crypto.randomBytes(7).toString("hex")
    })
    this.comments = commentsArr;
    this.save();

    return this._doc;

}

//* -- increase the like counter if increase is set to true, else remove the like



commentsOn.methods.addLikeOrDislike = function(__id,increase,whatToIncrease = "likeCount"){
    
    this.comments = this.comments.map((comment)=>{
        
        if(comment._id.valueOf() === __id){
            if(increase){
                
                return {...comment,[whatToIncrease]:comment[whatToIncrease]+1}
            }
            return {...comment,[whatToIncrease]:comment[whatToIncrease]-1}
           
        }
        return comment
    })
    

    
    this.save()
}

module.exports = mongoose.model("Comments",commentsOn);