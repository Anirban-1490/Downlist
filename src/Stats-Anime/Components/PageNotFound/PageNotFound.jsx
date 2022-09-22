import React from "react";
import "./error-style.css";
import { useNavigate } from "react-router-dom";

//* page for 404 ---------
export const PageNotFound = () => {
  const navigation = useNavigate();
  return (
    <>
      <div className="errormessage">
        <h2>404</h2>
        <h2>Sorry page dosen't exist</h2>
        <p>
          please refresh and try again or{" "}
          <button onClick={() => navigation(-1)}>Go back</button>
        </p>
      </div>
    </>
  );
};
