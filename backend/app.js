const express = require("express");
const app = express()
const cors = require("cors");
require("dotenv").config()

const listrouter = require("./routes/list_router");
const authrouter = require("./routes/authrouter")
const profileRouter = require("./routes/user_profile_route")
//* import DB
const connectDB = require("./database/db_connection")
//*import validaiton error handler middleware
const errorHandler = require("./middleware/validation-error")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())
app.use("/api/v1/auth",authrouter)
app.use("/user/:userID/profile/",profileRouter)
app.use("/user/:userID",listrouter)

app.get("/",(req,res)=>{
    res.send("<h2>hello world</h2>")
})


//* error handling middleware

app.use(errorHandler)

const Port = process.env.PORT || 4000

const startServer = async()=>{
    try {
        await connectDB(process.env.DATABASE_CONNECTION);
    
        app.listen(Port,()=>{
            console.log("server is up....");
        })
        
    } catch (error) {
        console.log("database error")
    }

}
startServer()

