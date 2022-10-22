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
  const { id: mailId } = useParams();

  const getCharacterDetails = async (url) => {
    return await axios.get(url).then(({ data: { data } }) => data);
  };

  const { data, isLoading, isError } = useQuery(
    "char_details",
    () =>
      getCharacterDetails(`https://api.jikan.moe/v4/characters/${mailId}/full`),
    { cacheTime: 0, refetchOnWindowFocus: false }
  );

  const characterDetails = {
    title: data?.name_kanji,
    title_englidh: data?.name,
    favorites: data?.favorites,
    synopsis: data?.about,
    images: data?.images,
  };

  const details = {
    details: characterDetails,
    animegenres: null,
    stats: null,
    char: null,
    mailId,
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <PageNotFound />
      ) : (
        <div className="container1" style={{ height: "auto" }}>
          <CoreDetails
            {...details}
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
          <AnimeAppearances appearances={data?.anime} />
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
          <VoiceActors voiceactors={data?.voices} />
        </div>
      )}
    </>
  );
}
