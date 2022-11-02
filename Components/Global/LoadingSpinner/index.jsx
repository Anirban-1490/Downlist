import React, { useState, useEffect } from "react";
import loadingStyle from "./loading.module.css";

export const Spinner = () => {
  const secondsPassed = new Date().getSeconds();
  const [showText, setText] = useState(false);

  useEffect(() => {
    const intID = setInterval(() => {
      if (secondsPassed + 10 < new Date().getSeconds()) {
        setText(true);
        clearInterval(intID);
      }
    }, 1000);

    return () => clearInterval(intID);
  });

  return (
    <>
      <div className={loadingStyle["spinner-parent-container"]}>
        <div className={loadingStyle["spinner-container"]}>
          <div
            className={`${loadingStyle["dot"]} ${loadingStyle["first-dot"]}`}
            style={{ "--i": 1, "--color": "#fc4445" }}
          ></div>
          <div
            className={`${loadingStyle["dot"]} ${loadingStyle["second-dot"]}`}
            style={{ "--i": 2, "--color": "greenyellow" }}
          ></div>
          <div
            className={`${loadingStyle["dot"]} ${loadingStyle["third-dot"]}`}
            style={{ "--i": 3, "--color": "#66fcf1" }}
          ></div>
          <div
            className={`${loadingStyle["dot"]} ${loadingStyle["fourth-dot"]}`}
            style={{ "--i": 4, "--color": "#edb7c7" }}
          ></div>
          <div
            className={`${loadingStyle["dot"]} ${loadingStyle["fifth-dot"]}`}
            style={{ "--i": 5, "--color": "#ffe400" }}
          ></div>
        </div>
        {showText && (
          <p className={loadingStyle["hold-tight"]}>
            Nearly at the finishing line
          </p>
        )}
      </div>
    </>
  );
};
