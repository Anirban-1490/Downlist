
const userModel = require("../Model/user")
const jwt = require("jsonwebtoken")


const login_handler = (req,res)=>{
    const data = req.body
    console.log(data);
    res.status(200).json({"status":"succcess",data})
}

const newUser_handler = async(req,res,next)=>{
    const {name,email,pass} = req.body

    try {

       
       const user = await userModel.create({name,email,password:pass})
       const token = user.getToken();
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