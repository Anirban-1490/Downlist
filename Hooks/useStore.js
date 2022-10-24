import { useCallback } from "react";
import { useSyncExternalStore } from "use-sync-external-store/shim";

export const useStore = (subscribe, getSnapshot) => {
  return useSyncExternalStore(
    subscribe,
    useCallback(() => getSnapshot(), [getSnapshot]) // * a memorized function to check if the subscribed data has changed from the last time
  );
};
