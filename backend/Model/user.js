const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
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
    }
})

//* a pre hook middleware used to has the password before saving to database
userSchema.pre("save",async function(){

    //* hash password with bcrypt
    const salt = await bcrypt.genSalt(9);
   this.password = await bcrypt.hash(this.password,salt);
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



module.exports = mongoose.model("users",userSchema);