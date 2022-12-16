import axios from "axios";
import { useQuery } from "react-query";
import { path } from "server-path";

export function useToplist(switch_item, userID) {
    //* get users saved anime or character list
    async function getUserTopItems(switch_item, userID) {
        return (
            await axios.get(
                `${path.domain}user/${userID}/list/${switch_item}/top`
            )
        ).data.DetailedSavedTopAnime;
    }

    const { data, isError, isLoading } = useQuery(
        ["topFromList", switch_item, userID],
        () => getUserTopItems(switch_item, userID),
        {
            refetchOnWindowFocus: false,
            staleTime: 200,
            enabled: !!userID,
        }
    );

    return [data, isError, isLoading];
}
