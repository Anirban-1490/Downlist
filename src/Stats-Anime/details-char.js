import react , {useState , useEffect ,useRef} from "react";
import "./details-style.css";
import "./animestyle.css";
import { useParams } from "react-router";
import { Outlet } from "react-router-dom";
import {Details ,Roles} from "./details";


function Resultmain()
{

    
    const {id} = useParams();
    const malid = id;
    const [chardetails , setchardetails] = useState({});
    const [appearances , setAppearances] = useState([]);
    const [voiceactors ,setVoiceactors] = useState([]);
    async function fetch_details_char()
    {
        const response = await fetch(`https://api.jikan.moe/v3/character/${malid}`);
        const result = await response.json();
        setchardetails(result);
        setAppearances(result.animeography);
        setVoiceactors(result.voice_actors);

       
        
    }
    
    useEffect(()=>fetch_details_char(),[]);



    return <>
    
    <div className = "container1" style = {{height:"auto"}}>
            <Details details ={{animedetails:chardetails,animegenres:null,stats:null,char:appearances,malid}} fav = {chardetails.member_favorites} about = {chardetails.about}
            name = {chardetails.name}
            name_kenji = {chardetails.name_kanji}
            
            switch_item = "character"
            switch_path = "topcharacters"
            />
             <h4 style={{
                color: "white", fontSize: "25px",
                marginLeft: "14.5%",
                marginBottom: "1%",
                marginTop:"2em",
                borderLeft: "5px solid red",
                letterSpacing:"2px"

            }}>Anime Appearances</h4>
            <Animeappp appearances = {appearances} />
            <h4 style={{
                color: "white", fontSize: "25px",
                marginLeft: "14.5%",
                marginBottom: "1%",
                marginTop:"2em",
                borderLeft: "5px solid red",
                letterSpacing:"2px"

            }}>Voice Actors</h4>
            <Voiceactors voiceactors = {voiceactors}/>
        </div>
        
       
    </>

}
const Animeappp = react.memo(({appearances})=>
{
    return <Roles char ={appearances} path = {`/anime`}/>
})

const Voiceactors = react.memo(({voiceactors})=>{
    return <Roles char ={voiceactors} />
})

export default Resultmain;