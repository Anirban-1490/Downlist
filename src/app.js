import React from "react";
import { BrowserRouter as Router ,Route ,Routes,Outlet} from "react-router-dom";
import Header from "../src/Stats-Anime/header";
import Anime from "../src/Stats-Anime/anime";
import Topanime from "../src/Stats-Anime/topanime";
import Topcharacters from "../src/Stats-Anime/topcharacters";
import Details from "../src/Stats-Anime/details";
import Detailschar from "../src/Stats-Anime/details-char";
import Listuser from "../src/Stats-Anime/search";
import ScrollToTop from "../src/Stats-Anime/scrollTotop";
// import {Approvider,Appcontext} from "../src/Stats-Anime/context";

function App()
{
    return <>
    
        <Router>
            <ScrollToTop/>
            <Header/>
            <Routes>
                <Route path = "/" element = {<Anime/>}/>
                   

                <Route path = "/topanime" element = {<Topanime/>}/>
                <Route path = "/topanime/:id" element = {<Details/>} />
                
                
                <Route path = "/topcharacters" element = {<Topcharacters/>}/>
                <Route path = "/topcharacters/:id" element = {<Detailschar/>}/>




                 <Route path = "useranimelist" element = {<Listuser header = "Your anime list" switch_item = "anime"/>}/>

                 <Route path = "usercharacterlist" element = {<Listuser header = "Your character list" switch_item = "char"/>}/>



                 <Route path = "anime/:id" element = {<Details/>} />
                 <Route path = "/character/:id" element = {<Detailschar/>}/>

            </Routes>
        </Router>
    
       
    </>
}

export default App;