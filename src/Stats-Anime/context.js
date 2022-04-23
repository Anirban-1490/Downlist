import React from "react";
import react from "react";
import { useState} from "react";


const Appcontext = react.createContext();

const Approvider = ({children})=>
{

    const [ishamclick , setIshamclick] = useState(false);
    const [loading,setLoading] = useState(false); //* trigger for the loading text
    const [loadingtext,setLoadingtext] = useState(""); //* content of the loading text

    const [editState, setEditState] = useState(false);

    const [userData,setUserData] = useState()

    const toggle = (bool)=>
    {
        setIshamclick(bool);
    }
    const toggle_loading_state = (bool)=> //* handler for loading text
    {
        setLoading(bool);
    }
    const set_loading_text = (text)=>
    {
        setLoadingtext(text.toString());
    }

    const changeEditState = (e)=>{
        e.preventDefault()
        setEditState(!editState);
    }

    const changeUserData = (user)=>{
        setUserData(user)
        console.log(user);
    }


    return <Appcontext.Provider value = {
        {ishamclick,
            toggle,
            loading,
            loadingtext,
            toggle_loading_state,
            set_loading_text,
            changeEditState,
            editState,
            changeUserData,
            userData
        }
        }>{children}</Appcontext.Provider>
}


export  {Approvider,Appcontext};