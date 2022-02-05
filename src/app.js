import React from "react";
import { BrowserRouter as Router ,Route ,Routes} from "react-router-dom";
import Header from "../src/Stats-Anime/header";
import Anime from "../src/Stats-Anime/anime";
import Topanime from "../src/Stats-Anime/topanime";
import Topcharacters from "../src/Stats-Anime/topcharacters";
import Details from "../src/Stats-Anime/details";
import Detailschar from "../src/Stats-Anime/details-char";
import Listuser from "../src/Stats-Anime/list-user";
import ScrollToTop from "../src/Stats-Anime/scrollTotop";
import {Mainsection} from "./Stats-Anime/about";
import {Errorpage} from "./Stats-Anime/error";

function App()
{
    return <>
    
        <Router>
            <ScrollToTop/>
            <Header/>
            <Routes>
                <Route index path = "/" element = {<Anime/>}/>
                   
                <Route path = "/topanime" element = {<Topanime/>}/>

                <Route path = "/topcharacters" element = {<Topcharacters/>}/>
              
                <Route path = "/about" element = {<Mainsection/>}/>

                 <Route path = "useranimelist" element = {<Listuser header = "Your anime list" switch_item = "anime"/>}/>

                 <Route path = "usercharacterlist" element = {<Listuser header = "Your character list" switch_item = "character"/>}/>

                 <Route path = "anime/:id" element = {<Details/>} />
                 <Route path = "character/:id" element = {<Detailschar/>}/>


                {/* routing to non-existing path */}
                <Route path="*" element={<Errorpage/>} />


            </Routes>
        </Router>
    
       
    </>
}

export default App;