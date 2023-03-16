import React from "react";

import { useRouter } from "next/router";
import axios from "axios";
import { QueryClient } from "react-query";

import { RandomRecommendations } from "Components/Details/RandomRecommendation";
import { Roles } from "Components/Details/Roles";
import { CoreDetails } from "Components/Details/CoreDetails";
import { CommentsBox } from "Components/Details/CommentsBox";
import { jikanQueries } from "JikanQueries";
import { useProfileData } from "Stores/UserProfileData";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "lib/IronOption";
import { path } from "server-path";

//* component for anime details

const AnimeDetails = ({
    user,
    detailsOfAnime,
    peopleReactions,
    appearedCharacters,
    isSaved,
}) => {
    const router = useRouter();

    const { malid } = router.query;

    const { profileData } = useProfileData();

    const genres = detailsOfAnime.genres;

    //*object for the metadeta of that anime
    const details = {
        details: detailsOfAnime,
        animegenres: genres,
        stats: peopleReactions,
        malid,
        user,
        isSaved,
    };

    //*get array of random anime recommendation

    return (
        <div
            className="container1"
            style={{
                height: "auto",
            }}>
            <CoreDetails
                {...details}
                switch_item="anime"
                switch_path="topanime"
                key={malid}
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
                }}>
                Characters
            </h4>
            <Roles data={appearedCharacters} path={"/character"} />

            {/* //* recommendations section */}
            <h4
                style={{
                    color: "white",
                    fontSize: "35px",
                    marginBottom: "1%",
                    marginTop: "2em",
                    letterSpacing: "2px",
                    textAlign: "center",
                }}>
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
                }}>
                Comments
            </h4>
            <CommentsBox {...profileData?.data} malid={malid} />
        </div>
    );
};

export const getServerSideProps = withIronSessionSsr(
    async ({ params, query, req }) => {
        const { malid } = params;
        const user = req.session.user || null;
        const client = new QueryClient();
        try {
            if (!isNaN(Number(malid))) {
                const detailsOfAnime = await client.fetchQuery(
                    ["details", malid],
                    () => jikanQueries("details", malid)
                );
                const peopleReactions = await client.fetchQuery(
                    ["people_reaction", malid],
                    () => jikanQueries("people_reaction", malid)
                );
                const appearedCharacters = await client.fetchQuery(
                    ["characters", malid],
                    () => jikanQueries("characters", malid)
                );

                const savedAnimeStatus = user
                    ? await client.fetchQuery(["userAnimeList"], () =>
                          axios.get(
                              `${path.domain}user/${user._id}/list/anime/${malid}/status`
                          )
                      )
                    : null;

                return {
                    props: {
                        detailsOfAnime,
                        peopleReactions,
                        appearedCharacters,
                        user,
                        isSaved: user
                            ? savedAnimeStatus.data.status === "Saved"
                            : null,
                    },
                };
            } else {
                throw new Error("invalid malid");
            }
        } catch (error) {
            return {
                notFound: true,
            };
        }
    },
    ironOptions
);

export default AnimeDetails;
