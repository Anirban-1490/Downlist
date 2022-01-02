import react ,{useEffect,useState} from "react";
import { Link  } from "react-router-dom";
import { useParams } from "react-router-dom";
import "./seacrh-style.css";
import { useQuery } from "react-query";



function Searchmain(prop)
{

    return <>
    
    <div className = "container1" style = {{height:"auto",minHeight:"100vh"}}>
            
            <Search header = {prop.header} switch_item = {prop.switch_item}/>
        </div>
       
    </>

}


function Search(props)
{
    const {header,switch_item} = props;
    
    const [list , setList] = useState([]);
    const [isempty,setIsempty] = useState(false);
    function get_list()
    {
        if(switch_item === "anime")
        {
            setList([]);
            
            if(JSON.parse(localStorage.getItem("item"))!==null)
            {
                setList(JSON.parse(localStorage.getItem("item")));
                
            }
            setIsempty(true);
        }
        else if(switch_item === "char")
        {
            setList([]);

            if(JSON.parse(localStorage.getItem("item_char"))!==null)
            {
                setList(JSON.parse(localStorage.getItem("item_char")));
               
            }
            setIsempty(true);
            
        }
    }

    useEffect(()=> get_list(),[switch_item] );
    
 

    const clearlist =()=> 
    {
        setList([]);
        if(switch_item === "anime")
        {
            localStorage.removeItem("item");
            
            setIsempty(true);
        }
            
        else if(switch_item === "char")
        {
            localStorage.removeItem("item_char");
            setIsempty(true);
        }
            
    }
    useEffect(()=>
    {
       
        if(switch_item === "anime")
        {
            
            if(JSON.parse(localStorage.getItem("item"))===null)
            {
                setIsempty(true);
            }
        }
        else if(switch_item === "char")
        {
            if(JSON.parse(localStorage.getItem("item_char"))===null)
            {
                setIsempty(true);
            }
        }
            

    },[isempty])



    return <>
        <h2 className = "header">{header}</h2>
        <button className="clr-btn" type = "button" onClick={clearlist}><span><i className="fas fa-times"></i></span> <span>Clear list</span></button>
        {
            (switch_item === "anime")? <ul className = "search-container">
            
            {(list.length>0) ? 
                list.map((item)=>
                {
                    const {fav,malid,episodes,img_url,score,title} = item;

                    return <Link to ={`/anime/${malid}`} key ={malid} className="items-container">

                    <li key ={malid}>
                        <div className = "img-container">
                            <img src={img_url} alt="" />
                        </div>
                        <div className = "details">
                            <div className="title"><h4>{(title.length>35)?title.substr(0,35)+"...":title}</h4></div>
                            <div className="stats">
                            <h4>{(score)?score:"0.0"}</h4>
                            <h4><i style={{marginRight:"10px",color:"yellow"}} className="fas fa-star"></i>{fav}</h4>
                            <h4><i style={{marginRight:"10px"}} className="fas fa-tv"></i>{(episodes)?episodes:"0"}</h4>
                            </div>
                        </div>
                    </li>
                    </Link>
                })
            :
            <h3 className="empty">{(isempty)?"Empty list":""}</h3>
            }
        
        </ul>
        :
        <ul className = "search-container">
            
        {
            (list.length>0)? list.map((item)=>
            {
                const {fav,malid,img_url,title} = item;

                return <Link to ={`/character/${malid}`} key ={malid} className="items-container">

                <li >
                    <div className = "img-container">
                        <img src={img_url} alt="" />
                    </div>
                    <div className = "details">
                            <div className="title"><h4>{title}</h4></div>
                            <div className="stats">
                               
                                <h4><i style={{ marginRight: "10px", color: "yellow" }} className="fas fa-star"></i>{fav}</h4>
                                
                            </div>
                        </div>
                </li>
                </Link>
            }):
            <h3 className="empty">{(isempty)?"Empty list":""}</h3>
        }
    
        </ul>       
        }

        
        <div style={{height:"150px"}}></div>
    </>
}


export default Searchmain;