import { useEffect, useState } from "react";
import { useStore } from "./useStore";

//* a custom hook to subscribe to a window resize event

export const useWindowResize = () => {
  const [widthofWindow, setWindowWidth] = useState(undefined);

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

  const innerWidth = useStore(subscribe, callback);

  useEffect(() => {
    setWindowWidth(innerWidth);
  }, [innerWidth]);

  return widthofWindow;
};
