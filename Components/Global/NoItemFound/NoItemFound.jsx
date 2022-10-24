import noitemStyle from "./NoItem.module.scss";

export const NoItem = ({ content }) => {
  return (
    <p className={noitemStyle["no-item-main"]}>
      {content || "Nothing to show here"}
    </p>
  );
};

export const NoItemContiner = ({ content }) => {
  return (
    <div className={noitemStyle["no-item-container"]}>
      {<NoItem content={content} />}
    </div>
  );
};
