import React,{useEffect,useState} from "react";
import { Link  } from "react-router-dom";
import {Dropdown} from "./genres-anime";
import "./genreAnime-style.css";
import "./list-style.css";
import react from "react";



function Listmain(prop)
{

    return <>
    
    <div className = "container1" style = {{height:"auto",minHeight:"100vh"}}>
            
            <List header = {prop.header} switch_item = {prop.switch_item}/>
        </div>
       
    </>

}

// custom hook to get the user's list items

function useList(switch_item)
{
    const [list , setList] = useState([]);
            
   useEffect(()=>
   {
    if(JSON.parse(localStorage.getItem(switch_item))!==null)
    {
        setList(JSON.parse(localStorage.getItem(switch_item)));
        
    }
   } , [switch_item])
    return [list,setList];
}


function List(props)
{
    const {header,switch_item} = props;
    const [isempty,setIsempty] = useState(false);
    const [list,setList] = useList(switch_item);


    const [stat,setStat] = useState("");
    //* sorting by options
    const options = [
        { genre_id: 1, name: "Favourite", _name: "fav" },
        (switch_item !== "character") ? { genre_id: 2, name: "Score", _name: "score" } : {}

    ];


    const clearlist =()=> 
    {
        
        localStorage.removeItem(switch_item);

        setIsempty(true);
       
    }

    //*when ever component mounts check if the list is empty
    const checkListempty = React.useCallback(()=>
    {
      if (JSON.parse(localStorage.getItem(switch_item)) === null) {
          setIsempty(true);
         
      }
      else
      {
        setIsempty(false);
      }
    },[switch_item])

    useEffect(()=>
    {
     
      checkListempty();

    },[checkListempty])


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
                
                //* dropdown for sort by.....
                <Dropdown options={options} setID={setStat}  placeholder = "Sort by..." stats_anime = {switch_item}/>

            </div>
            <button className="clr-btn" type="button" onClick={clearlist}><span><i className="fas fa-times"></i></span> <span>Clear list</span></button>
        </div>
       
            <ul className = "search-container">
            
            {(list.length>0 && !isempty) ? 
                list.map((item)=>
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
            <h3 className="empty">{(isempty)?"Empty list":""}</h3>
            }
        
        </ul>

        <div style={{height:"150px"}}></div>
    </>
}


export default Listmain;