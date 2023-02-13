import animeGenreStyle from "Components/AnimeContent/Style/AnimeGenre.module.scss";
import { Card } from "Components/Global/Card/Card";
import { CircularSpinner } from "Components/Global/CircularSpinner";
import { forwardRef } from "react";
import { Container } from "Style/EmotionComponents";

export const AnimeGenre = forwardRef(
    ({ headerContent, data, hasNextPage, isCharacters = false }, ref) => {
        return (
            <>
                <Container minHeight={"100vh"} style={{ paddingTop: "24vh" }}>
                    <h2 className={animeGenreStyle["header"]}>
                        {headerContent} {(!isCharacters && "anime") || " "}
                    </h2>
                    <div className={animeGenreStyle["cards-container"]}>
                        {data.map(({ data: animeArray }) => {
                            return animeArray.map(
                                ({
                                    mal_id,
                                    images: {
                                        jpg: { image_url },
                                    },
                                    title_english,
                                    title,
                                    type,
                                    name,
                                }) => {
                                    return (
                                        <Card
                                            mal_id={mal_id}
                                            image_url={image_url}
                                            mainTitle={
                                                title_english || title || name
                                            }
                                            animeType={type}
                                            path={
                                                !isCharacters
                                                    ? `/anime`
                                                    : "/character"
                                            }
                                        />
                                    );
                                }
                            );
                        })}
                    </div>

                    <div className={animeGenreStyle["loading"]} ref={ref}>
                        {hasNextPage ? (
                            <CircularSpinner enabled={hasNextPage} />
                        ) : (
                            "Looks like that's it"
                        )}
                    </div>
                </Container>
            </>
        );
    }
);
