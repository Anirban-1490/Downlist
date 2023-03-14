import { QueryClient } from "react-query";
import axios from "axios";
import React from "react";

import { useRouter } from "next/router";
import { CoreDetails } from "Components/Details/CoreDetails";
import { AnimeAppearances } from "Components/Details/AnimeAppearances";
import { VoiceActors } from "Components/Details/VoiceActors";
import { jikanQueries } from "JikanQueries";
import { withIronSessionSsr } from "iron-session/next";
import { ironOptions } from "lib/IronOption";
import { path } from "server-path";

//* component for character details

function CharacetrDetails({ user, isSaved, deatilsofCharacter }) {
    const router = useRouter();
    const { malid } = router.query;

    const details = {
        details: {
            title: deatilsofCharacter?.name_kanji,
            title_english: deatilsofCharacter?.name,
            favorites: deatilsofCharacter?.favorites,
            synopsis: deatilsofCharacter?.about,
            images: deatilsofCharacter?.images,
        },
        animegenres: null,
        stats: null,
        char: null,
        malid,
        isSaved,
        user,
    };

    return (
        <>
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
                    }}>
                    Anime Appearances
                </h4>
                <AnimeAppearances appearances={deatilsofCharacter?.anime} />
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
                    Voice Actors
                </h4>
                <VoiceActors voiceactors={deatilsofCharacter?.voices} />
            </div>
        </>
    );
}

export const getServerSideProps = withIronSessionSsr(
    async ({ params, req }) => {
        const { malid } = params;
        const user = req.session.user;
        const client = new QueryClient();
        try {
            if (Number(malid) !== NaN) {
                const deatilsofCharacter = await client.fetchQuery(
                    ["char_details", malid],
                    () => jikanQueries("char_details", malid)
                );
                const savedCharacterStatus = await client.fetchQuery(
                    ["userCharacterList"],
                    () =>
                        axios.get(
                            `${path.domain}user/${user._id}/list/character/${malid}/status`
                        )
                );
                return {
                    props: {
                        deatilsofCharacter,

                        user,
                        isSaved: savedCharacterStatus.data.status === "Saved",
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
export default CharacetrDetails;
