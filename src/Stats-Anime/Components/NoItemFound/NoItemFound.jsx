import "./NoItem.scss";

export const NoItem = ({ content }) => {
  return <p className="no-item-main">{content || "Nothing to show here"}</p>;
};

export const NoItemContiner = ({ content }) => {
  return (
    <div className="no-item-container">{<NoItem content={content} />}</div>
  );
};
