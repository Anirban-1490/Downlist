import React from "react";
import "./genreAnime-style.css";
import { useQuery } from "react-query";
import axios from "axios";

import react from "react";

import { Dropdown } from "../../../../Components/DropDownSelectMenu/DropDownSelectMenu";
import { Spinner } from "../../../../Components/LoadingSpinner";
import { TouchCarousel } from "../../../../Components/TouchCarousel/TouchCarousel";

export const DifferentGenres = () => {
  const delay = (ms = 3000) => new Promise((r) => setTimeout(r, ms));
  const [genre_id, setID] = react.useState(4);

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

  const getResult = async (genre_id) => {
    await delay();
    return axios
      .get(`https://api.jikan.moe/v3/genre/anime/${genre_id}/1`)
      .then((res) => res.data.anime.slice(0, 16));
  };

  const { data, isLoading } = useQuery(
    ["genre", genre_id],
    () => getResult(genre_id),
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
      <div className="genre-first">
        <h2>
          DISCOVER
          <span>More Anime</span>
        </h2>
        <div className="item">
          {isLoading ? (
            <Spinner />
          ) : (
            <TouchCarousel items={data} switch_details="/anime" />
          )}
        </div>
      </div>

      <div className="wrapper-type">
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
