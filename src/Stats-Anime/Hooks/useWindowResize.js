import { useStore } from "./useStore";

//* a custom hook to subscribe to a window resize event

export const useWindowResize = () => {
  function subscribe(callback) {
    window.addEventListener("resize", callback);

    return () => window.removeEventListener("resize", callback);
  }

  const callback = () => {
    return window.innerWidth;
  };

  return useStore(subscribe, callback);
};
