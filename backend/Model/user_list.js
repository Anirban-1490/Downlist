const mongoose = require("mongoose");

const userList = new mongoose.Schema({
    username:{
        type:String
    },
    email:{
        type:String,unique:true},
    animeList:{
        type:Array,
        default:[],

    },
    charList:{
        type:Array,
        default:[]
    },
    userid:{
        type:String
    }

})


userList.post("save",(error,doc,next)=>{
   
    //* fot  errors
    next(error)

})

//* instance method for adding a anime
userList.methods.addAnime = function(anime){

    const tempListItems = [...this.animeList,anime]

    this.animeList = tempListItems;
    this.save()
}

userList.methods.removeAnime = function(malid){
  
    const filteredAnime = this.animeList.filter(obj=>obj.malid!=malid)
  
    this.animeList = filteredAnime;
    this.save();
}



// userList.methods.includesAnime = function(malid){

//     let isincludes = false;

//     this.animeList.forEach((obj)=>{
//         if(obj.malid == malid) isincludes = true;
//     })


//     return isincludes;
   
// }


module.exports = mongoose.model("UserLists",userList);