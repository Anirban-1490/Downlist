import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import coredetailStyle from "Components/Details/Style/CoreDetails.module.scss";
import { path } from "server-path";
import { NoItem } from "Components/Global/NoItemFound/NoItemFound";
import { useAuth } from "Feature/Authorize/Authorize";

export const CoreDetails = ({
    details,
    animegenres,
    stats,
    malid,
    switch_path,
    switch_item,
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

    const [itemadd, setItemadd] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [seemorebtn, Setbtn] = useState(false);
    const [userData, _] = useAuth(true);
    const btn = useRef();

    const router = useRouter();

    const newTitle = title.length > 35 ? `${title.substr(0, 35)}.` : title;
    const newTitleEnglish =
        title_english.length > 35
            ? `${title_english.substr(0, 35)}.`
            : title_english;
    async function fetchUserList() {
        if (switch_item === "character")
            return (
                await axios.get(
                    `${path.domain}user/${userData?.userID}/list/character`
                )
            ).data;

        return (
            await axios.get(`${path.domain}user/${userData?.userID}/list/anime`)
        ).data;
    }

    useQuery(
        switch_item === "anime" ? "userAnimeList" : "userCharList",

        () => fetchUserList(),
        {
            refetchOnWindowFocus: false,
            onSettled: (data, err) => {
                if (err) return console.log(err);
                console.log("ran");
                data.list.forEach((obj) => {
                    if (obj.malid === malid) {
                        //*if item is in local storage the set this state to true
                        console.log("hello");
                        setItemadd(true);
                    }
                });
            },
            enabled: !!userData?.userID,
            cacheTime: 1000,
        }
    );

    //* function to add item into your saved list
    async function Additem(e) {
        //* show the loadnig... text when click the button
        setLoading(true);

        if (!userData?.userID) {
            //* if user not logged in then redirect to login page
            router.push("/userauth");
        } else {
            if (itemadd === false) {
                //*check if the route is for anime
                if (switch_item === "anime") {
                    const item = {
                        malid,
                        img_url: image_url,
                        title: title,
                        score: score,
                        episodes: episodes,
                        favorites,
                        addedOn: new Date().toDateString(),
                    };

                    await axios.post(
                        `${path.domain}user/${userData?.userID}/list/anime`,
                        item
                    );

                    await axios.put(
                        `${path.domain}user/${userData?.userID}/profile/activity`,
                        {
                            actDone: "Added",
                            detail: title,
                            doneAt: new Date(),
                        }
                    );
                }
                //*check if the route is for character
                else if (switch_item === "character") {
                    const item = {
                        malid,
                        img_url: image_url,
                        title_english,
                        favorites,
                        addedOn: new Date().toDateString(),
                    };

                    await axios.post(
                        `${path.domain}user/${userData?.userID}/list/character`,
                        item
                    );

                    await axios.put(
                        `${path.domain}user/${userData?.userID}/profile/activity`,
                        {
                            actDone: "Added",
                            detail: title,
                            doneAt: new Date(),
                        }
                    );
                }
                //* remove the loading text
                setLoading(false);
                //*item added
                setItemadd(true);
            } else {
                //* if item already added then remove it

                if (switch_item === "anime") {
                    await axios.delete(
                        `${path.domain}user/${userData?.userID}/list/anime/${malid}`
                    );

                    await axios.put(
                        `${path.domain}user/${userData?.userID}/profile/activity`,
                        {
                            actDone: "Removed",
                            detail: details.title,
                            doneAt: new Date(),
                        }
                    );
                } else if (switch_item === "character") {
                    await axios.delete(
                        `${path.domain}user/${userData?.userID}/list/character/${malid}`
                    );

                    await axios.put(
                        `${path.domain}user/${userData?.userID}/profile/activity`,
                        {
                            actDone: "Removed",
                            detail: title,
                            doneAt: new Date(),
                        }
                    );
                }
                setLoading(false);
                setItemadd(false);
            }
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
            {}
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
                            ref={btn}
                            type="button"
                            onClick={Additem}
                            onMouseDown={() =>
                                (btn.current.style.animation =
                                    "btnanime 0.2s 1 forwards")
                            }
                            onMouseUp={() =>
                                (btn.current.style.animation = "none")
                            }
                            style={
                                itemadd
                                    ? { background: "#fb2f00" }
                                    : { background: "#802bb1" }
                            }>
                            {isLoading ? (
                                "Loading..."
                            ) : itemadd ? (
                                <>
                                    <ion-icon name="trash-outline"></ion-icon>
                                    Remove
                                </>
                            ) : (
                                <>
                                    <ion-icon name="bookmark"></ion-icon>
                                    Save
                                </>
                            )}
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
