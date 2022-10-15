import { ExpandableContainer } from "../../../Components/ExpandableContainer/ExpandableContainer";
import axios from "axios";
import { useQuery } from "react-query";
import { useInView } from "react-intersection-observer";

export const RandomRecommendations = ({ genres, path, malId }) => {
  const { ref: observerRef, inView } = useInView({ threshold: 0 });
  const randomGenre =
    genres && genres[Math.floor(Math.random() * 10) % genres.length];

  const getRecommend = async (url) => {
    let randomAnime = [];
    const { data: arrayOfAnime } = (await axios.get(url)).data;

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
        `https://api.jikan.moe/v4/anime?genres=${randomGenre?.mal_id}&order_by=members&sort=desc`
      ),
    {
      refetchOnWindowFocus: false,
      enabled: !!genres && inView,
      staleTime: Infinity,
    }
  );

  return (
    <ExpandableContainer data={data} path={path} observerRef={observerRef} />
  );
};
