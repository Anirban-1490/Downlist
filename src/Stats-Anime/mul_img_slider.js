import react from "react";
import "./animestyle.css";
import "./topanimestyle.css";
import { useEffect, useState ,useContext,useRef} from "react";
import { Link,Outlet,Route,Routes } from "react-router-dom";



export const Mulimgslider =  (prop)=>
{
    const {items,count} = prop;
    const handle_container = useRef();
    const parent_handle_container = useRef();
    const [currnum, setCurrnum] = useState(0);
    const [offsetchild, setOffsetchild] = useState(0);
    const [offset, setoffset] = useState(0);
    const [btnset , Setbtn] = useState(false);
//    console.log(items);
    const img_slider_container = document.querySelector(".content-inside");
    useEffect(() => {
        const size = () => {

         
            handle_container.current.style.transition = "none";

            // --- checks how many cards have their offset left less thatn the container width meaning they are visable in the container
            const handle_parent = document.querySelector(".item-container");
            const img_slider_container = document.querySelector(".content-inside");

            let num = [...handle_container.current.children].filter((item) => item.offsetLeft <= img_slider_container.clientWidth).length;
            setOffsetchild(num);

            //-- if the last card is visable in the parent container then clicking the next button will make the parent container move to it's original position
            if(count === num)
            {
                setoffset(0);
                return;
            }

             //-- this conditions are used to recalculate how much the parent should move on resizing the window
            if (currnum !== 0 && currnum < offsetchild + 2) {
                setoffset(-170 * currnum);
               
            }
            else if (currnum === 0) {
                setoffset(-170 * (currnum));
            }
            else {
                setoffset(-170 * (num + 2));
                setCurrnum(num + 2);
            }
            return;
        }
        window.addEventListener("resize", size);

        //--- if th emain parent container is here then recalculate how many childs are visable in the container
        if(img_slider_container)
        {
            setOffsetchild([...handle_container.current.children].filter((item) => item.offsetLeft <= img_slider_container.clientWidth).length);
            
        }

        //-- a state which becomes true if we are at the initial position and clicked the previous button so the pare container moves very left to show the last card
       if(btnset)
       {
    
        setCurrnum(count - offsetchild);
        setoffset(-170 * (count- offsetchild));
     
       }
       
       


        return () => {window.removeEventListener("resize", size);Setbtn(false);}
    });

  



    const gonext = () => {
        handle_container.current.style.transition = "0.4s ease-in";
    

        let num = currnum;
        if (num+offsetchild === count) {
            num = 0;
            setCurrnum(num);
            handle_container.current.style.left = "0";
            return;
        }
        setCurrnum(num + 1);

        change(num + 1);

    }

    const goprev = () => {
        handle_container.current.style.transition = "0.4s ease-in";
      
        let num = currnum;
       
        if (num <= 0) {
            Setbtn(true);
            num = offsetchild;
 
            return;
        }
  
        setCurrnum(num - 1);
       
        change(num - 1);
    }
    function change(num) {
        setoffset(-170 * num);
    }


    return <>
        <div className="content-inside" ref={parent_handle_container}>
            <button type="button" className="next-btn" onClick={gonext}><i className="fas fa-chevron-right"></i></button>
            <button type="button" className="prev-btn" onClick={goprev}><i className="fas fa-chevron-left"></i></button>
            <ul ref={handle_container} style={{ left: `${offset}px` }}
                className="item-container">
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

                            <div className="airing_container">
                                {(image_url)?<img src={image_url} alt="" />:""}
                                <div className="more">
                                    <h4>{title}</h4>
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
