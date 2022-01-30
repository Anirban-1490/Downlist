import React from "react";
import "./genreAnime-style.css";
import { useQuery } from "react-query";
import axios from "axios";
import {Mulimgslider} from "./mul_img_slider";
import react from "react";


export const Genres = ()=>
{
    const optionref = react.useRef();
    const [genre_id,setID] = react.useState(4);
   
    const options = [{genre_id:1,name:"Action"},
                    {genre_id:2,name:"Adventure"},
                    {genre_id:4,name:"Comedy"},
                    {genre_id:7,name:"Mystery"},
                    {genre_id:8,name:"Drama"},
                    {genre_id:10,name:"Fantasy"},
                    {genre_id:15,name:"Kids"},
                    {genre_id:22,name:"Romance"},
                    {genre_id:24,name:"Sci Fi"}
                ];

    const { data} = useQuery("genre1", () => getResult(genre_id),{refetchInterval:3000 ,refetchIntervalInBackground:false});
    const getResult = (genre_id)=>
    {
        return axios.get(`https://api.jikan.moe/v3/genre/anime/${genre_id}/1`).then(res=>res.data.anime.slice(0,16));
    }

    
    const dropDownToggle = ()=>
    {
        optionref.current.classList.toggle("active");
        document.querySelector(".wrapper-input").classList.toggle("active")
    }

    react.useEffect(()=>{

    },[genre_id]);




    
    return <>
        <div className="genre-first">
            <h2>DISCOVER <br /> <span>More </span> <br /> <span>Anime</span></h2>
            <div className="item">
            
                <Mulimgslider items={data} switch_details="/anime" />
            </div>
        </div>

        <div className="wrapper-type">
            <h4>Choose your type</h4>
            <div className="wrapper-input">
                <ion-icon name="chevron-down-outline"></ion-icon>
                <input className="genre-display" defaultValue={"Comedy"} type="text" name="" readOnly onClick={dropDownToggle}/>
                <div className="option" ref={optionref}>
                    {
                        options.map(option => {
                            const {genre_id,name} = option;
                            return <div 
                            onClick={()=>
                                {setID(genre_id);
                                    document.querySelector(".genre-display").value = name;
                                    optionref.current.classList.toggle("active");
                                    document.querySelector(".wrapper-input").classList.toggle("active")
                                }}> 
                                <h4>{name}</h4>
                                </div>
                        })
                    }

                </div>
            </div>

        </div>
    </>
}