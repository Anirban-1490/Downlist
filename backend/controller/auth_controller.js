
const userModel = require("../Model/user")


const login_handler = (req,res)=>{
    const data = req.body
    console.log(data);
    res.status(200).json({"status":"succcess",data})
}

const newUser_handler = async(req,res,next)=>{
    const {name,email,pwd} = req.body

    try {

       
        await userModel.create({name,email,password:pwd})
        res.status(201).json({"status":"succcess"})
        
    } catch (error) {
        //* whatever error is coming from mongoose , pass it in the express error handling middleware
        next(error)

    }
}

module.exports = {login_handler,newUser_handler}