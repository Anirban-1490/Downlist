import axios from "axios";

export const jikanQueries = (key, params) => {
  const queries = {
    details: `https://api.jikan.moe/v4/anime/${params}/full`,
    people_reaction: `https://api.jikan.moe/v4/anime/${params}/statistics`,
    characters: `https://api.jikan.moe/v4/anime/${params}/characters`,
  };

  return axios.get(queries[key]).then(({ data: { data } }) => data);
};
