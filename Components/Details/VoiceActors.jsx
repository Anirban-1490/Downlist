import { ExpandableContainer } from "Components/Global/ExpandableContainer/ExpandableContainer";
import { NoItemContiner } from "Components/Global/NoItemFound/NoItemFound";
import react from "react";

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
