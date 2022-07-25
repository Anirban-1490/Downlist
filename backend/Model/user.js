const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        minlength:[5,"Name is too short"],
        maxlength:[50,"Name is too long"],
        required:[true,"Please provide a name"]
    }
    ,
    email:{
        type:String,
        match:[ /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Please provide a valid email"],
        unique:true,
        required:[true,"Please provide a email"]
    },
    password:{
        type:String,
        minlength:[6,"Password must be at least 6 characters long"],
        required:[true,"Please provide a password"]
    },
    image:{
        type: String
    },
    bio:{
        type:String,
        maxlength:[35,"Maximum 35 characters allowed"],
        default:""
    },
    status:{
        type:String,
        maxlength:[12,"Maximum 12 characters allowed"],
        default:""
    },
    activity:{
        type:Array,
        default:[]
    },
    view:{
        type:Number,
        default:0
    },
    followers:{
        type:Array,
        default:[]
    },
    following:{
        type:Array,
        default:[]
    },
    likedComments:{
        type:Array,
        default:[]
    },
    dislikeComments:{
        type:Array,
        default:[]
    }
})

//* a pre hook middleware used to has the password before saving to database
userSchema.pre("save",async function(next){

    //*only hashed if it is the first time it is being saved to the db or if it has been modified. 
    if (this.isModified("password") || this.isNew) {
     
         //* hash password with bcrypt
    const salt = await bcrypt.genSalt(9);
    this.password = await bcrypt.hash(this.password,salt);
    } else {
        return next();
    }
    
   
})

//* error handling middleware , where an error from mongoose is passed in the next() after the document done it's validation

//? remember if next() has an error as an argument then it will skip all non-error handling routes and will execute only an error handling middleware

userSchema.post("save",(error,doc,next)=>{
   
        //* fot  errors
        next(error)
   
})


//*instance method to create the jwt token
userSchema.methods.getToken = function(){

   return jwt.sign({userID:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_TIME})
}

//*instance method to compare password
userSchema.methods.comparePassword = function(userPassword){
    
    return bcrypt.compare(userPassword +"",this.password+"")
}

userSchema.methods.updateProfile = function(obj){

    const  {name,bio,status,imageFilePath} = obj;

    if(name) this.name = name;
    if(bio) this.bio = bio;
    if(status) this.status = status;
    if(imageFilePath) this.image = imageFilePath;

   this.save();
   return this._doc;
}

userSchema.methods.addActivity = function(activity){
    const {actDone,detail,doneAt} = activity
    const tempObj = {actDone,detail,doneAt}

    const tempActivity = [...this.activity,tempObj]
    this.activity = tempActivity;
    this.save()
    return this._doc.activity;
}

//* --- instance method to add a liked comment to user's liked comments array

userSchema.methods.addLikedComment = function(_id,malid){
    this.likedComments = [...this.likedComments,{commentId:_id,malId:malid}]
    
}


//* --- instance method to add a disliked comment to user's disliked comments array


userSchema.methods.addDislikedComment = function(_id,malid){
    this.dislikeComments = [...this.dislikeComments,{commentId:_id,malId:malid}]
    
}


userSchema.methods.removeComment = function(_id,like){
    
    if(like){
  
        this.likedComments = this.likedComments.filter(comment=>comment.commentId!==_id)
    }
    else if(!like){
        this.dislikeComments = this.dislikeComments.filter(comment=>comment.commentId !==_id)
    }
    
}

module.exports = mongoose.model("users",userSchema);