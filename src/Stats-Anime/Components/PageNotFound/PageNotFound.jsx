import React from "react";
import style from "./404.module.css";
import { useRouter } from "next/router";

//* page for 404 ---------
export const PageNotFound = () => {
  const router = useRouter();
  const navigation = useNavigate();
  return (
    <>
      <div className={style["errormessage"]}>
        <h2>404</h2>
        <h2>Sorry page dosen't exist</h2>
        <p>
          please refresh and try again or{" "}
          <button onClick={() => router.back()}>Go back</button>
        </p>
      </div>
    </>
  );
};
