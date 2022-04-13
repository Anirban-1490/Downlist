import {useRef,useEffect,useState,useReducer} from "react";
import "./signup.css"
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { useQuery} from "react-query";
import { useAuth } from "./authorize";

export const SignupMain = () => {

    const container_to_move = useRef()
    const [errors,setError] = useState({})
    const [isErrorMessageVisable,showErrorMessage] = useState(false);
  const [isAuthorize,setAuth] = useState(false)

  
    useAuth(isAuthorize,true)

 
    //* handler for switching between signup and sign in form
    const changeBtn  = function(e){
        e.preventDefault();
        const left_pos = getComputedStyle(container_to_move.current).left;
        
       
        if(left_pos.includes("0px")){
            container_to_move.current.style.left = "-109.5%"
        }
        else{
            container_to_move.current.style.left = "0"
        }
    };

    //* handler for that eye button for showing password

    const showPwd = function(e){
        e.preventDefault()
      
        const type = e.target.parentElement.previousSibling.type
        if(type == "password"){
            e.target.parentElement.previousSibling.type = "text";
            e.target.parentElement.innerHTML =`<ion-icon name="eye-off-outline"></ion-icon>`;
        } 
        else{
            e.target.parentElement.previousSibling.type = "password";
            e.target.parentElement.innerHTML =`<ion-icon name="eye-outline"></ion-icon>`;
        }
       
    }


    const formHandler = async(formName,e)=>{
        e.preventDefault();
        
        showErrorMessage(false)


        e.target.innerHTML = "Loading..."
        const formData = new FormData(e.target.parentElement);
        const userInfo = Object.fromEntries(formData)
        
        try {
            let response;

            //* for signup form request
            if(formName === "signup"){
                response = await axios.post("http://localhost:4000/api/v1/auth/signup",userInfo)
                
            }
            else if(formName === "signin"){
                response = await axios.post("http://localhost:4000/api/v1/auth/signin",userInfo)
            }
            
            //* store the token in localstorage
            const token = response.data.token;
            localStorage.setItem("token",token);
            setAuth(true)

            

        } catch (error) {
            showErrorMessage(true)
            e.target.innerHTML = "Sign up"
            let messages ;

            //* check if error response is relates to any field (like email) 
           if (error.response.data.messages?.includes(".")) {
            messages = error.response.data.messages.split(".") 
            setError({...error.response.data,messages})
           }
           else{
            messages = error.response.data.messages
            setError({messages})
           }
           
        }
        
    }
    


    return <>
        <div className="container">
            <div className="child-container">
                <div className="child-inner-container" ref={container_to_move}>
                   
                        <form className="signin-container">
                            <h2>Welcome back :)</h2>
                            <input type="text" name="email" id="email" placeholder="Email" autoComplete="off"/>
                            {
                            (errors?.fields?.includes("email") && isErrorMessageVisable) ? <p className="error-message">{errors.messages[errors.fields.indexOf("email")]}</p> : ""
                        }
                        <div className="pwd-contianer">
                            <input type="password" name="pass" id="pwd" placeholder="Password" autoComplete="off" />
                           

                            <button onClick={e => showPwd(e)}><ion-icon name="eye-outline"></ion-icon></button>
                        </div>
                        {
                            (errors?.fields?.includes("password") && isErrorMessageVisable) ? <p className="error-message">{errors.messages[errors.fields.indexOf("password")]}</p> : ""
                        }
                            <button type="submit" className="submit-btn"
                            onClick={(e)=>formHandler("signin",e)}>Sign in</button>

                        {
                            (!errors?.fields && isErrorMessageVisable) ? <p className="error-message" style={{marginBottom:"1em"}}>{errors.messages}</p> : ""
                        }


                            <h4>New user? <button className="change" onClick={(e)=>changeBtn(e)}>Sign up</button></h4>
                        </form>
                  
                   
                        {/* ----------------Sign up-----------  */}
                        <form className="newuser-container">
                            <h2>Create account</h2>
                            <input type="text" name="name" id="name" placeholder="Username" autoComplete="off" />
                            {
                                (errors?.fields?.includes("name")&& isErrorMessageVisable)? <p className="error-message">{errors.messages[errors.fields.indexOf("name")]}</p>:""
                            }
                            <input type="text" name="email" id="email" placeholder="Email" autoComplete="off" />
                            {
                                (errors?.field?.includes("email")&& isErrorMessageVisable)? <p className="error-message">{errors.messages}</p>:""
                            }
                           <div className="pwd-contianer">
                            <input type="password" name="pass" id="pwd" placeholder="Password" autoComplete="off"/>
                            <button onClick={e=>showPwd(e)}><ion-icon name="eye-outline"></ion-icon></button>
                           </div>
                           {
                                (errors?.fields?.includes("password") && isErrorMessageVisable)? <p className="error-message">{errors.messages[errors.fields.indexOf("password")]}</p>:""
                            }
                            <button type="submit" className="submit-btn" onClick={(e)=>formHandler("signup",e)}>Sign up</button>
                            <h4>Already a user? <button className="change" onClick={(e)=>changeBtn(e)}>Sign in</button></h4>
                        </form>
                    
                </div>
            </div>
        </div>
    </>
}