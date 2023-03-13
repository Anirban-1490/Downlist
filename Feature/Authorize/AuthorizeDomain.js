import { path } from "server-path";
import axios from "axios";
import { getRandomID } from "Feature/RandomID";

export const authorizeDomain = async (token) => {
    const uniqueID = getRandomID();

    return (
        await fetch(`${path.domain}api/v1/auth/authorize?reqID=${uniqueID}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    ).json();
};
