const validationError = (err,res)=>{

    const messages = Object.values(err.errors).map(err=>err.message)
    const fields = Object.values(err.errors).map(err=>err.path)

    //? if there is multiple error messages then join them in one string
    if(messages.length >1){
        const formatedErrorsMessage = messages.join(".")
        return res.status(400).send({message:formatedErrorsMessage,fields})
    }
    return  res.status(400).send({messages,fields})

}

module.exports = validationError;
