
const validationError = (err,req,res,next)=>{
  
    try {
     res.status(400).json(JSON.parse(err.message))
    } catch (error) {
     res.status(400).json(err)
    }
 }

 module.exports = validationError