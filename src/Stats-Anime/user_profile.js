import react ,{useState,useEffect,useContext}from "react";
import {useQueryClient} from "react-query"
import "./user_profileStyle.css";

import {Appcontext} from "./context"

export const UserProfileMain = ()=>{


    const client = useQueryClient()
    const data = client.getQueryData("user")


    const [windowsize,setWindowSize] = useState(window.innerWidth)

    useEffect(()=>{
        window.addEventListener("resize",()=>{
            setWindowSize(window.innerWidth)
        })

        return ()=>{
            window.removeEventListener("resize",()=>{
                setWindowSize(window.innerWidth)
            })
        }
    })

    return <>
      <div className="profile-container">
            <form action="">
                <SideProfile windowSize = {windowsize} {...data}/>
                <Details {...data} windowSize = {windowsize} />
                <Activity />
            </form>
      </div>
      <div className="empty-container" style={{marginTop:"4em",height:"4em"}}></div>
    </>
}

const SideProfile = ({windowSize,name})=>{

    const {changeEditState,editState} = useContext(Appcontext)

    return <>
        <aside className="side-profile">
            <div className="img-container"></div>
            {
                (windowSize < 785) ?
                    (!editState) ? <h2  className="username username-nonedit" >
                        {name}
                    </h2> : <input type="text"
                        name="name"
                        id=""
                        className="username username-edit"
                        value={name}
                        
                    />
                :""
            }
           {
               (!editState)?
                <div className="inner-side-container">
                     <h4 className="bio">  </h4>
                     <h6 className="status">Custom status...</h6>
                        <button className="edit"
                            onClick={changeEditState}
                        >
                            Edit profile
                        </button>
                </div>
               :

                    <div className="inner-side-container">
                        <textarea name="bio" id="" className="bio bio-edit" cols="30" rows="10" maxLength={35} ></textarea>
                        <input type="text"
                            name="status"
                            id=""
                            className="status status-edit"
                            placeholder="Custom status..."
                            maxLength={12}
                        />
                        <button className="edit save"
                            onClick={changeEditState}
                        >
                            Save
                        </button>
                    </div>


             
           }
          
           
           <button className="settings">Settings</button>
        </aside>
    </>
}

const Details = ({name,windowSize})=>{

    const {editState} = useContext(Appcontext)

    return <>
      {
            (windowSize > 785) ? <article className="details">
                {
                    (!editState) ? <h2 className="username username-nonedit" >
                        {name}
                    </h2> : <input type="text"
                        name="name"
                        id=""
                        className="username username-edit"
                        value={name}

                    />
                }

            </article> : null
      }
    </>
}

const Activity = ()=>{

    return <>
    <article className="activity">
       <h2>Activites in last 10 days</h2>
       <div className="activities-container">

       </div>
    </article>
    </>
}


