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



userList.methods.addCharacter = function(character){

    const tempListItems = [...this.charList,character]

    this.charList = tempListItems;
    this.save()
}

userList.methods.removeCharacter = function(malid){
  
    const filteredCharacter = this.charList.filter(obj=>obj.malid!=malid)
  
    this.charList = filteredCharacter;
    this.save();
}


userList.methods.removeAll = function(switch_path){

    if(switch_path === "anime"){
     
        this.animeList = this.animeList.slice(0,0);
    }
    else if(switch_path === "character"){
         this.charList =this.charList.slice(0,0);
    }

    this.save()
}


module.exports = mongoose.model("UserLists",userList);