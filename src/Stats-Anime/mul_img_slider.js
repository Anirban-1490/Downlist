import react from "react";
import "./animestyle.css";
import "./topanimestyle.css";
import { useEffect, useState ,useContext,useRef} from "react";
import { Link } from "react-router-dom";



export const Mulimgslider =  (prop)=>
{
    const {items,count} = prop;
    const handle_container = useRef();
    const parent_handle_container = useRef();
    const img = useRef();
    const moreinfo = useRef();
    const [offsetx , setoffsetx] = useState(0);
    const [pressed ,ispressed] = useState(false);

    useEffect(() => {
        const size = () => {

        }
        window.addEventListener("resize", size);


       
        window.addEventListener("mouseup", () => {
           
            ispressed(false);
        })


        return () => {window.removeEventListener("resize", size);}
    });

  


    function mousemovefn(e)
    {
        if (!pressed) {
            return;

        }
            e.preventDefault();
            handle_container.current.style.left = `${e.nativeEvent.offsetX - offsetx}px`;
            boundery();

    }
    
    function boundery()
    {
        let outerparent = parent_handle_container.current.getBoundingClientRect();
        let innerparent = handle_container.current.getBoundingClientRect();
       
        if(parseInt(handle_container.current.style.left)>0)
        {
           handle_container.current.style.left ="0px";
          
        }
        else if(innerparent.right <outerparent.right)
        {
           
            handle_container.current.style.left = `${-(innerparent.width - outerparent.width)}px`;
        }
    }



   
    return <>
        <div className="content-inside" ref={parent_handle_container} onMouseDown={(e)=>
        {
           setoffsetx(e.nativeEvent.offsetX - handle_container.current.offsetLeft)
            e.currentTarget.style.cursor = "grabbing";
            e.preventDefault();
            ispressed(true);
            
        }}
        
        onMouseEnter={e=>
        {
            e.currentTarget.style.cursor = "grab";
        }}
        onMouseUp={e=>
        {
            e.currentTarget.style.cursor = "grab";
           
        }}
        
        onMouseMove={(e)=>
        {
            mousemovefn(e)
        }}
        

        >
            <ul ref={handle_container} 
                className="item-container" style={{width:`${items && (items.length *160)}px`}}>
                    {items && items.map((anime) => {
                        const { image_url, mal_id, title, episodes, score, favorites } = anime;
                        let color = "black";

                        if(score!==null && score!==0)
                        {
                            if (score > 7.5) {
                                color = "green";
                            }
                            else if (score < 7.5 && score > 6) {
                                color = "yellow";
                            }
                            else {
                                color = "red";
                            }
                        }
                        return <li key={mal_id}>

                            <div className="airing_container" >
                                {(image_url)?<img src={image_url} ref={img} alt="" />:""}
                                <div className="more" ref={moreinfo}>
                                    <h4>{(title)?(title.length>45)?title.substr(0,45)+"...":title:""}</h4>
                                    {favorites && <span><i className="fas fa-star"></i>: {favorites}</span>}
                                    {episodes && <span><i className="fas fa-tv"></i>: {episodes}</span>}
                                    {(score && score !== 0) ? <p className="score">Score: <span style={{ color: `${color}` }}>{score}</span></p> : ""}
                                    <Link to={`${mal_id}`} className="details-anime-btn"  >See more</Link>
                                </div>
                            </div>

                        </li>
                    })}
            </ul>
        </div>
    
    </>
}
