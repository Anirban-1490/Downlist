import React, { useState } from "react";
import { useList } from "../../Hooks/useList";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ListCore } from "./Components/ListCore";
import "./Style/list-style.css";
import { useQueryClient } from "react-query";

var token = localStorage.getItem("token");

export function MainListContainer({ header, switch_item }) {
  useLocation();
  const navigate = useNavigate();
  const { userID } = useParams();
  const [whatToSortBy, setWhatToSortBy] = useState(undefined);

  const client = useQueryClient();
  const clientData = client.getQueryData(["user", token]);
  const returnedPackage = useList(switch_item, userID, whatToSortBy);

  //* --if user not logged in then redirect to login page
  if (!clientData?.userID) {
    navigate("/userauth");
  }

  return (
    <>
      <div
        className="container1"
        style={{ height: "auto", minHeight: "100vh" }}
      >
        {returnedPackage.data !== undefined ? (
          <ListCore
            header={header}
            clientData={clientData}
            switch_item={switch_item}
            userID={userID}
            setWhatToSortBy={setWhatToSortBy}
            {...returnedPackage}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

//* custom hook to get the user's list items
