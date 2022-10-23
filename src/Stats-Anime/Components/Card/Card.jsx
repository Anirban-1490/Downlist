import Link from "next/link";
import cardStyle from "./Card.module.scss";
import placeholderImage from "../../logo/default-placeholder.png";

export const Card = ({
  mal_id,
  path,
  image_url,
  mainTitle,
  subTitle,
  animeType,
}) => {
  return (
    <>
      <Link
        href={path ? path + `/${mal_id}` : ``}
        className={cardStyle.cards}
        key={mal_id}
      >
        <a>
          <img
            src={image_url}
            alt=""
            onError={(e) => (e.currentTarget.src = placeholderImage)}
          />
          {animeType && <h3 className={cardStyle.type}>{animeType}</h3>}

          <div className={cardStyle["details-char"]}>
            <h5
              style={
                path === "/anime"
                  ? {
                      padding: "1em 0",
                    }
                  : null
              }
            >
              {mainTitle}
            </h5>
            {subTitle && <h5>{subTitle}</h5>}
          </div>
        </a>
      </Link>
    </>
  );
};
