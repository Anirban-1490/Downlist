import Link from "next/link";
import cardStyle from "./Card.module.scss";

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
      <Link href={path ? path + `/${mal_id}` : ``}>
        <a className={cardStyle.cards} key={mal_id}>
          <img
            src={image_url}
            alt=""
            onError={(e) => (e.currentTarget.src = "/default-placeholder.png")}
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
