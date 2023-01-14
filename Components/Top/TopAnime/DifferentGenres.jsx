import genreAnimeStyle from "Components/Top/TopAnime/genreAnime.module.scss";

import Link from "next/link";

export const DifferentGenres = ({ genres }) => {
    return (
        <>
            <h2 className={genreAnimeStyle["header-genre-section"]}>
                pick your choice
            </h2>
            <div className={genreAnimeStyle["genres-container"]}>
                {genres.map((genre, index) => {
                    return (
                        <Link href={`/anime/content?genre=${genre}`}>
                            <a
                                className={genreAnimeStyle["genre"]}
                                style={{
                                    filter: `hue-rotate(${index * 20}deg)`,
                                }}>
                                {genre.split("_").join(" ")}
                            </a>
                        </Link>
                    );
                })}
            </div>
        </>
    );
};
