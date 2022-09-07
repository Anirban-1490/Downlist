import react from "react";
import { Roles } from "../../Components/Roles";

export const VoiceActors = react.memo(({ voiceactors }) => {
  return <Roles char={voiceactors} />;
});
