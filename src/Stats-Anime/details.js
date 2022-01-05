import react , {useState , useEffect ,useRef} from "react";
import "./details-style.css";
import "./animestyle.css";
// import { useInView } from "react-intersection-observer";
import { useParams } from "react-router";
import { Link, Outlet } from "react-router-dom";


const Resultmain =()=>
{

    const {id} = useParams();
    const malid = id;
    const [animedetails , setAnimedetails] = useState({});
    const [animegenres , setAnimegenres] = useState([ ]);
    const [stats , setStats] = useState({});
    const [char , setChar] = useState([]);
    
    async function fetch_details_anime()
    {
        const response = await fetch(`https://api.jikan.moe/v3/anime/${malid}`);
        const result = await response.json();
        setAnimedetails(result);
        let arr = result.genres;
        setAnimegenres(arr);

        const response_stats = await fetch(`https://api.jikan.moe/v3/anime/${malid}/stats`);
        const result_stats = await response_stats.json();
        setStats(()=>result_stats);

        fetch(`https://api.jikan.moe/v3/anime/${malid}/characters_staff`).then(result_char =>result_char.json()).then(res =>setChar(()=>res.characters));
       

       
        
    }
    
    useEffect(()=>fetch_details_anime(),[]);
    const details = {animedetails,animegenres,stats,malid};

    return <>
    
    <div className = "container1" style = {{height:"auto"     
           }}>
            <Details  details = {details} fav = {animedetails.favorites} about = {animedetails.synopsis} 
            name = {animedetails.title_english}
            name_kenji = { animedetails.title}
            
            switch_item = "anime"
            />
            
            <h4 style={{
                color: "white", fontSize: "25px",
                marginLeft: "14.5%",
                marginBottom: "1%",
                marginTop:"2em",
                borderLeft: "5px solid red",
                letterSpacing:"2px"
            }}>Characters</h4>
            <Roles  char = {char} path = {'/character'}/>
            
        </div>

       
    </>

}

export const Details =  (prop)=>
{
    const {animedetails,animegenres,stats,malid} = prop.details;
    const {fav,about,name_kenji,name,switch_item} = prop;
    const[itemadd , setItemadd] = useState(false);
    const [seemorebtn , Setbtn] = useState(false);
    const btn = useRef();
    let airedDetails = (animedetails.aired)?{...animedetails.aired}:null;
   
    useEffect(()=>{

        if(switch_item==="anime")
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

      
    },[setItemadd]);

   
    function Additem()
    {
        let temparray =[];
       
        if(itemadd ===false)
        {
            
            
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
                
                localStorage.setItem(switch_item,JSON.stringify(temparray));
            }
            setItemadd(true);
           
        }
        else
        {
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

    if(animedetails.score>7.5)
    {
            color = "#00ff1a";
    }
    else if(animedetails.score<7.5 && animedetails.score>6)
    {
            color = "yellow";
    }
    else{
            color = "#e6e616";
    }


    return <>
        
        <div className = "inner-container">
            <div className = "pic-header">
                <div className = "pic-container">
                    <img src={animedetails.image_url} alt="" />
                </div>
                <div className ="title-container">
                    <h2 className = "title">{name_kenji}</h2>
                    <p className = "title-english">{name}</p>
                </div>
            </div>
            <ul className = "stats">
                {animedetails.episodes && <li><i style={{marginRight:"10px"}} className="fas fa-tv"></i>{animedetails.episodes}</li>}
                {animedetails.score && <li style = {{color:`${color}`}}>{animedetails.score}</li>}
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
                <ul className = "stats-watching">
                <li style = {{color:"lightgrey"}}>Watching: {stats.watching}</li>
                <li style = {{color:"#00ff1a"}}>Completed: {stats.completed}</li>
                <li style = {{color:"yellow"}}>On Hold: {stats.on_hold}</li>
                <li style = {{color:"red"}}>Dropped: {stats.dropped}</li>
                <li style = {{color:"violet"}}>Plan to Watch: {stats.plan_to_watch}</li>
            </ul>
                
                </div>}
            {/* <h4>Characters</h4> */}
           
        </div>
        {/* <Roles char = {char} path = {path}/> */}
        
    </>

}


export const Roles =  react.memo((prop)=>
{
    const {char,path} = prop;
    const [windowsize,setWindowsize] = useState(0);
    const [btnstate , setbtnState] = useState(false);
    const showMorebtn_handle = useRef();
   const inner_character_container_handler = useRef();
   const [height,setHeight] = useState("270px");


    function size()
    {
       setWindowsize(window.innerWidth);
    }

   useEffect(()=>
   {       
       window.addEventListener("resize",size);

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

       return ()=> window.removeEventListener("resize",size);
       
   });



    function handle_container()
    {
        const character_container_handle = document.querySelector(".characters-container");
        if(!btnstate)
        {

            // gets the innercontent height
            const height = character_container_handle.scrollHeight;
            character_container_handle.style.height = height + "px";
            character_container_handle.style.transition = "0.35s";
            setbtnState(true);
        }
        else
        {
            character_container_handle.style.height = "530px";
            setbtnState(false);
        }
            
    }


    return <>
    
    <div className = "characters-container" 
            style = {{height:height}}
            
            >
               
                 <div className = "characters-container-inner" ref={inner_character_container_handler} > 
                    {
                        char && char.map((c)=>
                        {
                            const {name,mal_id,image_url,role,language} =c;
                           
                           
                           return <Link to ={(path)?path + `/${mal_id}`:`` } className="cards"  key = {mal_id}>
                            <div >
                                <div className="img-container">
                                    {image_url?<img src={image_url} alt="" />:""}
                                </div>
                                <div className = "details-char">
                                    <h5>{(name.length<=37)?name:name.substr(0,37)+"..."}</h5>
                                    <h5>{role || language}</h5>
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