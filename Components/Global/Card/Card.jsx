import { getUserToken } from "GetuserToken";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import cardStyle from "./Card.module.scss";

export const Card = ({
    mal_id,
    path,
    image_url,
    mainTitle,
    subTitle,
    animeType,
}) => {
    const [token, setToken] = useState();

    return (
        <>
            <Link href={path ? path + `/${mal_id}` : `/`}>
                <a className={cardStyle.cards} key={mal_id} title={mainTitle}>
                    <Image
                        layout="fill"
                        src={image_url}
                        alt={`${mainTitle}-image`}
                        onError={(e) =>
                            (e.currentTarget.src = "/default-placeholder.png")
                        }
                        placeholder="blur"
                        blurDataURL="/default-placeholder.png"
                    />

                    {/*                     
                    <img
                        src={image_url}
                        alt={`${mainTitle}-image`}
                        onError={(e) =>
                            (e.currentTarget.src = "/default-placeholder.png")
                        }
                    /> */}
                    {animeType && (
                        <h3 className={cardStyle.type}>{animeType}</h3>
                    )}

                    <div className={cardStyle["details"]}>
                        <h5>{mainTitle}</h5>
                        {subTitle && <h5>{subTitle}</h5>}
                    </div>
                </a>
            </Link>
        </>
    );
};
