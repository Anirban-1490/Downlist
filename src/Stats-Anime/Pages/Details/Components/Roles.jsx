import { ExpandableContainer } from "../../../Components/ExpandableContainer/ExpandableContainer";

export const Roles = ({ data, path }) => {
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
