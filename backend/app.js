const express = require("express");
const app = express()
const cors = require("cors");
require("dotenv").config()

app.set("trust-proxy",true)
app.enable("trust-proxy")

const listrouter = require("./routes/list_router");
const authrouter = require("./routes/authrouter")
const profileRouter = require("./routes/user_profile_route")
const commentRouter = require("./routes/comment")
//* import DB
const connectDB = require("./database/db_connection")
//*import validaiton error handler middleware
const errorHandler = require("./middleware/validation-error")
const extra = require("./routes/user_extra")

app.use(cors())


app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/public', express.static('public'));
app.use("/api/v1/auth",authrouter)
app.use("/user/:userID/profile/",profileRouter)
app.use("/user/:userID",listrouter)
app.use("/:objectID/comment/",commentRouter)
app.use("/u/",extra)

app.get("/",(req,res)=>
{
    res.send("<h2>hello world</h2>")
})

app.post("/user/:userID/image",(req,res,next)=>
{
    console.log(req.files);
})


//* error handling middleware

app.use(errorHandler)

const Port = process.env.PORT || 5000

const startServer = async()=>{
    try {
        await connectDB(process.env.DATABASE_CONNECTION);
    
        app.listen(Port,()=>{
            console.log("server is up.... on " + Port);
        })
        
    } catch (error) {
        console.log("database error")
    }

}
startServer()

