import { useEffect } from "react";
import { useRouter } from "next/router";

export function ScrollToTop() {
  const { pathname } = useRouter();

  window.addEventListener("unload", () => {
    window.scrollTo(0, 0);
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("ran");
  }, [pathname]);

  return null;
}
