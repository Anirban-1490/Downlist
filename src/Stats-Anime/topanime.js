import React, { useLayoutEffect } from "react";
import react from "react";
import "./animestyle.css";
import "./topanimestyle.css";
import { Genres } from "./genres-anime";
import { useEffect, useState ,useRef,useCallback} from "react";
import {Mulimgslider} from "./mul_img_slider";
import { Link } from "react-router-dom";
import { useQueries ,useQueryClient} from "react-query";
import axios from "axios";
import { Spinner } from "./loading-spinner";
import each from "awaity/each";
import {Errorpage} from "./error";
import {useList} from "./list-user"

const year = new Date().getFullYear();


//* --- custom hook for fetching top anime/character from the user list

export function useToplist(switch_item,userID)
{
    
    const [listitem , setListitem] = useState([]);
    const [listCount,setListcount] = useState(0);

    
   
    //* get users saved anime or character list
    let {data} = useList(switch_item,userID,"fav")

    let userList = data?.pages[0].list;
    console.log(userList);
    //* this is used so that the data don't get lost at a rerender
    const listData = useRef();
    
   
    const delay = (ms = 2000) => new Promise(r => setTimeout(r, ms));


    const fetchTopItemFromList = useCallback(async()=>{

        if(userList)
        {
            //*sort the data based on score or favorite
            listData.current = userList.sort((a, b) => (a.score)?b.score - a.score:b.fav - a.fav).slice(0, 3);
            setListcount(listData.current?.length);
            let temparray =[];

            await each(listData.current,async (item) => {

                //*for each entry fetching some additional details from the API
                const { malid, img_url, title } = item;

                const response = await axios(`https://api.jikan.moe/v3/${switch_item}/${malid}`)
                const result = await response.data;
                temparray = [...temparray,{ malid, img_url, title, about: (switch_item === "anime") ? result.synopsis : result.about }]
                
                await delay();
            })

            setListitem(temparray);
           
        }
    },[userList,switch_item])

    useLayoutEffect(()=> {

    
        fetchTopItemFromList()


    } , [fetchTopItemFromList]);
    return [listitem,listCount]
    
}


function TopanimeMain()
{
    const client = useQueryClient();
    const token = localStorage.getItem("token")
    const user = client.getQueryData(["user",token])
    

    const fetchQuery = (url)=>
    {
        return axios.get(url).then(res=>[...res.data.top].slice(0,16));
    }

    const results = useQueries([{queryKey:"upcoming_anime",
        queryFn:()=>fetchQuery("https://api.jikan.moe/v3/top/anime/1/upcoming"),
        retry:false,refetchOnWindowFocus:false
        
    },
    {queryKey:"popular_anime",
        queryFn:()=>fetchQuery("https://api.jikan.moe/v3/top/anime/1/bypopularity"),
        retry:false,refetchOnWindowFocus:false
       
    } , 
    {queryKey:"airing_anime",
        queryFn:()=>fetchQuery("https://api.jikan.moe/v3/top/anime/1/airing"),
        retry:false,refetchOnWindowFocus:false
       
    }])

    
    
    

    return <>  
        {(results.some(item => item.isFetching) ) ? <Spinner/>
            : results.some(item => item.isError) ? <Errorpage/>
                : <div className="container1" style={{ height: "1300px" }}>

                    <div className="section-1">
                        <Header content={{ text: ["An", "l", "me", "WORLD"], isanimateable: true, subtext: "it's anime EVERYWHERE..." }} />
                         <Currentlyairing airing={results[2].data} switch_details={"/anime"} text_={["Top", "Airing"]} />
                        <div className="cotntext-1">
                            <span><h2>See the</h2></span>
                            <span><h2>upcomings</h2></span>
                        </div>
                    </div>
                    <div className="section-2">

                       <Upcoming upcoming={results[0].data} switch_details={"/anime"} text_={["Top Upcom", "ing"]} />
                        <div className="cotntext-2">
                            <span><h2>Meet the</h2></span>
                            <span><h2>popular</h2></span>
                            <span><h2>Kids</h2></span>
                        </div>
                    </div>
                    <div className="section-3" >

                        <Toppopular popular={results[1].data} switch_details={"/anime"} text_={["Most", "pop", "ular"]} />
                        <div className="cotntext-3">
                            <span><h2>What's On Your</h2></span>
                            <span><h2>Inventory?</h2></span>
                        </div>
                    </div>
                    <div className="section-4">
                        {(results.every(item=>!item.isLoading)) ? <TopofyourList  text_={"Top anime from your list"} switch_details = {"/anime"} userId ={user?.userID}/> : ""}
                    </div>
                    <section className="section-5">
                        <Genres/>
                    </section>
                </div>

        }
       
       {  (results.some(item => item.isLoading) )?"":<Footer marginTop = "2009"/>}
       

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




export function Footer( {marginTop}){
        return <>
            <footer style={{marginTop:`${marginTop}px`}}>
                <ul>
                    <li><Link to="/topanime">Anime</Link></li>
                    <li><Link to="/topcharacters">Characters</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
               <div className="border"></div>
                <div className="important-links">
                    <h3>Report a bug <a href="https://github.com/Anirban-1490/Project-Uplist" target="_blank" rel="noreferrer"><i class="fab fa-github"></i></a></h3>
                    <h3>&copy;Uplist{year}</h3>
                </div>
            </footer>
        </>
    }
    

    //* top popular section

export const Toppopular = react.memo((prop)=>
{
    const {popular , switch_details ,text_} = prop;
    
        return <>
            <div className="airing popular">
                <h2>{text_[0]}<span>{text_[1]}</span>{text_[2]}</h2>
                <Mulimgslider items = {popular} switch_details = {switch_details}/>
            </div>
        </>
});

//* upcoming section
export const Upcoming = react.memo ((prop)=>
{

    const {upcoming , switch_details ,text_} = prop;

    return <>
        <div className="airing upcoming">
            <h2>{text_[0]}<span>{text_[1]}</span></h2>
            <Mulimgslider items = {upcoming} switch_details = {switch_details}/>
        </div>
        </>
});

//* currently airing section

export const Currentlyairing = react.memo ((prop)=>
{
    const {airing , switch_details,text_} = prop;
        
        return <>
            <div className="airing">
                <h2><span>{text_[0]}</span> {text_[1]}</h2>
                <Mulimgslider items = {airing} switch_details = {switch_details}/>
            </div>
        </>
});

//* what's on your inventory section
export const TopofyourList  = react.memo((prop)=>
{
    const { text_ ,switch_details,userId} =prop;
    const handle_container = useRef();
    const [listitem,listCount] = useToplist("anime",userId);
   
    console.log(listitem,listCount);

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

       
        //switch to current visable slide
        let num = currnum;
        change(num);
        return ()=> window.removeEventListener("resize",size);
    })

    //* next button
    const gonext = () => {
        handle_container.current.style.transition = "0.4s ease-in";
        let num = currnum;
        if (num === listitem.length-1) {
            num = 0;
            setCurrnum(num);
            setoffset(0);
            return;
        }
        setCurrnum(num + 1);
        
        change(num+1);
    }

    //* previous button
    const goprev = () => {
        handle_container.current.style.transition = "0.4s ease-in";
        let num = currnum;
        if (num <= 0) {
            num = listitem.length-1;
            setCurrnum(num);
          
           setoffset(-(innerwidth+20) * (num - 1));
            return;
        }
        setCurrnum(num - 1);

        change(num - 1);
    }

    //move the slides
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
            
           <div className="main-list-container" style={
            {
                border:(listitem.length> 0 )?"none":"2px solid #f4f4f452"
            }
           }>

           {(listitem.length === 0 && listitem.length !== listCount) ? <Spinner/>
                : (listitem.length > 0 && listitem.length === listCount) ? <div className="top-list" >
                    <button type="button" className="prev-btn" onClick={goprev}><i className="fas fa-chevron-left"></i></button>
                    <button type="button" className="next-btn" onClick={gonext}><i className="fas fa-chevron-right"></i></button>
                    <div className="top-list-inner">

                        <div className="top-list-item-container" ref={handle_container} onLoad={getinnerwidth} style={{ left: `${offset}px`, transition: "none" }}>
                            {
                                listitem.map((item) => {
                                    const { malid, img_url, about, title } = item;
                                    return <div className="list-item" key={malid} >
                                        <img src={img_url} alt="" />
                                        {
                                            (trigger_comp === false) ? <div className="info">
                                                <h2>{title}</h2>
                                                <p>{(about) ? (about.length > 125) ? about.substr(0, 125) + "..." : about : "No Information"}</p>
                                                <Link to={(switch_details) ? switch_details + `/${malid}` : ""} className="btn-seemore">
                                                    <div className="inner-div">
                                                        <span><i className="fas fa-chevron-right"></i></span>
                                                        <span>See more</span>
                                                    </div>
                                                </Link>
                                            </div> : <div className="info-sc" onMouseEnter={textanimation_enter} onMouseLeave={textanimation_leave}>
                                                <h3 className="list-heading-sc"
                                                    style={(textanime) ? { transform: "translateX(0)" } :
                                                        { transform: "translateX(-120%)" }}>
                                                    {(title.length > 35) ? title.substr(0, 34) + "..." : title}
                                                </h3>
                                                <p className="list-para-sc"
                                                    style={(textanime) ? { transform: "translateX(0)" } :
                                                        { transform: "translateX(-120%)" }}>
                                                    {(about) ? (about.length > 75) ? about.substr(0, 75) + "..." : about : "No Information"}
                                                </p>
                                                <Link to={(switch_details) ? switch_details + `/${malid}` : ""} className="btn-seemore-sc" style={(textanime) ? { top: "0" } : { top: "25%" }}>See more</Link>
                                            </div>
                                        }
                                    </div>
                                })
                            }



                        </div>
                    </div>
         </div>
         : <h4 className="no-item">Looks pretty empty...</h4>
        }


           </div>
        </>
});


export default TopanimeMain;
