import { useStore } from "./useStore";

//* a custom hook to subscribe to a window resize event

export const useWindowResize = () => {
  function subscribe(callback) {
    typeof window !== "undefined" &&
      window.addEventListener("resize", callback);

    return () =>
      typeof window !== "undefined" &&
      window.removeEventListener("resize", callback);
  }

  const callback = () => {
    return typeof window !== "undefined" && window.innerWidth;
  };

  return useStore(subscribe, callback);
};
