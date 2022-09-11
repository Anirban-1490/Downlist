import React from "react";
import { useContext } from "react";
import "../Style/details-style.css";
// import "./animestyle.css";
import { useParams } from "react-router";
import axios from "axios";
import { useQueries, useQuery } from "react-query";
import { Spinner } from "../../../Components/LoadingSpinner";
import { Appcontext } from "../../../context";
import { CommentsBox } from "../Components/CommentsBox";
import { PageNotFound } from "../../../Components/PageNotFound/PageNotFound";
import { Roles } from "../Components/Roles";
import { CoreDetails } from "../Components/CoreDetails";
//* component for anime details

export const AnimeDetailsMain = () => {
  const { id } = useParams();
  const malid = id;

  const { userProfileDetails } = useContext(Appcontext);

  //* details of that anime
  const getDetails = (url) => axios.get(url).then((value) => value.data);

  //* get people reaction like favourites
  const getPeopleReaction = (url) =>
    axios.get(url).then((result) => result.data);
  //* get all the characters in that anime
  const getAllCharacters = (url) =>
    axios.get(url).then((res) => [...res.data.characters]);

  const result = useQueries([
    {
      queryKey: ["details", id],
      queryFn: () => getDetails(`https://api.jikan.moe/v3/anime/${malid}`),
      refetchOnWindowFocus: false,
    },
    {
      queryKey: ["people_reaction", id],
      queryFn: () =>
        getPeopleReaction(`https://api.jikan.moe/v3/anime/${malid}/stats`),
      refetchOnWindowFocus: false,
    },
    {
      queryKey: ["characters", id],
      queryFn: () =>
        getAllCharacters(
          `https://api.jikan.moe/v3/anime/${malid}/characters_staff`
        ),
      refetchOnWindowFocus: false,
    },
  ]);

  const genres = result[0].data?.genres;
  const randomGenre =
    genres && genres[Math.floor(Math.random() * 10) % genres.length];

  //*object for the metadeta of that anime
  const details = {
    animedetails: result[0].data,
    animegenres: genres,
    stats: result[1].data,
    malid,
  };

  //*get array of random anime recommendation

  const getRecommend = async (url) => {
    let randomAnime = [];
    const { anime: arrayOfAnime } = (await axios.get(url)).data;

    while (randomAnime.length < 14) {
      randomAnime.push(
        arrayOfAnime[Math.floor(Math.random() * 100) % arrayOfAnime.length]
      );
      randomAnime = [...new Set(randomAnime)];
    }
    return randomAnime;
  };

  //* fetch all the anime from a random genre with it's genre id
  const { data } = useQuery(
    ["recommendations", id],
    () =>
      getRecommend(
        `https://api.jikan.moe/v3/genre/anime/${randomGenre.mal_id}`
      ),
    { refetchOnWindowFocus: false, enabled: !!genres }
  );

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
            details={details}
            fav={result[0].data?.favorites}
            about={result[0].data?.synopsis}
            name={result[0].data?.title_english}
            name_kenji={result[0].data?.title}
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
          <Roles char={result[2].data} path={"/character"} />

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
          <Roles char={data} path={"/anime"} />
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
