import { useStore } from "./useStore";

//* a custom hook to subscribe to a scroll event

export const useScroll = (callback) => {
  function subscribe(callback) {
    window.addEventListener("scroll", callback);

    return () => window.removeEventListener("scroll", callback);
  }

  return useStore(subscribe, callback);
};
