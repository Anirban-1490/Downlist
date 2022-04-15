const router = require("express").Router({mergeParams:true})

const {addAnimeHandler,addCharHandler,getSavedAnime,removeSavedAnime} = require("../controller/list")

//*route to add anime to DB
router.post("/addanime",addAnimeHandler)
//*route to fetch all the saved anime
router.get("/viewsavedanime",getSavedAnime)
router.delete("/removeanime/:malID",removeSavedAnime)

//*route to add char to DB
router.post("/addChar",addCharHandler)

module.exports = router;


