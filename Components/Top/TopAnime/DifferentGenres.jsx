import genreAnimeStyle from "Components/Top/TopAnime/genreAnime.module.css";
import { useQuery } from "react-query";
import axios from "axios";

import react from "react";

import { TouchCarousel } from "Components/Global/TouchCarousel/TouchCarousel";
import { Spinner } from "Components/Global/LoadingSpinner";
import { Dropdown } from "Components/Global/DropDownSelectMenu/DropDownSelectMenu";

export const DifferentGenres = () => {
  const delay = (ms = 3000) => new Promise((r) => setTimeout(r, ms));
  const [genreId, setID] = react.useState(4);

  const options = [
    { genre_id: 1, name: "Action" },
    { genre_id: 2, name: "Adventure" },
    { genre_id: 4, name: "Comedy" },
    { genre_id: 7, name: "Mystery" },
    { genre_id: 8, name: "Drama" },
    { genre_id: 10, name: "Fantasy" },
    { genre_id: 15, name: "Kids" },
    { genre_id: 22, name: "Romance" },
    { genre_id: 24, name: "Sci Fi" },
  ];

  const getResult = async (genreId) => {
    await delay();
    return axios
      .get(
        `https://api.jikan.moe/v4/anime?genres=${genreId}&order_by=members&sort=desc`
      )
      .then(({ data: { data } }) => data.slice(0, 16));
  };

  const { data, isLoading } = useQuery(
    ["genre", genreId],
    () => getResult(genreId),
    {
      refetchIntervalInBackground: false,
      staleTime: 0,
      cacheTime: 0,
      onSettled: async (data, err) => {
        if (err) return console.log(err);
        //* delay to show a loading animation
        await delay();
        return data;
      },
    }
  );

  return (
    <>
      <div className={genreAnimeStyle["genre-first"]}>
        <h2>
          DISCOVER
          <span>More Anime</span>
        </h2>
        <div className={genreAnimeStyle["item"]}>
          {isLoading ? (
            <Spinner />
          ) : (
            <TouchCarousel items={data} switch_details="anime" />
          )}
        </div>
      </div>

      <div className={genreAnimeStyle["wrapper-type"]}>
        <h4>Choose your type</h4>
        <Dropdown
          options={options}
          setID={setID}
          placeholder="Comedy"
          stats_anime={null}
        />
      </div>
    </>
  );
};

//* drop down options------
