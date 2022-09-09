import React, { useState, useEffect } from "react";
import "./loading_anime.css";

export const Spinner = () => {
  const secondsPassed = new Date().getSeconds();
  const [showText, setText] = useState(false);

  console.log(secondsPassed);

  useEffect(() => {
    const intID = setInterval(() => {
      if (secondsPassed + 10 < new Date().getSeconds()) {
        setText(true);
        clearInterval(intID);
      }
    }, 1000);
  });

  return (
    <>
      <div className="spinner-parent-container">
        <div className="spinner-container">
          <div
            className="dot first-dot"
            style={{ "--i": 1, "--color": "#fc4445" }}
          ></div>
          <div
            className="dot second-dot"
            style={{ "--i": 2, "--color": "greenyellow" }}
          ></div>
          <div
            className="dot third-dot"
            style={{ "--i": 3, "--color": "#66fcf1" }}
          ></div>
          <div
            className="dot fourth-dot"
            style={{ "--i": 4, "--color": "#edb7c7" }}
          ></div>
          <div
            className="dot fifth-dot"
            style={{ "--i": 5, "--color": "#ffe400" }}
          ></div>
        </div>
        {showText && <p className="hold-tight">Nearly at the finishing line</p>}
      </div>
    </>
  );
};
