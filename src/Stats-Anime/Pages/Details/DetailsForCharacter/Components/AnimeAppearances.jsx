import react from "react";
import { Roles } from "../../Components/Roles";

export const AnimeAppearances = react.memo(({ appearances }) => {
  return <Roles char={appearances} path={`/anime`} />;
});
