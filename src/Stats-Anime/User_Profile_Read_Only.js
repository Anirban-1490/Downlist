import axios from "axios"
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

import "./User_Profile_Read_Only_Style.css";



export const ReadOnlyProfileMain =()=>{
    const{userID} = useParams();

    const fetchDetails = async()=>{
        return (await axios.get(`http://localhost:4000/user/${userID}/profile/view`)).data
    }


    const {data,isLoading,isError} = useQuery(["follow",userID],fetchDetails,{refetchOnWindowFocus:false})
    console.log(data);
    return <>
    <ReadOnlyProfile {...data?.user} />
    </>
}

const ReadOnlyProfile = ({name,image,bio,followers,following,top})=>{


    return <>
        <div className="container-profile">
                <div className="img-container">
                    <img src={image} alt="" />
                </div>
                <h2 className="name">{name}</h2>
               {bio &&  <h4 className="bio">{bio}</h4>}
               <div className="follow-container">
                   <h5 className="follow">{followers?.length} Followers</h5>
                   <h5 className="follow">{following?.length} Following</h5>
               </div>
               <button className="follow-btn">Follow</button>

               <div className="picks-container">
                   <h4>Top Picks</h4>
                   <div className="picks-container-inner">
                       {
                           top || <p>Very muuuuuchhhh empty...</p>
                       }
                   </div>
               </div>
        </div>
    </>
}