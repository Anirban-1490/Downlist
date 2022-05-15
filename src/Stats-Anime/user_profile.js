import  {useState,useEffect,useContext,useRef}from "react";
import {useQueryClient,useQuery} from "react-query"
import "./user_profileStyle.css";

import {Appcontext} from "./context"
import axios from "axios";
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import {Spinner} from "./loading-spinner"

TimeAgo.addDefaultLocale(en)
const timeAgo = new TimeAgo("en-US")

export const UserProfileMain = ()=>{
    const [isIDAvailable,setIDAvailable] = useState(false);
    const token = localStorage.getItem("token")
    const client = useQueryClient()
    const user = client.getQueryData(["user",token])

   

    useEffect(()=>{
        //* as soon as we get the user data from query cache 
        //* then run this 
        if(user){
            setIDAvailable(prev=>!prev);
            
        }
        
    },[user])

    function fetchUserProfile(){
       
        return axios.get(`http://localhost:4000/user/${user.userID}/profile/view`)
    }

    const {data} = useQuery(["profile",token],fetchUserProfile,{refetchOnWindowFocus:false,enabled:isIDAvailable})
  
   
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
        
       const formData = new FormData(e.target)
       
       //! use FormData only and don't convert it to a object as doing that will remove the headers provided by formData and the request will not contain the multipart/ file

      try {
       

      await axios.post(`http://localhost:4000/user/${user?.userID}/profile/update`,formData
      )
        window.location.reload()

      } catch (error) {
          console.log(error);
          changeEditState(e)

      } 
    }

    return <>
     {
            (!data?.data.user) ? <Spinner /> :
                <div className="profile-container">
                    <form ref={refForm} enctype="multipart/form-data" onSubmit={updateProfile}>
                        <SideProfile
                            windowSize={windowsize}
                            {...data?.data.user}
                            updateProfile={updateProfile}
                            
                        />
                        <Details {...data?.data.user} windowSize={windowsize} />
                        <Activity {...data?.data.user} windowSize={windowsize} />
                    </form>
                </div>
        }
        <div className="empty-container" style={{marginTop:"4em",height:"4em"}}></div>
    </>
}

const SideProfile = ({windowSize,name,bio,status,image})=>{

    const {changeEditState,editState} = useContext(Appcontext)

    return <>
        <aside className="side-profile">
            <div className="img-outer-container">
                <div className="img-container">
                    <img src={image} alt="" />
                </div>

                {
                    (editState) ? 
                    <div className="img-edit">
                        <label htmlFor="imgFile" id="label-img">
                        <ion-icon name="pencil"></ion-icon>
                        </label>
                        <input type="file" name="img" id="imgFile" hidden  />
                    </div>:""
                }

            </div>



           
            {
                (windowSize < 846) ?
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
                    {bio && <h4 className="bio"> {bio} </h4>} 
                    {status &&  <h6 className="status">{status}</h6>}
                        <button className="edit"
                            onClick={changeEditState}
                        >
                            Edit profile
                        </button>
                </div>
               :

                    <div className="inner-side-container">
                        <textarea name="bio" id="" className="bio bio-edit" cols="30" rows="10" maxLength={35} defaultValue={bio} placeholder="Custom bio..."></textarea>
                        <input type="text"
                            name="status"
                            id=""
                            className="status status-edit"
                            placeholder="Custom status..."
                            maxLength={12}
                            defaultValue ={status}
                            autoComplete="off"
                        />
                      
                        <button type="submit" className="edit save">
                        Save
                        </button>
                    </div>


             
           }
          
           
           <button className="settings">Settings</button>
        </aside>
    </>
}

const Details = ({name,windowSize})=>{
    console.log(name);
    const {editState} = useContext(Appcontext)

    return <>
      {
            (windowSize > 846) ? <article className="details">
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

const Activity = ({activity ,windowSize})=>{

    const colorsBG = {
        "Added":"#008000a7",
        "Removed" : "#a82828b3",
        "Modified" :"#6f6e6eb3",

    }
    const colorsFG = {
        "Added":"#62d262",
        "Removed" : "#e17878",
        "Modified" :"#a6a6a6",

    }
    console.log(activity);
    return <>
    <article className="activity">
       <h2>Activites in last 10 days</h2>
       <div className="activities-container">
            {
               (activity.length>0)?activity.map(({actDone,detail,doneAt})=>{

                    return <div key={doneAt} className="activity-item-container">
                        <h4 
                        style={
                            {
                                color :colorsFG[actDone],
                                backgroundColor:colorsBG[actDone]
                            }
                        }
                        >{actDone}</h4>
                        <h3>{
                            (detail.length >16)?detail.substr(0,13) +"..." : detail
                            
                            }</h3>
                        <p>{

                            (windowSize >581) ?
                            timeAgo.format(new Date(doneAt),"round"):timeAgo.format(new Date(doneAt),"mini-minute-now")
                            }</p>
                    </div>

                }): <h3 className="empty-container">Looks pretty empty...</h3>
            }

       </div>
    </article>
    </>
}


