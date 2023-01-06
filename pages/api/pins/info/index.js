import map from "awaity/map";

import { jikanQueries } from "JikanQueries";

async function getPinnedItemsDetails(pinnedItems) {
    return await map(pinnedItems, async (malIdOfItem, index) => {
        const {
            images: {
                jpg: { image_url },
            },
            title,
            title_english,
        } = await jikanQueries("details", malIdOfItem, [], 1000 * index);

        return {
            image_url,
            mal_id: malIdOfItem,
            title,
            title_english,
        };
    });
}

export default async function pinsHandler(req, res) {
    const { pinnedItems } = req.body;

    try {
        const pinnedItemsDetails = await getPinnedItemsDetails(pinnedItems);

        res.status(200).json({ pinnedItemsDetails });
    } catch (error) {
        res.status(500).json({
            message: "something went wrong, Please try again.",
        });
    }
}
