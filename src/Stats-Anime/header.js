import react from "react";
import "./header-style.css";
import { useEffect , useState , useRef ,useContext} from "react";
import { Link } from "react-router-dom";
import {Appcontext} from "./context";


 function Main()
{
    


    return (
        <>
            <Smallnav/>    
             <Header/>
        </>
    );
}




export function Header()
{

   const {ishamclick,toggle} = useContext(Appcontext);

    const toggelnav = ()=>
    {
        [...document.getElementsByClassName("parts")].forEach(ele=>ele.classList.add("animate"));
        toggle(true);
    }
    


    const refdropmenu = useRef(null);
    let drop = true;
    function toggledropmenu()
    {
       if(!drop)
       {
            refdropmenu.current.style.height = "0px";
            drop =true;
       }
       else
       {
            refdropmenu.current.style.height = "90px";
            drop =false;
       }
    }
    return(
        <>
            <div className = "nav-container">
                <Link to="/" className="logo-container"><h3>Uplist</h3></Link>
                <ul>
                    <li><Link to="/topanime">Anime<span></span></Link></li>
                    <li><Link to="/topcharacters">Characters<span></span></Link></li>
                    <li><a href="">About<span></span></a></li>
                    
                </ul>
                <i className="fas fa-user" onClick = {toggledropmenu}>
                    <div className = "yourlist" ref = {refdropmenu}>
                        
                        <Link to="useranimelist">
                            <button  className = "your-anime" >
                                Anime list
                            </button>
                        </Link>
                        <Link to="usercharacterlist">
                            <button  className = "your-anime" >
                                Character list
                            </button>
                        </Link>
                    </div>
                </i>

                <i className={`fas fa-bars menutoggle ${(ishamclick)?"toggle-style-ham":""}`} onClick ={toggelnav} ></i>

            </div>
        </>
    )
}



 export function Smallnav()
{
   
    const clickhandler = ()=>{
        [...document.getElementsByClassName("parts")].forEach(ele => ele.classList.remove("animate"));
        toggle(false);
    }
   
    const {ishamclick,toggle} = useContext(Appcontext);

    return <>
        <div className="smallnav" style={(ishamclick)?{width:"100%",transition:" all 0.24s"}:{width:"0",transition:" all 0.24s 1.7s"}}>

                <i className="fas fa-times" style={(ishamclick)?{opacity:"1"}:{opacity:"0",transition:"none"}} onClick = { ()=>{
                 [...document.getElementsByClassName("parts")].forEach(ele => ele.classList.remove("animate"));
              
                toggle(false);
                
                }}></i>
                <div className="smallnav-parts-container">
                    <div className="parts part-1 anime-default" style={{"--i":"1"}}></div>
                    <div className="parts part-2 anime-default" style={{"--i":"2"}} ></div>
                    <div className="parts part-3 anime-default" style={{"--i":"3"}}></div>
                    <div className="parts part-4 anime-default" style={{"--i":"4"}}></div>
                </div>
                <div className="smallnav-nav-container" style={(ishamclick)?{opacity:"1",transition: "all 0s 0.56s"}:{opacity:"0",transition:"all 0s 0.45s"}}>
                   <div className="smallnav-nav">
                    <Link className="navlink" onClick={clickhandler} to="/topanime">Anime</Link>
                    <Link className="navlink" onClick={clickhandler} to="/topcharacters">Characters</Link>
                    <Link onClick={clickhandler} className="navlink" to="/about">About</Link>
                   </div>
                   <div className="smallnav-userlist">
                        <h3>User's List</h3>
                        <div className="smallnav-list-nav">
                        <Link className="navlink" to="useranimelist" onClick={clickhandler}>
                           Anime List
                        </Link>
                        <Link className="navlink" to="usercharacterlist" onClick={clickhandler}>
                           Character List
                        </Link>
                        </div>
                   </div>
                </div>
        </div>
    </>
}


export default Main;