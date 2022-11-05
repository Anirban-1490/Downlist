import { ExpandableContainer } from "Components/Global/ExpandableContainer/ExpandableContainer";
import { NoItemContiner } from "Components/Global/NoItemFound/NoItemFound";
import react from "react";

export const AnimeAppearances = react.memo(({ appearances }) => {
  if (!appearances.length) {
    return <NoItemContiner />;
  }

  const newData = appearances.map(
    ({ role, anime: { mal_id, images, title } }) => {
      return {
        role,
        mal_id,
        images,
        name: title,
      };
    }
  );
  return <ExpandableContainer data={newData} path={"/anime"} />;
});
