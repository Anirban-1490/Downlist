import react ,{useState,useEffect,useContext,useRef}from "react";
import {useQueryClient,useQuery} from "react-query"
import "./user_profileStyle.css";

import {Appcontext} from "./context"
import axios from "axios";

export const UserProfileMain = ()=>{

    const client = useQueryClient()
    const user = client.getQueryData("user")

    function fetchUserProfile(){
        return axios.get(`http://localhost:4000/user/${user?.userID}/profile/view`)
    }

    const {data} = useQuery("profile",fetchUserProfile,{refetchOnWindowFocus:false})
  
   
    const refForm = useRef();

    const [windowsize,setWindowSize] = useState(window.innerWidth)
    const {changeEditState} = useContext(Appcontext)

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

    const updateProfile =async (e)=>{
        e.preventDefault()
       const formData = new FormData(refForm.current)
        const tempData = Object.fromEntries(formData);

      try {
          
        await (await axios.put(`http://localhost:4000/user/${user?.userID}/profile/update`,tempData))
        window.location.reload()

      } catch (error) {
          console.log(error);
          changeEditState(e)

      }

       
    }

    return <>
      <div className="profile-container">
            <form ref={refForm}>
                <SideProfile 
                windowSize = {windowsize} 
                {...data?.data.user} 
                updateProfile = {updateProfile}
                />
                <Details {...data?.data.user} windowSize = {windowsize} />
                <Activity />
            </form>
      </div>
      <div className="empty-container" style={{marginTop:"4em",height:"4em"}}></div>
    </>
}

const SideProfile = ({windowSize,name,bio,status,updateProfile})=>{

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
                     <h4 className="bio"> {bio} </h4>
                     <h6 className="status">{status}</h6>
                        <button className="edit"
                            onClick={changeEditState}
                        >
                            Edit profile
                        </button>
                </div>
               :

                    <div className="inner-side-container">
                        <textarea name="bio" id="" className="bio bio-edit" cols="30" rows="10" maxLength={35} defaultValue={bio}></textarea>
                        <input type="text"
                            name="status"
                            id=""
                            className="status status-edit"
                            placeholder="Custom status..."
                            maxLength={12}
                            defaultValue ={status}
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


