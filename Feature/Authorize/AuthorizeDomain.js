import { v4 as generateUUID } from "uuid";
import { path } from "server-path";
import axios from "axios";

export const authorizeDomain = async (token) => {
  const uniqueID = generateUUID();

  return (
    await axios.get(`${path.domain}api/v1/auth/authorize?reqID=${uniqueID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  ).data;
};
