import noitemStyle from "./NoItem.module.scss";

export const NoItem = ({ content, textColor }) => {
  return (
    <p
      className={noitemStyle["no-item-main"]}
      style={{ color: textColor || "#6a6969" }}
    >
      {content || "Nothing to show here"}
    </p>
  );
};

export const NoItemContiner = ({ content, textColor }) => {
  return (
    <div className={noitemStyle["no-item-container"]}>
      {<NoItem content={content} textColor={textColor} />}
    </div>
  );
};
