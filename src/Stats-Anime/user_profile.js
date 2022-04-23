import react ,{useState,useEffect,useContext,useRef}from "react";
import {useQueryClient} from "react-query"
import "./user_profileStyle.css";

import {Appcontext} from "./context"

export const UserProfileMain = ()=>{

    
    const client = useQueryClient()
    const data = client.getQueryData("user")
  
    
    const refForm = useRef();
    const {changeEditState} = useContext(Appcontext)

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

    const updateProfile = (e)=>{
    //     console.log(e);
    //     e.preventDefault()
    //    const formData = new FormData(refForm.current)
    //     console.log(...formData);
    //     changeEditState()
    }

    return <>
      <div className="profile-container">
            <form ref={refForm}>
                <SideProfile windowSize = {windowsize} {...data} updateProfile = {updateProfile}/>
                <Details {...data} windowSize = {windowsize} />
                <Activity />
            </form>
      </div>
      <div className="empty-container" style={{marginTop:"4em",height:"4em"}}></div>
    </>
}

const SideProfile = ({windowSize,name,updateProfile})=>{

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
                        defaultValue={name}
                        maxLength={18}
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
                            onClick={updateProfile}
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
    console.log(name);

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
                        defaultValue={name}
                        maxLength={18}
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


