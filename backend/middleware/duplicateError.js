

const duplicateError = (err,res)=>{
    
    return res.status(409).send({message:"An account with that email already exists",field:"email"})
}

module.exports = duplicateError;

