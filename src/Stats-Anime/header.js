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
   const [isexpand,setIsexpand] = useState(false);
   const refdropmenu = useRef(null);
   const userbtn = useRef(null);

    const toggelnav = ()=>
    {
        [...document.getElementsByClassName("parts")].forEach(ele=>ele.classList.add("animate"));
        toggle(true);
    }
    

   
   // a click handler to check if the click event has appeared on the user ICON. If it's outside of that ICON then close the dropdown menu if opened 

    document.addEventListener("click",(e)=>
    {
        const inBoundary = e.composedPath().includes(userbtn.current)
        if (inBoundary) {
            if (!isexpand) {

                refdropmenu.current.style.height = "90px";
                setIsexpand(true);
            }
            else {
                refdropmenu.current.style.height = "0px";
                setIsexpand(false);
            }
        }
        else {
            refdropmenu.current.style.height = "0px";
            setIsexpand(false);
        }
    })

    return(
        <>
            <div className = "nav-container">
                <Link to="/" className="logo-container"><h3>Uplist</h3></Link>
                <ul >
                    <nav><Link className="link" to="/topanime">Anime</Link></nav>
                    <nav><Link className="link" to="/topcharacters">Characters</Link></nav>
                    <nav>About</nav>
                </ul>
                <i className="fas fa-user" ref={userbtn}>
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