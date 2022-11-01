import { ExpandableContainer } from "Components/Global/ExpandableContainer/ExpandableContainer";
import { NoItemContiner } from "Components/Global/NoItemFound/NoItemFound";

export const Roles = ({ data, path }) => {
  if (!data) {
    return null;
  }
  if (!data.length) {
    return <NoItemContiner />;
  }

  const newData = data.map(({ role, character: { mal_id, images, name } }) => {
    return {
      role,
      mal_id,
      images,
      name,
    };
  });

  return <ExpandableContainer data={newData} path={path} />;
};
