import React from "react";
import react , {useState , useEffect ,useRef} from "react";
import "./details-style.css";
import "./animestyle.css";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import { useQueries,useQuery } from "react-query";
import {Spinner} from "./loading-spinner";
import {Errorpage} from "./error";


//* component for anime details

const Resultmain =()=>
{

    const {id} = useParams();
    const malid = id;
    
   
    //* details of that anime
    const getDetails = (url)=> axios.get(url).then(value=> value.data);

    //* get people reaction like favourites
    const getPeopleReaction = (url) => axios.get(url).then(result=>result.data);
    //* get all the characters in that anime
    const getAllCharacters =(url)=> axios.get(url).then(res=>[...res.data.characters])

    const result = useQueries([
        { queryKey: ["details",id], 
        queryFn: () => getDetails(`https://api.jikan.moe/v3/anime/${malid}`),cacheTime:0,refetchOnWindowFocus:false }
        ,
        { queryKey: ["people_reaction",id], 
        queryFn: () => getPeopleReaction(`https://api.jikan.moe/v3/anime/${malid}/stats`) ,cacheTime:0,refetchOnWindowFocus:false }
        ,
        {queryKey:["characters",id],
        queryFn:()=>getAllCharacters(`https://api.jikan.moe/v3/anime/${malid}/characters_staff`),cacheTime:0 ,refetchOnWindowFocus:false}
    ])


    const genres = result[0].data?.genres;
    const randomGenre = genres && genres[(Math.floor(Math.random()*10)%genres.length)];

    //object for the metadeta of that anime
    const details = {animedetails:result[0].data ,animegenres:genres,stats:result[1].data,malid};




    //get array of random anime recommendation

    const getRecommend = (url)=>
    {
        if (result[0].data) {
            return axios.get(url).then(res => {

                let randomAnime = [];
                while (randomAnime.length < 13) {

                    randomAnime.push(res.data.anime[Math.floor(Math.random() * 100) % res.data.anime.length])
                    
                    randomAnime = [...new Set(randomAnime)]
                }

                
                return randomAnime
            }
            );
        }
       
    }

    // fetch all the anime from a random genre with it's genre id
   const {data,isLoading} = useQuery(["recommendations",id],
   ()=>getRecommend(`https://api.jikan.moe/v3/genre/anime/${randomGenre.mal_id}`),
   {refetchOnWindowFocus:false,enabled:!!genres})

    return <>
    
        {(result.some(item => item.isLoading) && isLoading) ? <Spinner /> :
            (result.some(item => item.error)) ? <Errorpage/> :
                <div className="container1" style={{
                    height: "auto"
                }}>
                    <Details details={details} fav={result[0].data?.favorites} about={result[0].data?.synopsis}
                        name={result[0].data?.title_english}
                        name_kenji={result[0].data?.title}

                        switch_item="anime"
                        switch_path="topanime"
                    />

                    //* characters section
                    <h4 style={{
                        color: "white", fontSize: "25px",
                        marginLeft: "14.5%",
                        marginBottom: "1%",
                        marginTop: "2em",
                        borderLeft: "5px solid red",
                        letterSpacing: "2px"
                    }}>Characters</h4>
                    <Roles char={result[2].data} path={'/character'} />

                    //* recommendations section
                    <h4 style={{
                        color: "white", fontSize: "35px",
                        marginBottom: "1%",
                        marginTop: "2em",
                        letterSpacing: "2px",textAlign:"center"
                    }}>Recommended</h4>
                    <Roles char={data} path={'/anime'} />
                    
                </div>


        }

       
    </>

}

export const Details =  (prop)=>
{
    const {animedetails,animegenres,stats,malid} = prop.details;
    const {fav,about,name_kenji,name,switch_item,switch_path} = prop;
    const[itemadd , setItemadd] = useState(false);
    const [seemorebtn , Setbtn] = useState(false);
    const btn = useRef();
    let airedDetails = (animedetails?.aired)?{...animedetails.aired}:null;

    //function to check if item is in the local storage when you visit this page later
    const checkItem = react.useCallback(()=>
    {
        if(switch_item==="anime")
        {
            if(localStorage.getItem(switch_item)!==null)
            {
                [...JSON.parse(localStorage.getItem(switch_item))].forEach((obj)=>{
                    if(obj.malid===malid)
                    {
                        //if item is in local storage the set this state to true
                        setItemadd(true);
                    }      
                });
            }
        }
        else
        {
            if(localStorage.getItem(switch_item)!==null)
            {
                [...JSON.parse(localStorage.getItem(switch_item))].forEach((obj)=>{
                    if(obj.malid===malid)
                    {
                        setItemadd(true);
                    }
                    
                });
            }
        }

    },[setItemadd])
   
    useEffect(()=>checkItem(),[checkItem]);

   // function to add item into local storage
    function Additem()
    {
        let temparray =[];
       
        if(itemadd ===false)
        {
            
            //check if the route is for anime
            if(switch_item==="anime")
            {
                const item = {malid,img_url:animedetails.image_url,title:animedetails.title,score:animedetails.score,episodes:animedetails.episodes,fav:animedetails.favorites};

                if(localStorage.getItem(switch_item)!==null)
                {
                    temparray = JSON.parse(localStorage.getItem(switch_item));
               
                    temparray = [...temparray,item];
                }
                else{
                    temparray = [...temparray,item];
                }
                
                localStorage.setItem(switch_item.toString(),JSON.stringify(temparray));
            }
            //check if the route is for character
            else if(switch_item === "character")
            {
                const item = {malid,img_url:animedetails.image_url,title:name,fav};

                if(localStorage.getItem(switch_item)!==null)
                {
                    temparray = JSON.parse(localStorage.getItem(switch_item));
               
                    temparray = [...temparray,item];
                }
                else{
                    temparray = [...temparray,item];
                }
                
                localStorage.setItem(switch_item.toString(),JSON.stringify(temparray));
            }

            //item added
            setItemadd(true);
           
        }
        else
        {
            //* if item already added then remove it

            if(switch_item === "anime")
            {
                temparray = JSON.parse(localStorage.getItem(switch_item));
                temparray = [...temparray].filter((obj)=> {
                    return obj.malid!==malid
                });
                
                localStorage.setItem(switch_item,JSON.stringify(temparray));
                
            }
            else if(switch_item ==="character")
            {
                temparray = JSON.parse(localStorage.getItem(switch_item));
                temparray = [...temparray].filter((obj)=> {
                    return obj.malid!==malid
                });
                
                localStorage.setItem(switch_item,JSON.stringify(temparray));
               
            }
            setItemadd(false);
        }
       
       
    }

     


    let color = "white";

    if(animedetails?.score>7.5)
    {
            color = "#00ff1a";
    }
    else if(animedetails?.score<7.5 && animedetails?.score>6)
    {
            color = "yellow";
    }
    else{
            color = "#e6e616";
    }


    return <>
        
        <div className="go-back">
            <ion-icon name="arrow-back-outline"></ion-icon>
            <Link className="go-back-text" to ={`/${switch_path}`}>{`back to ${switch_path} `}</Link>
            </div>

        <div className = "inner-container">
            <div className = "pic-header">
                <div className = "pic-container">
                    <img src={animedetails?.image_url} alt="" />
                </div>
                <div className ="title-container">
                    <h2 className = "title">{name_kenji}</h2>
                    <p className = "title-english">{name}</p>
                </div>
            </div>
            <ul className = "stats">
                {animedetails?.episodes && <li><i style={{marginRight:"10px"}} className="fas fa-tv"></i>{animedetails?.episodes}</li>}
                {animedetails?.score && <li style = {{color:`${color}`}}>{animedetails?.score}</li>}
                <li><i style={{marginRight:"10px",color:"yellow"}} className="fas fa-star"></i>{fav}</li>
                <li className="add-to-list">
                    <button ref={btn} 
                    type="button" 
                    onClick={Additem} 
                    onMouseDown={()=> btn.current.style.animation = "btnanime 0.2s 1 forwards"} 
                    onMouseUp={()=> btn.current.style.animation = "none"} 
                    style={(itemadd)?
                    {background:"#fb2f00"}:{background:"#802bb1"}}>
                        {(itemadd) ? <span>
                            <i className="fas fa-minus" style={{ margin: "0 3px" }}></i>Remove from list
                            </span>
                             : 
                            <span>
                            <i className="fas fa-plus" style={{ margin: "0 3px" }}></i>Add to list
                            </span>}
                    </button>
                </li>
            </ul>
            <h4>Information</h4>
            <p className = "description">{(about)?(!seemorebtn && about.length>380)?about.substr(0,380).concat("..."):about:"No information available"}  
            
            {(about && about.length>380)?<p style={{display:"inline",color:"lightcyan",cursor:"pointer"}} onClick={()=>(!seemorebtn)?Setbtn(true):Setbtn(false)}>{(seemorebtn)?"Read less":"Read more"}</p>:""} </p>
            {animegenres && 
                <div>
                <h4>Genres</h4>
                <ul className="genres">
                    {
                        animegenres.map((item) => {
                            const { name, mal_id } = item;
                            return <li key={mal_id}>{name}</li>
                        })
                    }
                </ul>
                </div>
            }
            {
                airedDetails && 
                    <div>
                    <h4>Aired</h4>
                    <div className="aired">

                        <p>{airedDetails.string}</p>
                        <p>{animedetails.status}</p>
                    </div>
                    </div>
            }
            {stats && <div>
                
                <h4>Stats</h4>
                <ul className="stats-watching">
                    <li style={{ color: "lightgrey" }}>Watching: {stats.watching}</li>
                    <li style={{ color: "#00ff1a" }}>Completed: {stats.completed}</li>
                    <li style={{ color: "yellow" }}>On Hold: {stats.on_hold}</li>
                    <li style={{ color: "red" }}>Dropped: {stats.dropped}</li>
                    <li style={{ color: "violet" }}>Plan to Watch: {stats.plan_to_watch}</li>
                </ul>

            </div>}
           
        </div>
        
    </>

}


export const Roles =  react.memo((prop)=>
{
    const {char,path} = prop;
    const [,setWindowsize] = useState(0);
    const [btnstate , setbtnState] = useState(false);
    const showMorebtn_handle = useRef();
   const inner_character_container_handler = useRef();
   const main_container = useRef();
   const [height,setHeight] = useState("270px");


   //*determine the container height for the characetr/roles section
    const rolesContainerSize = react.useCallback(()=>
    {
        if(inner_character_container_handler.current.scrollHeight< 250)
        {
            setHeight("270px");
            showMorebtn_handle.current.style.display = "none";
        }
        else if (inner_character_container_handler.current.scrollHeight> 200 && inner_character_container_handler.current.scrollHeight< 500) 
        {
            setHeight("530px");
            showMorebtn_handle.current.style.display = "none";
        }
        else if (inner_character_container_handler.current.scrollHeight > 490) 
        {
            setHeight("530px");
            showMorebtn_handle.current.style.display = "block";
        }
    },[inner_character_container_handler.current?.scrollHeight])


   useEffect(()=>
   {       
       window.addEventListener("resize",()=>{setWindowsize(window.innerWidth)});

       rolesContainerSize() //whenever window size changes check for the container size
       
       return ()=> window.removeEventListener("resize",()=>{setWindowsize(window.innerWidth)});
       
   },[rolesContainerSize,setWindowsize]);


   //handler for "see more" button 
    function handle_container()
    {
        if(!btnstate)
        {

            // gets the innercontent height
            const height = main_container.current.scrollHeight;
            main_container.current.style.height = height + "px";
            main_container.current.style.transition = "0.35s";
            setbtnState(true);
        }
        else
        {
            main_container.current.style.height = "530px";
            setbtnState(false);
        }
            
    }


    return <>
    
    <div className = "characters-container" 
            style = {{height:height}} ref={main_container}
            
            >
               
                 <div className = "characters-container-inner" ref={inner_character_container_handler} > 
                    {
                        char && char.map((c)=>
                        {
                            const {name,mal_id,image_url,role,language,title} =c;
                           const itemName = name || title
                           
                           return <Link to ={(path)?path + `/${mal_id}`:`` } className="cards"  key = {mal_id} >
                            <div >
                                <div className="img-container">
                                    {image_url?<img src={image_url} alt="" />:""}
                                </div>
                                <div className = "details-char">
                                    <h5 style={(title)?{fontSize:"0.8em",padding:"0 2%",textAlign:"center"}:null}>{(itemName.length<=37)?itemName:itemName.substr(0,37)+"..."}</h5>
                                    {
                                        (role || language) && <h5>{role || language}</h5>
                                    }
                                </div>
                            </div>
                           
                           
                           </Link>
    
                        })
                    }

                 </div>
                <button type ="button" ref ={showMorebtn_handle} onClick = {()=> handle_container()}>{(btnstate)?"Show less":"Show more"}</button>
            </div>
            <div className= "empty-for-no-reason"></div>
    </>
})


export default Resultmain;