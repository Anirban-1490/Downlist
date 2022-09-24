import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  window.addEventListener("unload", () => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("ran");
  }, [pathname]);

  return null;
}
