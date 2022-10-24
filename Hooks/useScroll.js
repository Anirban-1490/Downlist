import { useStore } from "./useStore";

//* a custom hook to subscribe to a scroll event

export const useScroll = (callback) => {
  function subscribe(callback) {
    typeof window !== "undefined" &&
      window.addEventListener("scroll", callback);

    return () =>
      typeof window !== "undefined" &&
      window.removeEventListener("scroll", callback);
  }

  return useStore(subscribe, callback);
};
