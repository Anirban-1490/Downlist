import React from "react";
import "./animestyle.css";
import { useEffect ,useState , useRef} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {Appcontext} from "./context";
import { useContext } from "react";
import react from "react";
import Fog from 'vanta/dist/vanta.fog.min'

function Main()
{

    const mydiv = useRef()
    const [vantaEffect, setVantaEffect] = useState(0)
    //* Vanta.js fog animated background initializer

    useEffect(() => {
      if (!vantaEffect) {
          setVantaEffect(Fog({
              el: mydiv.current, highlightColor: 0xe2b34,
              midtoneColor: 0x98368b,
              lowlightColor: 0x9285cf,
              baseColor: 0x148b93,
              speed: 1.30,
              zoom: 0.60
          }))
        
      }
      return () => {
        if (vantaEffect) vantaEffect.destroy()
      }
    }, [vantaEffect])

   
    return (
        
        <>
            
            <div className="container1" 
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: "scaleY(1.15)",
                    top: "-50px",
                    height: "110vh"
                }} 
            ref={mydiv} >
              
                <Content/>
            </div>
            
        </>
    );
}



function Content()
{
    const {toggle_loading_state,loading,set_loading_text} = useContext(Appcontext);
    const [keyward , setKeyward] = useState("");
    const [searchresult , setSearchresult] = useState([]);


    const searchContainer = useRef();
    const mainheader= useRef();
    const mainionfo = useRef();
    const wrapper = useRef();
    

   //* set up a axios cancel token
    const [cancel,setcancel] = useState(axios.CancelToken.source());
   
    //* show the live search result
    const getResult = react.useCallback(()=>
    {
        if(keyward!=="")
        {   
            let can = cancel;
            setSearchresult([]);
            toggle_loading_state(true); //*show loading text
            set_loading_text("Loading...");
            searchContainer.current.classList.remove("search-result-container-toggle");
            mainheader.current.classList.remove("title1-toggle");
            mainionfo.current.classList.remove("info1-toggle");
            wrapper.current.classList.remove("wrapper-toggle");


            if(can)
            {
                can.cancel("token canceled");
            }
            can = axios.CancelToken.source(); //*create a new token
            setcancel(can); 

             axios.get(`https://api.jikan.moe/v3/search/anime?q=${keyward}&page=1`, { cancelToken: can.token })
             .then(res =>
             {
                 setSearchresult([...res.data.results].slice(0, 4));
                 toggle_loading_state(false); 
             })
            .catch(err => {
                console.log(err);
                set_loading_text("No results")
            });
        }
        else
        {
           
            searchContainer.current.classList.add("search-result-container-toggle");
            mainheader.current.classList.add("title1-toggle");
            mainionfo.current.classList.add("info1-toggle");
            wrapper.current.classList.add("wrapper-toggle");
            setKeyward("");
            setSearchresult([]);
        }

    },[keyward])



    useEffect(() => getResult()
        , [getResult]);




    return <>

        <div className="main-container">
            <h2 className="title1" ref={mainheader}><span>S</span>earch an <span>A</span>nime</h2>
            <p className="info1" ref={mainionfo}>Check details about your favourite anime</p>
            <div className="wrapper" ref={wrapper}>

                <input type="text" name="" id="search" 
                    placeholder="Search e.g. naruto ,fate"
                    value={keyward} autoComplete="off"
                    onChange={(e) => 
                        { e.preventDefault(); 
                            setKeyward(e.target.value)
                        }}
                />

                <span className="search-cover"></span>
                <div className="search-result-container" ref={searchContainer}>
                    {loading && <Loading />}
                    {
                        //* show the search result ----
                        searchresult.map((result) => {
                            const { mal_id, title, image_url } = result;

                            return <Link to={`anime/${mal_id}`} className="link" key={mal_id}>

                                <div className="search-result" >
                                    <div className="img-container">
                                        <img src={image_url} alt="" />
                                    </div>
                                    <h5>{title}</h5>

                                </div>

                            </Link>
                        })
                    }
                </div>

            </div>
        </div>
       
    </>
}




//* Loading text ----

function Loading()
{
    const {loadingtext} = useContext(Appcontext);
    return <>
        <h3 style = {{color:"white"}} className = "loading">{loadingtext}</h3>
    </>
}


 
export default Main;

