import axios from "axios";
import { useQuery } from "react-query";

import { useProfileData } from "Stores/UserProfileData";

export const useProfile = (path, userID) => {
    const { update, profileData } = useProfileData();

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

            //* store the data in a global state
            update(data);
            return data.user.image;
        },
    });

    return [data, isError];
};
