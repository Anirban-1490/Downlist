import {useRef,useEffect,useState,useReducer} from "react";
import "./signup.css"




export const SignupMain = () => {

    const container_to_move = useRef()


    //* handler for switching between signup and sign in form
    const changeBtn  = function(e){
        e.preventDefault();
        const left_pos = getComputedStyle(container_to_move.current).left;
        
        console.log(left_pos);
        if(left_pos.includes("0")){
            container_to_move.current.style.left = "-109%"
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


    const formHandler = (formName,e)=>{
        e.preventDefault();

        const formData = new FormData(e.target.parentElement);
        const userInfo = Object.fromEntries(formData)
        console.log(userInfo);
        
    }


    return <>
        <div className="container">
            <div className="child-container">
                <div className="child-inner-container" ref={container_to_move}>
                   
                        <form className="signin-container">
                            <h2>Welcome back :)</h2>
                            <input type="text" name="email" id="email" placeholder="Email" autoComplete="off"/>
                            <div className="pwd-contianer">
                            <input type="password" name="pass" id="pwd" placeholder="Password" autoComplete="off"/>
                            <button onClick={e=>showPwd(e)}><ion-icon name="eye-outline"></ion-icon></button>
                           </div>
                            <button type="submit" className="submit-btn">Sign in</button>
                            <h4>New user? <button className="change" onClick={(e)=>changeBtn(e)}>Sign up</button></h4>
                        </form>
                  
                   
                        {/* Sign up  */}
                        <form className="newuser-container">
                            <h2>Create account</h2>
                            <input type="text" name="name" id="name" placeholder="Username" autoComplete="off" />
                            <input type="text" name="email" id="email" placeholder="Email" autoComplete="off" />
                           <div className="pwd-contianer">
                            <input type="password" name="pass" id="pwd" placeholder="Password" autoComplete="off"/>
                            <button onClick={e=>showPwd(e)}><ion-icon name="eye-outline"></ion-icon></button>
                           </div>
                            <button type="submit" className="submit-btn" onClick={(e)=>formHandler("signup",e)}>Sign up</button>
                            <h4>Already a user? <button className="change" onClick={(e)=>changeBtn(e)}>Sign in</button></h4>
                        </form>
                    
                </div>
            </div>
        </div>
    </>
}