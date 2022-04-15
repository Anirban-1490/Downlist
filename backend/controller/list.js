const userList = require("../Model/user_list")


const addAnimeHandler = async (req,res)=>{
    const {userID} = req.params;
    const anime = req.body;

    const userListDetails = await userList.findOne({userid:userID})
    userListDetails.addAnime(anime);
    res.status(200).json({message:"Anime added successfully!"})



}

const getSavedAnime = async(req,res)=>{
    const {userID} = req.params;
    // const {malid} = req.body;
    const userListDetails = await userList.findOne({userid:userID})
    // const isAnimeFound = userListDetails.includesAnime(malid)
   res.status(200).json({list:userListDetails.animeList,userID:userListDetails.userid})
}


const removeSavedAnime = async (req,res)=>{
    const {userID,malID} = req.params;
  
    const userListDetails = await userList.findOne({userid:userID})
    userListDetails.removeAnime(malID);
    res.status(200).json({message:"Successfully removed anime!"})
}






const addCharHandler =async (req,res)=>{
    const {userID} = req.params;
    const character = req.body;

    const userListDetails = await userList.findOne({userid:userID})
    userListDetails.addCharacter(character);
    res.status(200).json({message:"Character added successfully!"})

}


const getSavedCharacter = async(req,res)=>{
    const {userID} = req.params;
    // const {malid} = req.body;
    const userListDetails = await userList.findOne({userid:userID})
    // const isAnimeFound = userListDetails.includesAnime(malid)
   res.status(200).json({list:userListDetails.animeList,userID:userListDetails.userid})
}


const removeSavedCharacter = async (req,res)=>{
    const {userID,malID} = req.params;
  
    const userListDetails = await userList.findOne({userid:userID})
    userListDetails.removeCharacter(malID);
    res.status(200).json({message:"Successfully removed a character!"})
}


module.exports = {addAnimeHandler,addCharHandler,getSavedAnime,removeSavedAnime,getSavedCharacter,removeSavedCharacter}