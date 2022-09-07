import "../Style/details-style.css";
import { useParams } from "react-router";
import { CoreDetails } from "../Components/CoreDetails";
import { useQuery } from "react-query";
import { Spinner } from "../../../Components/LoadingSpinner";
import { PageNotFound } from "../../../Components/PageNotFound/PageNotFound";
import axios from "axios";
import React from "react";
import { AnimeAppearances } from "./Components/AnimeAppearances";
import { VoiceActors } from "./Components/VoiceActors";

//* component for character details

export function CharacetrDetailsMain() {
  const { id } = useParams();
  const malid = id;

  const getCharacterDetails = (url) => axios.get(url).then((res) => res.data);

  const { data, isLoading, isError } = useQuery(
    "char_details",
    () => getCharacterDetails(`https://api.jikan.moe/v3/character/${malid}`),
    { cacheTime: 0, refetchOnWindowFocus: false }
  );

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <PageNotFound />
      ) : (
        <div className="container1" style={{ height: "auto" }}>
          <CoreDetails
            details={{
              animedetails: data,
              animegenres: null,
              stats: null,
              char: null,
              malid,
            }}
            fav={data?.member_favorites}
            about={data?.about}
            name={data?.name}
            name_kenji={data?.name_kanji}
            switch_item="character"
            switch_path="topcharacters"
          />
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
            Anime Appearances
          </h4>
          <AnimeAppearances appearances={data?.animeography} />
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
            Voice Actors
          </h4>
          <VoiceActors voiceactors={data?.voice_actors} />
        </div>
      )}
    </>
  );
}
