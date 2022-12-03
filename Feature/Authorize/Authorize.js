import { useQuery } from "react-query";

import { useRouter } from "next/router";
import { authorizeDomain } from "./AuthorizeDomain";
import { getUserToken } from "GetuserToken";

export const useAuth = (isenabled, redirect = false) => {
  console.log("did run");
  //? custom hook to check if user is logged in or not when routing to any page
  const router = useRouter();
  const token = getUserToken();

  const { data, isLoading } = useQuery(
    ["user", token],
    () => authorizeDomain(token),
    {
      refetchOnWindowFocus: false,
      retry: false,
      notifyOnChangeProps: ["data"],
      onSettled: (data, err) => {
        if (err) {
          return;
        }

        //*this will remove the current route(the signup route) from history stack so user's can't go back to it. and also redirect the user to the home page
        if (redirect) return router.replace("/");
      },
      enabled: !!isenabled,
      cacheTime: 0,
      staleTime: 100,
    }
  );

  return [data, isLoading];
};
