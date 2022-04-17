const router = require("express").Router({mergeParams:true})

const {addAnimeHandler,addCharHandler,getSavedAnime,removeSavedAnime,getSavedCharacter,removeSavedCharacter,removeAll} = require("../controller/list")

//*route to add anime to DB
router.post("/addanime",addAnimeHandler)
//*route to fetch all the saved anime
router.get("/viewsavedanime",getSavedAnime)
router.delete("/removeanime/:malID",removeSavedAnime)

//*route to add char to DB
router.post("/addChar",addCharHandler)
//*route to fetch all the saved characters
router.get("/viewsavedchar",getSavedCharacter)
router.delete("/removechar/:malID",removeSavedCharacter)

router.delete("/removeall/:switch_path",removeAll)

module.exports = router;


