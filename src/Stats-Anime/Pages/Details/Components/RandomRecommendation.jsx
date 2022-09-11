import { ExpandableContainer } from "../../../Components/ExpandableContainer/ExpandableContainer";
import axios from "axios";
import { useQuery } from "react-query";

export const RandomRecommendations = ({ genres, path, malId }) => {
  const randomGenre =
    genres && genres[Math.floor(Math.random() * 10) % genres.length];

  const getRecommend = async (url) => {
    let randomAnime = [];
    const { anime: arrayOfAnime } = (await axios.get(url)).data;

    while (randomAnime.length < 14) {
      randomAnime.push(
        arrayOfAnime[Math.floor(Math.random() * 100) % arrayOfAnime.length]
      );
      randomAnime = [...new Set(randomAnime)];
    }
    return randomAnime;
  };

  //* fetch all the anime from a random genre with it's genre id
  const { data } = useQuery(
    ["recommendations", malId],
    () =>
      getRecommend(
        `https://api.jikan.moe/v3/genre/anime/${randomGenre.mal_id}`
      ),
    {
      refetchOnWindowFocus: false,
      enabled: !!genres,
      staleTime: Infinity,
    }
  );

  return <ExpandableContainer data={data} path={path} />;
};
