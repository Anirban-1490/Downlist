import { v4 as generateUUID } from "uuid";

export function getRandomID() {
    return generateUUID();
}
