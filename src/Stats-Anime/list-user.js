import React,{useEffect,useState} from "react";
import { Link,useLocation, useParams  } from "react-router-dom";
import {Dropdown} from "./genres-anime";
import "./genreAnime-style.css";
import "./list-style.css";
import react from "react";
import axios from "axios";
import { useQueryClient,useQuery } from "react-query";
var token = localStorage.getItem("token");


function Listmain({header,switch_item})
{
    useLocation()
    const {userID} = useParams()
   
    const data = useList(switch_item,userID);

    return <>
    
    <div className = "container1" style = {{height:"auto",minHeight:"100vh"}}>
            
           {
               (data!== undefined)? <List header = {header} switch_item = {switch_item} data = {data} />:""
           }
        </div>
       
    </>

}

//* custom hook to get the user's list items

export function useList(switch_item,userID)
{
    async function fetchUserList() {
        if (switch_item === "character") return (await axios.get(`http://localhost:4000/user/${userID}/viewsavedchar`)).data;

        return (await axios.get(`http://localhost:4000/user/${userID}/viewsavedanime`)).data

    }
 
   const {data} =  useQuery((switch_item === "anime") ? "userAnimeList" : "userCharList"

        , () => fetchUserList(), {
            refetchOnWindowFocus: false,
        enabled: !!userID

        , cacheTime: 1000,onSettled:(data,err)=>{
            if(err) return console.log(err);
            
        }
    })


     return data
    
    
}


function List(props)
{
    
    const {header,switch_item,data} = props;
    const client = useQueryClient();
    const clientData = client.getQueryData(["user",token]);
    const [list,setList] = useState(data.list)
  

    const [stat,setStat] = useState("");
    //* sorting by options
    const options = [
        { genre_id: 1, name: "Favourite", _name: "fav" },
        (switch_item !== "character") ? { genre_id: 2, name: "Score", _name: "score" } : {}

    ];


    const clearlist = async()=> 
    {
        const response = await axios.delete(`http://localhost:4000/user/${clientData?.userID}/removeall/${switch_item}`)
        window.location.reload()
        console.log(response.data);
       
    }



    //*sort by which ?
    const sortCheck = react.useCallback(() => {
        setList(list => [...list].sort((a, b) => b[stat] - a[stat]))
      
    }, [stat])
    
    useEffect(() => {

        sortCheck()

    }, [sortCheck])


    return <>
        <h2 className = "header">{header}</h2>
        <div className="option-container">
            <div className="wrapper-type" >
             {/*? drop down for sorting */}
                <Dropdown options={options} setID={setStat}  placeholder = "Sort by..." stats_anime = {switch_item}/>
            </div>
            <button className="clr-btn" type="button" onClick={clearlist}><span><i className="fas fa-times"></i></span> <span>Clear list</span></button>
        </div>
       
            <ul className = "search-container">
            
            {(list?.length>0 ) ? 
                list?.map((item)=>
                {
                   
                    const {fav,malid,episodes,img_url,score,title} = item;

                    return <Link to ={`/${switch_item}/${malid}`} key ={malid} className="items-container">

                    <li key ={malid}>
                        <div className = "img-container">
                            <img src={img_url} alt="" />
                        </div>
                        <div className = "details">
                            <div className="title"><h4>{(title.length>35)?title.substr(0,35)+"...":title}</h4></div>
                            <div className="stats">
                            <h4>{(score)?score:""}</h4>
                            <h4><i style={{marginRight:"10px",color:"yellow"}} className="fas fa-star"></i>{fav}</h4>
                            <h4>
                                {(episodes)? <span><i style={{marginRight:"10px"}} className="fas fa-tv"></i>{episodes}</span>:"" }
                            </h4>
                            </div>
                        </div>
                    </li>
                    </Link>
                })
            :
            <h3 className="empty">Empty list</h3>
            }
        
        </ul>

        <div style={{height:"150px"}}></div>
    </>
}


export default Listmain;