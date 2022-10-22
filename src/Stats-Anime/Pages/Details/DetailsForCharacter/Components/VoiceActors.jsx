import react from "react";
// import { Roles } from "../../Components/Roles";
import { ExpandableContainer } from "../../../../Components/ExpandableContainer/ExpandableContainer";
import { NoItemContiner } from "../../../../Components/NoItemFound/NoItemFound";

export const VoiceActors = react.memo(({ voiceactors }) => {
  if (!voiceactors.length) {
    return <NoItemContiner />;
  }

  const newData = voiceactors.map(
    ({ language, person: { mal_id, images, name } }) => {
      return {
        role: language,
        mal_id,
        images,
        name,
      };
    }
  );
  return <ExpandableContainer data={newData} />;
});
