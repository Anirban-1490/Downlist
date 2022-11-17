import { NoItem } from "Components/Global/NoItemFound/NoItemFound";
import topFromListStyle from "Components/Top/style/TopList.module.scss";
import { useToplist } from "Hooks/useTopList";

export const TopFromlist = ({ switch_details, userId }) => {
  const [listitem, listCount] = useToplist(switch_details, userId);
  return (
    <>
      <div className={topFromListStyle["main-container"]}>
        <h2 className={topFromListStyle["main-heading"]}>
          From your inventory
        </h2>
        <div
          className={`${topFromListStyle["inner-container"]} ${
            !listCount && topFromListStyle["no-item"]
          }`}
        >
          {!listCount ? <NoItem /> : ""}
        </div>
      </div>
    </>
  );
};
