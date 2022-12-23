import axios from "axios";
import { useQuery } from "react-query";
import { Appcontext } from "context";

import { useContext } from "react";

export const useProfile = (path, userID) => {
    const { changeUserProfileDetails } = useContext(Appcontext);

    async function fetchUserProfile() {
        return (await axios.get(`${path.domain}user/${userID}/profile/view`))
            .data;
    }
    const { data, isError } = useQuery(["profile", userID], fetchUserProfile, {
        refetchOnWindowFocus: false,
        cacheTime: 0,
        enabled: !!userID,
        notifyOnChangeProps: ["data"],

        onSettled: (data, err) => {
            if (err) return console.log(err);

            changeUserProfileDetails(data); //*store the data in the context
            return data.user.image;
        },
    });

    return [data, isError];
};
