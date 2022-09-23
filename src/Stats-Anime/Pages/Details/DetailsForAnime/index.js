import React from "react";
import { useContext } from "react";
import "../Style/details-style.css";
import { useParams } from "react-router";
import axios from "axios";
import { useQueries } from "react-query";
import { Spinner } from "../../../Components/LoadingSpinner";
import { Appcontext } from "../../../context";
import { CommentsBox } from "../Components/CommentsBox";
import { PageNotFound } from "../../../Components/PageNotFound/PageNotFound";
import { RandomRecommendations } from "../Components/RandomRecommendation";
import { Roles } from "../Components/Roles";
import { CoreDetails } from "../Components/CoreDetails";
//* component for anime details

export const AnimeDetailsMain = () => {
  const { id } = useParams();
  const malid = id;

  const { userProfileDetails } = useContext(Appcontext);

  //* details of that anime
  const getDetails = (url) =>
    axios.get(url).then(({ data: { data } }) => ({ ...data }));

  //* get people reaction like favourites
  const getPeopleReaction = (url) =>
    axios.get(url).then(({ data: { data } }) => ({ ...data }));
  //* get all the characters in that anime
  const getAllCharacters = (url) =>
    axios.get(url).then(({ data: { data } }) => [...data]);

  const result = useQueries([
    {
      queryKey: ["details", id],
      queryFn: () => getDetails(`https://api.jikan.moe/v4/anime/${malid}/full`),
      refetchOnWindowFocus: false,
    },
    {
      queryKey: ["people_reaction", id],
      queryFn: () =>
        getPeopleReaction(`https://api.jikan.moe/v4/anime/${malid}/statistics`),
      refetchOnWindowFocus: false,
    },
    {
      queryKey: ["characters", id],
      queryFn: () =>
        getAllCharacters(`https://api.jikan.moe/v4/anime/${malid}/characters`),
      refetchOnWindowFocus: false,
    },
  ]);

  const genres = result[0].data?.genres;

  //*object for the metadeta of that anime
  const details = {
    animedetails: result[0].data,
    animegenres: genres,
    stats: result[1].data,
    malid,
  };

  //*get array of random anime recommendation

  return (
    <>
      {result.some((item) => item.isLoading) ? (
        <Spinner />
      ) : result.some((item) => item.error) ? (
        <PageNotFound />
      ) : (
        <div
          className="container1"
          style={{
            height: "auto",
          }}
        >
          <CoreDetails
            {...details}
            switch_item="anime"
            switch_path="topanime"
          />

          {/* //* characters section */}
          <h4
            style={{
              color: "white",
              fontSize: "25px",
              marginLeft: "14.5%",
              marginBottom: "1%",
              marginTop: "2em",
              borderLeft: "5px solid red",
              letterSpacing: "2px",
            }}
          >
            Characters
          </h4>
          <Roles data={result[2].data} path={"/character"} />

          {/* //* recommendations section */}
          <h4
            style={{
              color: "white",
              fontSize: "35px",
              marginBottom: "1%",
              marginTop: "2em",
              letterSpacing: "2px",
              textAlign: "center",
            }}
          >
            Recommended
          </h4>
          <RandomRecommendations
            genres={genres}
            path={"/anime"}
            malId={malid}
          />
          <h4
            style={{
              color: "white",
              fontSize: "35px",
              marginBottom: "1%",
              marginTop: "2em",
              letterSpacing: "2px",
              textAlign: "center",
            }}
          >
            Comments
          </h4>
          <CommentsBox {...userProfileDetails?.data} malid={malid} />
        </div>
      )}
    </>
  );
};
