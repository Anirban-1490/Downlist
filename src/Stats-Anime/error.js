import React from "react";
import "./error-style.css";

//* page for 404 ---------
export const Errorpage = ()=>
{


    return <>
        <div className="errormessage">

            <h2>404</h2>
            <h2>Sorry page dosen't exist</h2>
            <p>please refresh and try again or <button onClick={() => window.history.go(-1)}>Go back</button></p>

        </div>
    </>
}