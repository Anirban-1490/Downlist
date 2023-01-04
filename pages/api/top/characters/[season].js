import reduce from "awaity/reduce";
import axios from "axios";

function getYear() {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();

    if (month > 9) {
        return;
    }
    return year - 1;
}

async function fetchPopularCharacter({ season, year }) {
    const seasonalAnime = (
        await axios.get(`https://api.jikan.moe/v4/seasons/${year}/${season}`)
    ).data?.data.slice(0, 4);

    const characters = reduce(
        seasonalAnime,
        async (acc, anime) => {
            const { mal_id } = anime;

            //* delay before starting this request
            // await delay();

            //* get all characters of this anime
            const charactersOfAnime = (
                await axios.get(
                    `https://api.jikan.moe/v4/anime/${mal_id}/characters`
                )
            ).data?.data;

            //* array of only main roled characters
            const mainCharacters = await reduce(
                charactersOfAnime,
                async (accumulatedCharacters, { role, character }) => {
                    const { mal_id, name, images } = character;

                    //* if the character is a Main roled then put it in the accumulated array

                    if (role === "Main")
                        return [
                            ...accumulatedCharacters,
                            { mal_id, title: name, images },
                        ];
                    return accumulatedCharacters;
                },
                []
            );

            //* if the main roled characters array is not empty then put it in the accumulated array

            return !mainCharacters.length ? acc : [...acc, mainCharacters];
        },
        []
    );

    return characters;
}

export default async function handler(req, res) {
    const { season } = req.query;
    const yearForCharacters = getYear();

    try {
        const data = await fetchPopularCharacter({
            season,
            year: yearForCharacters,
        });
        const popularCharacters = data.flat(1);
        res.status(200).json({ popularCharacters });
    } catch (error) {
        res.status(500).json({
            message: "something went wrong, Please try again.",
        });
    }
}
