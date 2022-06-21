const mongoose = require("mongoose");

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
            date: Date,
            commentID:Number,
            likeCount:{type:Number,default:0},
            dislikeCount:{type:Number,default:0},
            replies:[{
                body:String,
                date:Date ,
                replyID:Number
            }]
        }
    ]
    
})




module.exports = mongoose.model("Comments",commentsOn);