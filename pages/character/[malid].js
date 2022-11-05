import { useQuery, QueryClient, dehydrate } from "react-query";
import axios from "axios";
import React from "react";

import { useRouter } from "next/router";
import { CoreDetails } from "Components/Details/CoreDetails";
import { Spinner } from "Components/Global/LoadingSpinner";
import { PageNotFound } from "Components/Global/PageNotFound/PageNotFound";
import { AnimeAppearances } from "Components/Details/AnimeAppearances";
import { VoiceActors } from "Components/Details/VoiceActors";
import { jikanQueries } from "JikanQueries";

//* component for character details

function CharacetrDetails() {
  const router = useRouter();
  const { malid } = router.query;

  const { data, isLoading, isError } = useQuery(
    ["char_details", malid],
    () => jikanQueries("char_details", malid),
    { cacheTime: 0, refetchOnWindowFocus: false, enabled: !!malid }
  );

  const details = {
    details: {
      title: data?.name_kanji,
      title_english: data?.name,
      favorites: data?.favorites,
      synopsis: data?.about,
      images: data?.images,
    },
    animegenres: null,
    stats: null,
    char: null,
    malid,
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
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

export async function getServerSideProps({ params }) {
  const { malid } = params;

  const client = new QueryClient();
  try {
    if (Number(malid) !== NaN) {
      await client.prefetchQuery(["char_details", malid], () =>
        jikanQueries("char_details", malid)
      );
    }
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: { dehydratedState: dehydrate(client) },
  };
}

export default CharacetrDetails;
