import react from "react";
import { NoItemContiner } from "../../../../Components/NoItemFound/NoItemFound";
// import { Roles } from "../../Components/Roles";
// NoItemContiner
import { ExpandableContainer } from "../../../../Components/ExpandableContainer/ExpandableContainer";

export const AnimeAppearances = react.memo(({ appearances }) => {
  console.log(appearances);

  if (!appearances.length) {
    return <NoItemContiner />;
  }

  const newData = appearances.map(
    ({ language, anime: { mal_id, images, title } }) => {
      return {
        role: language,
        mal_id,
        images,
        name: title,
      };
    }
  );
  return <ExpandableContainer data={newData} />;
});
