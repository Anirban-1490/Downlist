
import  react  from "react";
import "./details-style.css";
import "./animestyle.css";
import { useParams } from "react-router";
import {Details ,Roles} from "./details";
import { useQuery } from "react-query";
import {Spinner} from "./loading-spinner";
import {Errorpage} from "./error";
import axios from "axios";
import React from "react";

function Resultmain()
{

    
    const {id} = useParams();
    const malid = id;

    const getCharacterDetails = (url)=> axios.get(url).then(res=>res.data);

    const {data,isLoading,isError} = useQuery("char_details",()=>getCharacterDetails(`https://api.jikan.moe/v3/character/${malid}`),{cacheTime:0,refetchOnWindowFocus:false})

    return <>
    
        {
            (isLoading)? <Spinner/>:
            (isError)?<Errorpage/>:
            <div className = "container1" style = {{height:"auto"}}>
                <Details details ={{animedetails:data,animegenres:null,stats:null,char:null,malid}} fav = {data?.member_favorites} about = {data?.about}
                name = {data?.name}
                name_kenji = {data?.name_kanji}
            
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
                <Animeappp appearances = {data?.animeography} />
                <h4 style={{
                color: "white", fontSize: "25px",
                marginLeft: "14.5%",
                marginBottom: "1%",
                marginTop:"2em",
                borderLeft: "5px solid red",
                letterSpacing:"2px"

                }}>Voice Actors</h4>
                <Voiceactors voiceactors = {data?.voice_actors}/>
            </div>
        }
        
       
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