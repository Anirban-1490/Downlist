import { path } from "server-path";
import axios from "axios";
import { getRandomID } from "Feature/RandomID";

export const authorizeDomain = async (token) => {
    const uniqueID = getRandomID();

    return (
        await axios.get(
            `${path.domain}api/v1/auth/authorize?reqID=${uniqueID}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
    ).data;
};
