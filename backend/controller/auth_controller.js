
const userModel = require("../Model/user")
const userList = require("../Model/user_list")
const jwt = require("jsonwebtoken")


const login_handler =async (req,res,next)=>{
    const {email,pass} = req.body
   
    //*check if both email and password is available 
    if(!email && !pass){
        return  res.status(400).send({messages:"Please provide a email.Please provide a password",fields:["email","password"]})
    }

   try {
       //* query if the user exist or not
       const data = await userModel.findOne({email:email})
    
       if(!data) return res.status(400).send({messages:"No account found. Please Sign up"})

       //* user found. so check compare it's password
       const isUserFound = await data.comparePassword(pass)

       if(!isUserFound) return res.status(400).send({messages:"No account found. Please Sign up"})

       //* if authentication successful then return token
       const  token = data.getToken();
      return  res.status(200).send({messages:"Successfully signed in",token})

       
   } catch (error) {
       //* any other error then pass it in the middleware
       next(error)
   }

}

const newUser_handler = async(req,res,next)=>{
    const {name,email,pass} = req.body

    try {

       
       const user = await userModel.create(
        {
            name,
            email,
            password:pass,
            image:`${req.headers['x-forwarded-proto'] || 'http'}://${req.header('Host')}/public/default-profile.jpg`
        })
       const token = user.getToken();
       await userList.create({username:name,email,userid:user._id})
        res.status(201).json({"message":"User created successfully!",token})
        
    } catch (error) {
        //* whatever error is coming from mongoose , pass it in the express error handling middleware
        next(error)

    }
}

const authorizeUser = async (req,res)=>{


    //* get the token from client side
    const userToken = req.headers.authorization;
    if(!userToken || !userToken.startsWith("Bearer")){

        //! if no token received then show error
        return res.status(401).send({message:"No access token provided"})
    }

    try {
        //* verify the user with that token
        const {name,userID} = jwt.verify(userToken.split(" ")[1],process.env.JWT_SECRET)
        res.status(200).json({userID,name})

    } catch (error) {
        res.status(401).send({message:"Not authorized"})
    }

    
}

module.exports = {login_handler,newUser_handler,authorizeUser}