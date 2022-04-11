import { useQuery,useQueryClient } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const useAuth = (isenabled,redirect=false)=>{

   //? custom hook to check if user is logged in or not when routing to any page
   
    const navigate = useNavigate()

    const authorizeUser = ()=>{
        const token = localStorage.getItem("token")
        return axios.get("http://localhost:4000/api/v1/auth/authorize",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }).then(res=>res.data)
    }
    
    const {data} =  useQuery(`user`,()=>authorizeUser(),{refetchOnWindowFocus:false,
        onSettled:(data,err)=>{
        if(err){
           return console.log(err?.response?.data);
            
        }
        if(redirect) return navigate("/",{replace:true})
    },enabled:!! isenabled

})
    

    return data
}

