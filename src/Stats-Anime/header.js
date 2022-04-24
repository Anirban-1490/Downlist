import React from "react";
import "./header-style.css";
import {  useState , useRef ,useContext,useEffect} from "react";
import { Link,useLocation,useNavigate } from "react-router-dom";
import {Appcontext} from "./context";

import {useAuth} from "./authorize"

 function Main({children})
{
   
    const userData = useAuth(true) //* custom hook for checking if user logged in or not

    useLocation() //* used to rerender the component if we hit back button to come here

    const {changeUserData} = useContext(Appcontext)
    changeUserData(userData)

    return (
        <>
            <Smallnav/>    
             <Header data = {userData}/>
            {
              children
            }
        </>
    );
}



export function Header({data})
{
    

   const {ishamclick,toggle} = useContext(Appcontext);
   const [isexpand,setIsexpand] = useState(false);
  
   const refdropmenu = useRef(null);
   const userbtn = useRef(null);
    const navigate = useNavigate()
  
  
    const toggelnav = ()=>
    {
        [...document.getElementsByClassName("parts")].forEach(ele=>ele.classList.add("animate"));
        toggle(true);
    }
    

   
   //* a click handler to check if the click event has appeared on the user ICON. If it's outside of that ICON then close the dropdown menu if opened 

    document.addEventListener("click",(e)=>
    {
        const inBoundary = e.composedPath().includes(userbtn.current)
        if(refdropmenu.current)
        {
            if (inBoundary) {
                if (!isexpand) {
    
                    refdropmenu.current.style.height = "auto";
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
        }
    })



    const signoutHandler = ()=>{
        localStorage.removeItem("token")
        if(window.location.pathname !== "/"){

            navigate("/",{replace:true})
        }
        else window.location.reload()
    }

    return(
        <>
            <div className = "nav-container">
                <Link to="/" className="logo-container"><h3>Uplist</h3></Link>
                <ul >
                    <nav><Link className="link" to="/topanime">Anime</Link></nav>
                    <nav><Link className="link" to="/topcharacters">Characters</Link></nav>
                    <nav><Link className="link" to="/about">About</Link></nav>
                </ul>
               {
                   (data)? <i className="fas fa-user" ref={userbtn}>
                   <div className = "yourlist" ref = {refdropmenu}>
                       <h4 className="user-name">HI, <br/>{data.name}</h4>
                       <Link to={`user/${data.userID}/view`}>
                           <button  className = "your-anime" >
                               Profile
                           </button>
                       </Link>
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
                       <button className="sign-out" onClick={signoutHandler}>
                           <p>Sign out</p>
                           <ion-icon name="exit-outline"></ion-icon>
                       </button>
                   </div>
               </i> :
                <Link to="userauth" className="signup">
                    Sign in
                </Link>
               }

                <i className={`fas fa-bars menutoggle ${(ishamclick)?"toggle-style-ham":""}`} onClick ={toggelnav} ></i>

            </div>
        </>
    )
}

// mobile view navbar ------

 export function Smallnav()
{

   //*end animation after clicking a navigation link or the close button
    const clickhandler = ()=>{
        [...document.getElementsByClassName("parts")].forEach(ele => ele.classList.remove("animate"));
        toggle(false);
    }
   
    const {ishamclick,toggle} = useContext(Appcontext);

    return <>
        <div className="smallnav" style={(ishamclick)?{width:"100%",transition:" all 0.24s"}:{width:"0",transition:" all 0.24s 1.7s"}}>

                <i className="fas fa-times" style={(ishamclick)?{opacity:"1"}:{opacity:"0",transition:"none"}} onClick = { clickhandler}></i>
                <div className="smallnav-parts-container">
                    <div className="parts part-1 anime-default" style={{"--i":"1"}}></div>
                    <div className="parts part-2 anime-default" style={{"--i":"2"}} ></div>
                    <div className="parts part-3 anime-default" style={{"--i":"3"}}></div>
                    <div className="parts part-4 anime-default" style={{"--i":"4"}}></div>
                </div>
                <div className="smallnav-nav-container" style={(ishamclick)?{opacity:"1",transition: "all 0s 0.56s"}:{opacity:"0",transition:"all 0s 0.45s"}}>
                    {/* navigation links */}
                    
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