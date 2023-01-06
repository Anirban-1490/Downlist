import axios from "axios";

function setDelay(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

export const jikanQueries = async (key, malid, query = [], delay = 1000) => {
    const queries = {
        details: `https://api.jikan.moe/v4/anime/${malid}/full`,
        people_reaction: `https://api.jikan.moe/v4/anime/${malid}/statistics`,
        characters: `https://api.jikan.moe/v4/anime/${malid}/characters`,
        char_details: `https://api.jikan.moe/v4/characters/${malid}/full`,
        top_anime: `https://api.jikan.moe/v4/top/anime?filter=${query[0]}&page=${query[1]}&limit=${query[2]}`,
        top_char: `https://api.jikan.moe/v4/top/characters`,
    };
    await setDelay(delay);
    return axios.get(queries[key]).then(({ data: { data } }) => data);
};
