import axios from "axios";

export const jikanQueries = async (key, ...params) => {
  const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

  const queries = {
    details: `https://api.jikan.moe/v4/anime/${params[0]}/full`,
    people_reaction: `https://api.jikan.moe/v4/anime/${params[0]}/statistics`,
    characters: `https://api.jikan.moe/v4/anime/${params[0]}/characters`,
    char_details: `https://api.jikan.moe/v4/characters/${params[0]}/full`,
    top_anime: `https://api.jikan.moe/v4/top/anime?filter=${params[0]}&page=${params[1]}&limit=${params[2]}`,
    top_char: `https://api.jikan.moe/v4/top/characters`,
  };
  await delay();
  return axios.get(queries[key]).then(({ data: { data } }) => data);
};
