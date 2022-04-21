import react from "react";
import {useQueryClient} from "react-query"
import "./user_profileStyle.css";

export const UserProfileMain = ()=>{


    const client = useQueryClient()
    const data = client.getQueryData("user")

    return <>
      <div className="profile-container">
            <form action="">
                <SideProfile />
                <Details {...data} />
                <Activity />
            </form>
      </div>
      <div className="empty-container" style={{marginTop:"4em",height:"4em"}}></div>
    </>
}

const SideProfile = ()=>{


    return <>
        <aside className="side-profile">
            <div className="img-container"></div>
           <textarea name="bio" id="bio" cols="30" rows="10" maxLength={35} disabled></textarea>
        </aside>
    </>
}

const Details = ({name})=>{

    return <>
        <article>
           <input type="text" 
           name="name" 
           id="username" 
           value={name}
           disabled
           />
           <input type="text" 
           name="status" 
           id="status" 
           placeholder="Custom status..."
           disabled
           />
        </article>
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


