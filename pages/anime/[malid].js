import React, { useEffect, useState } from "react";
import { useContext } from "react";

import { useRouter } from "next/router";
import axios from "axios";
import { useQueries, QueryClient, dehydrate } from "react-query";

import { RandomRecommendations } from "Components/Details/RandomRecommendation";
import { Roles } from "Components/Details/Roles";
import { CoreDetails } from "Components/Details/CoreDetails";
import { PageNotFound } from "Components/Global/PageNotFound/PageNotFound";
import { CommentsBox } from "Components/Details/CommentsBox";
import { Appcontext } from "context";
import { Spinner } from "Components/Global/LoadingSpinner";
import { jikanQueries } from "JikanQueries";
import { authorizeDomain } from "Feature/Authorize/AuthorizeDomain";
import { getUserToken } from "GetuserToken";

//* component for anime details

const AnimeDetails = ({ userData }) => {
  const router = useRouter();

  const { malid } = router.query;

  const { userProfileDetails } = useContext(Appcontext);

  const result = useQueries([
    {
      queryKey: ["details", malid],
      queryFn: () => jikanQueries("details", malid),
      refetchOnWindowFocus: false,
      enabled: !!malid,
    },
    {
      queryKey: ["people_reaction", malid],
      queryFn: () => jikanQueries("people_reaction", malid),
      refetchOnWindowFocus: false,
      enabled: !!malid,
    },
    {
      queryKey: ["characters", malid],
      queryFn: () => jikanQueries("characters", malid),
      refetchOnWindowFocus: false,
      enabled: !!malid,
    },
  ]);

  const genres = result[0].data?.genres;

  //*object for the metadeta of that anime
  const details = {
    details: result[0].data,
    animegenres: genres,
    stats: result[1].data,
    malid,
  };

  //*get array of random anime recommendation

  return (
    <>
      {result.some((item) => item.isLoading) ? (
        <Spinner />
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

export async function getServerSideProps({ params, query }) {
  const { malid } = params;

  const client = new QueryClient();
  try {
    if (Number(malid) !== NaN) {
      await client.prefetchQuery(["details", malid], () =>
        jikanQueries("details", malid)
      );
      await client.prefetchQuery(["people_reaction", malid], () =>
        jikanQueries("people_reaction", malid)
      );
      await client.prefetchQuery(["characters", malid], () =>
        jikanQueries("characters", malid)
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

export default AnimeDetails;
