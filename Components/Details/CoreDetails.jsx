import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";
import coredetailStyle from "Components/Details/Style/CoreDetails.module.scss";
import { path } from "server-path";
import { NoItem } from "Components/Global/NoItemFound/NoItemFound";
import { useAuth } from "Feature/Authorize/Authorize";
import { CustomHead } from "Components/Global/CustomHead";
import { CircularSpinner } from "Components/Global/CircularSpinner";

export const CoreDetails = ({
    details,
    animegenres,
    stats,
    malid,
    switch_path,
    switch_item,
    isSaved: initialSavedStatus,
    user,
}) => {
    const {
        title,
        title_english,
        episodes,
        score,
        favorites,
        synopsis,
        aired,
        status,
        images: {
            jpg: { image_url },
        },
        type,
    } = details;

    const [isSaved, setSaveStatus] = useState(initialSavedStatus);

    const [seemorebtn, Setbtn] = useState(false);

    const btn = useRef();

    const router = useRouter();

    const newTitle = title.length > 35 ? `${title.substr(0, 35)}.` : title;
    const newTitleEnglish =
        title_english.length > 35
            ? `${title_english.substr(0, 35)}.`
            : title_english;

    //* mutation for submitting a data
    const submitItemForSave = useMutation(
        async (inputData) => {
            if (switch_item === "anime") {
                return await axios.post(
                    `${path.domain}user/${user?._id}/list/anime`,
                    inputData.anime
                );
            }
            return await axios.post(
                `${path.domain}user/${user?._id}/list/character`,
                inputData.character
            );
        },
        {
            onSuccess: async (data, vari) => {
                await axios.put(
                    `${path.domain}user/${user?._id}/profile/activity`,
                    {
                        actDone: "Added",
                        detail: newTitleEnglish,
                        doneAt: new Date(),
                    }
                );
                setSaveStatus(true);
            },
        }
    );

    //* mutation for deleting a data
    const removeSavedItem = useMutation(
        async () => {
            return axios.delete(
                `${path.domain}user/${user?._id}/list/${switch_item}/${malid}`
            );
        },
        {
            onSuccess: async (data) => {
                await axios.put(
                    `${path.domain}user/${user?._id}/profile/activity`,
                    {
                        actDone: "Removed",
                        detail: newTitleEnglish,
                        doneAt: new Date(),
                    }
                );
                setSaveStatus(false);
            },
        }
    );

    async function Additem(e) {
        //* user not authorized , redirect to sign in page
        if (!user?._id) return router.push("/userauth");

        if (isSaved) return removeSavedItem.mutate();

        //*check if the route is for anime
        if (switch_item === "anime") {
            const anime = {
                malid,
                img_url: image_url,
                title: title,
                score: score,
                episodes: episodes,
                favorites,
                addedOn: new Date().toDateString(),
            };
            submitItemForSave.mutate({ anime });
        }
        //*check if the route is for character
        else if (switch_item === "character") {
            const character = {
                malid,
                img_url: image_url,
                title_english,
                favorites,
                addedOn: new Date().toDateString(),
            };
            submitItemForSave.mutate({ character });
        }
    }

    let color = "white";

    if (details?.score > 7.5) {
        color = "#00ff1a";
    } else if (score < 7.5 && score > 6) {
        color = "yellow";
    } else {
        color = "#e6e616";
    }

    return (
        <>
            <CustomHead
                imageUrl={image_url}
                description={`${synopsis.substr(0, 230)}`}
                url={`${switch_item}/${malid}`}
                contentTitle={`${newTitle} | ${newTitleEnglish} | Downlist`}
            />
            <div className={coredetailStyle["pic-header"]}>
                <div className={coredetailStyle["img-inner-container"]}>
                    {type && (
                        <h5 className={coredetailStyle["anime-type"]}>
                            {type}
                        </h5>
                    )}
                    <img src={image_url} alt="" />
                </div>

                <div className={coredetailStyle["title-container"]}>
                    <h2 className={coredetailStyle["title"]}>{newTitle}</h2>
                    <p className={coredetailStyle["title-english"]}>
                        {newTitleEnglish}
                    </p>
                </div>
            </div>
            <div className={coredetailStyle["inner-container"]}>
                <ul className={coredetailStyle["stats"]}>
                    {episodes && (
                        <li className={coredetailStyle["ep"]}>
                            <ion-icon name="tv-outline"></ion-icon>
                            {episodes}
                        </li>
                    )}
                    {score && <li style={{ color: `${color}` }}>{score}</li>}
                    <li className={coredetailStyle["star"]}>
                        <ion-icon name="star"></ion-icon>
                        {favorites}
                    </li>
                    <li className={coredetailStyle["add-to-list"]}>
                        <button
                            data-save={isSaved}
                            ref={btn}
                            type="button"
                            title={`${isSaved ? "remove" : "save"}`}
                            aria-label={`${isSaved ? "remove" : "save"}`}
                            onClick={Additem}
                            onMouseDown={() =>
                                (btn.current.style.animation =
                                    "btnanime 0.2s 1 forwards")
                            }
                            onMouseUp={() =>
                                (btn.current.style.animation = "none")
                            }
                            className={
                                (submitItemForSave.isLoading ||
                                    removeSavedItem.isLoading) &&
                                coredetailStyle["btn-loading"]
                            }>
                            {!!(
                                submitItemForSave.isLoading ||
                                removeSavedItem.isLoading
                            ) && (
                                <span>
                                    <CircularSpinner
                                        size={28}
                                        secondaryColor="transparent"
                                        color="white"
                                    />
                                </span>
                            )}

                            {!submitItemForSave.isLoading &&
                            !removeSavedItem.isLoading ? (
                                isSaved ? (
                                    <>
                                        <ion-icon name="trash-outline"></ion-icon>
                                        Remove
                                    </>
                                ) : (
                                    <>
                                        <ion-icon name="bookmark"></ion-icon>
                                        Save
                                    </>
                                )
                            ) : null}
                        </button>
                    </li>
                </ul>
                <h4>Information</h4>
                <p className={coredetailStyle["full-title"]}>
                    Full Name: {title}
                </p>
                <p className={coredetailStyle["full-title"]}>
                    Full English Name: {title_english}
                </p>
                <p className={coredetailStyle["description"]}>
                    {synopsis ? (
                        !seemorebtn && synopsis.length > 380 ? (
                            synopsis.substr(0, 380).concat("...")
                        ) : (
                            synopsis
                        )
                    ) : (
                        <NoItem />
                    )}
                    {synopsis && synopsis.length > 380 && (
                        <p
                            style={{
                                display: "inline",
                                color: "lightcyan",
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                !seemorebtn ? Setbtn(true) : Setbtn(false)
                            }>
                            {seemorebtn ? "Read less" : "Read more"}
                        </p>
                    )}
                </p>
                {animegenres && (
                    <div>
                        <h4>Genres</h4>
                        <ul className={coredetailStyle["genres"]}>
                            {animegenres.length > 0 ? (
                                animegenres.map((item) => {
                                    const { name, mal_id } = item;
                                    return <li key={mal_id}>{name}</li>;
                                })
                            ) : (
                                <NoItem />
                            )}
                        </ul>
                    </div>
                )}
                {aired && (
                    <div>
                        <h4>Aired</h4>
                        <div className={coredetailStyle["aired"]}>
                            <p>{aired.string}</p>
                            <p>{status}</p>
                        </div>
                    </div>
                )}
                {stats && (
                    <div>
                        <h4>Stats</h4>
                        <ul className={coredetailStyle["stats-watching"]}>
                            <li style={{ color: "lightgrey" }}>
                                Watching: {stats.watching}
                            </li>
                            <li style={{ color: "#00ff1a" }}>
                                Completed: {stats.completed}
                            </li>
                            <li style={{ color: "yellow" }}>
                                On Hold: {stats.on_hold}
                            </li>
                            <li style={{ color: "red" }}>
                                Dropped: {stats.dropped}
                            </li>
                            <li style={{ color: "violet" }}>
                                Plan to Watch: {stats.plan_to_watch}
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </>
    );
};
