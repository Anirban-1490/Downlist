import react, { useCallback } from "react";
import "./animestyle.css";
import "./topanimestyle.css";
import { useEffect, useState ,useContext,useRef} from "react";
import {Mulimgslider} from "./mul_img_slider";
import { Link } from "react-router-dom";
import { useQuery,useQueries } from "react-query";
import axios from "axios";
import { Spinner } from "./loading-spinner";
import each from "awaity/each";

const year = new Date().getFullYear();

function TopanimeMain()
{

  
    
 
   

    const fetchQuery = (url)=>
    {
        return axios.get(url).then(res=>[...res.data.top].slice(0,16));
    }

    const results = useQueries([{queryKey:"upcoming_anime",queryFn:()=>fetchQuery("https://api.jikan.moe/v3/top/anime/1/upcoming"),retry:false,staleTime:Infinity,cacheTime:Infinity},
    {queryKey:"popular_anime",queryFn:()=>fetchQuery("https://api.jikan.moe/v3/top/anime/1/bypopularity"),retry:false,staleTime:Infinity,cacheTime:Infinity} , 
    {queryKey:"airing_anime",queryFn:()=>fetchQuery("https://api.jikan.moe/v3/top/anime/1/airing"),retry:false,staleTime:Infinity,cacheTime:Infinity}])

    // console.log(results);
    let temparray=null ;
    const [listitem , setListitem] = useState([]);
    const [listcount,setListcount] = useState(0);
    temparray = JSON.parse(localStorage.getItem("anime"));
    
    if(temparray)
    {
        temparray = [...temparray].sort((a, b) => b.score - a.score).slice(0, 3);
       
    }
    
    const delay = (ms = 3000) => new Promise(r => setTimeout(r, ms));
     async function fetch_list_anime()
    {
       

        if(temparray)
        {
            setListcount(temparray.length);
            await each(temparray,async (item) => {
                const { malid, img_url, title } = item;
                    await delay();
                    await fetch(`https://api.jikan.moe/v3/anime/${malid}`).then(async res => await res.json()).then((result) => {
                        console.log("helloeeeeee");
                        const { synopsis } = result;
                        setListitem((item) => [...item, { malid, img_url, title, about: synopsis }]);
                    }).catch(err => console.log(err));
            })
           
        }
    }

    useEffect(()=> fetch_list_anime() , []);
    
    

    return <>  
        {(results.every(item => item.isLoading) || listitem.length<listcount) ? <Spinner/>
            : results.some(item => item.isError) ? <h2 style={{ color: "red", position: "relative", zIndex: "22" }}>Error</h2>
                : <div className="container1" style={{ height: "1300px" }}>

                    <div className="section-1">
                        <Header content={{ text: ["An", "l", "me", "WORLD"], isanimateable: true, subtext: "it's anime EVERYWHERE..." }} />
                         <Currentlyairing airing={results[2].data} count={16} text_={["Top", "Airing"]} />
                        <div className="cotntext-1">
                            <span><h2>See the</h2></span>
                            <span><h2>upcomings</h2></span>
                        </div>
                    </div>
                    <div className="section-2">

                       <Upcoming upcoming={results[0].data} count={16} text_={["Top Upcom", "ing"]} />
                        <div className="cotntext-2">
                            <span><h2>Meet the</h2></span>
                            <span><h2>popular</h2></span>
                            <span><h2>Kids</h2></span>
                        </div>
                    </div>
                    <div className="section-3" >

                        <Toppopular popular={results[1].data} count={16} text_={["Most", "pop", "ular"]} />
                        <div className="cotntext-3">
                            <span><h2>What's On Your</h2></span>
                            <span><h2>Inventory?</h2></span>
                        </div>
                    </div>
                    <div className="section-4">
                        {(listitem  && results.every(item=>!item.isLoading)) ? <TopofyourList listitem={listitem} text_={"Top anime from your list"} /> : ""}
                    </div>
                </div>

        }
       
       {
           (results.every(item=>!item.isLoading) )? <Footer/>:""
       }
       

        </>
}

export function Header(prop)
{

    const {text,isanimateable,subtext} = prop.content;

    return <>
            <div className="head-main-container">
               <div className="inner-content">
                   <span>
                      {isanimateable &&  <div className="ball"></div>}
                       <h1>{text[0]}{isanimateable && <span className="anim-letter">{text[1]}</span>}{text[2]}</h1></span>
                   <span><h1>{text[3]}</h1></span>
               </div>
               <h3>{subtext}</h3>
            </div>
    </>
}




export function Footer(){
        return <>
            <footer>
                <ul>
                    <li><Link to="/topanime">Anime</Link></li>
                    <li><Link to="/topcharacters">Characters</Link></li>
                    <li><a href="">About</a></li>
                </ul>
                <h3>&copy;Uplist2021</h3>
            </footer>
        </>
    }
    


export const Toppopular = react.memo((prop)=>
{
    const {popular , count,text_} = prop;
    
        return <>
            <div className="airing popular">
                <h2>{text_[0]}<span>{text_[1]}</span>{text_[2]}</h2>
                <Mulimgslider items = {popular} count = {count}/>
            </div>
        </>
});

export const Upcoming = react.memo ((prop)=>
{

    const {upcoming , count ,text_} = prop;

    return <>
        <div className="airing upcoming">
            <h2>{text_[0]}<span>{text_[1]}</span></h2>
            <Mulimgslider items = {upcoming} count = {count}/>
        </div>
        </>
});

export const Currentlyairing = react.memo ((prop)=>
{
    const {airing , count,text_} = prop;
        
        return <>
            <div className="airing">
                <h2><span>{text_[0]}</span> {text_[1]}</h2>
                <Mulimgslider items = {airing} count = {count}/>
            </div>
        </>
});

export const TopofyourList  = react.memo((prop)=>
{
    const {listitem , text_} =prop;
    const handle_container = useRef();
   
    const [currnum , setCurrnum] = useState(0);
    const [offset,setoffset] = useState(0);
    const [ innerwidth , setInnerwidth]  = useState();
    const [trigger_comp , setTriggercomp] = useState(true);
    const [textanime , setTextanime] = useState(false);
    const [windowwidth,setWindowwidth] = useState(window.innerWidth);
   
    const getinnerwidth = ()=>
    {
        setInnerwidth(handle_container.current.clientWidth);
       
       if(windowwidth<650)
       {
        setTriggercomp(true);
  
       }
       else{
        setTriggercomp(false);
      
       }
    }

    //--- This will only run whenever the window size changes and using useCallback prevents unnecessary chind renders
    //---- previously without this setCurrnum or setTextanime was triggering unnecessary state render for setTriggercomp which should only happen when we change the windowsize
    // ----this function is here to to remove/add the extra detail section for the shown top from list 

    const windowSizeBreakpoint = react.useCallback(()=>
    {
        console.log("hello");
        if(window.innerWidth <650)
        {
         setTriggercomp(true);
   
        }
        else{
         setTriggercomp(false);
       
        }
    },[windowwidth])

  
    useEffect(()=>{
        const size = ()=>
        {
          if(listitem.length>0)
          {
            setInnerwidth(handle_container.current.clientWidth);
            handle_container.current.style.transition = "none";
            windowSizeBreakpoint();
            setWindowwidth(window.innerWidth);
          }

        }
        window.addEventListener("resize", size);

       
     
        let num = currnum;
        change(num);
        return ()=> window.removeEventListener("resize",size);
    })

    const gonext = () => {
        handle_container.current.style.transition = "0.4s ease-in";
        let num = currnum;
        if (num === 2) {
            num = 0;
            setCurrnum(num);
            setoffset(0);
            return;
        }
        setCurrnum(num + 1);
        
        change(num+1);
    }

    const goprev = () => {
        handle_container.current.style.transition = "0.4s ease-in";
        let num = currnum;
        if (num <= 0) {
            num = 2;
            setCurrnum(num);
          
           setoffset(-(innerwidth+20) * (num - 1));
            return;
        }
        setCurrnum(num - 1);

        change(num - 1);
    }
    function change(num) {
        setoffset(-(innerwidth+20) * num);
       
    }

  
    const textanimation_enter = ()=>
    {

        setTextanime(true);
      
    }
    const textanimation_leave = ()=>
    {

        setTextanime(false);
       
    }


        return <>
            <h2 className="top-list-header">{text_}</h2>
             {listitem.length>0 ? <div className = "top-list" >
                <button type="button" className="prev-btn" onClick={goprev}><i className="fas fa-chevron-left"></i></button>
                <button type="button" className="next-btn" onClick={gonext}><i className="fas fa-chevron-right"></i></button>
                <div className="top-list-inner">

                    <div className="top-list-item-container" ref={handle_container} onLoad={getinnerwidth} style={{left :`${offset}px`,transition:"none"}}>
                        {
                            listitem.map((item)=>
                            {
                                const {malid,img_url,about,title} = item;
                                return <div className="list-item" key={malid} >
                                    <img src={img_url} alt="" />
                                   {
                                        (trigger_comp===false) ? <div className="info">
                                            <h2>{title}</h2>
                                            <p>{(about)?(about.length > 125) ? about.substr(0, 125) + "..." : about:"No Information"}</p>
                                            <Link to={`${malid}`}  className="btn-seemore">
                                                <div className="inner-div">
                                                    <span><i className="fas fa-chevron-right"></i></span>
                                                    <span>See more</span>
                                                </div>
                                            </Link>
                                        </div> : <div className="info-sc"  onMouseEnter={textanimation_enter} onMouseLeave={textanimation_leave}>
                                            <h3 className="list-heading-sc" 
                                            style={(textanime)?{transform:"translateX(0)"}:
                                            {transform:"translateX(-120%)"}}>
                                                {(title.length>35)?title.substr(0,34)+"...":title}
                                            </h3>
                                            <p className="list-para-sc" 
                                            style={(textanime)?{transform:"translateX(0)"}:
                                            {transform:"translateX(-120%)"}}>
                                                {(about)?(about.length > 75) ? about.substr(0, 75) + "..." : about:"No Information"}
                                            </p>
                                            <Link to={`${malid}`} className="btn-seemore-sc" style={(textanime)?{top:"0"}:{top:"25%"}}>See more</Link>
                                        </div>
                                   }
                                </div>
                            })
                        }
                     
                       
                        
                    </div>
                </div>
            </div>
           : <h4 className="no-item">Empty list</h4>}
        </>
});


export default TopanimeMain;
