

const duplicateError = (err,res)=>{
    
    return res.status(409).send({messages:"An account with that email already exists",field:"email"})
}

module.exports = duplicateError;

