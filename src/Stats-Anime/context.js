import React from "react";
import react from "react";
import { useContext ,useEffect,useState} from "react";


const Appcontext = react.createContext();

const Approvider = ({children})=>
{

    const [ishamclick , setIshamclick] = useState(false);
    const [loading,setLoading] = useState(false);
    const [loadingtext,setLoadingtext] = useState("");

    const toggle = (bool)=>
    {
        setIshamclick(bool);
    }
    const toggle_loading_state = (bool)=>
    {
        setLoading(bool);
    }
    const set_loading_text = (text)=>
    {
        setLoadingtext(text.toString());
    }

    return <Appcontext.Provider value = {
        {ishamclick,
            toggle,
            loading,
            loadingtext,
            toggle_loading_state,
            set_loading_text}
        }>{children}</Appcontext.Provider>
}


export  {Approvider,Appcontext};