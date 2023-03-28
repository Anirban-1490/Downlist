import extraStyle from "Components/Home/Style/Extra.module.scss";

export function HomeExtraInformation() {
    return (
        <section className={extraStyle["home-section-2"]}>
            <div className={extraStyle["flex-container"]}>
                <div className={extraStyle["site-info-container"]}>
                    <div className={extraStyle["visual-content"]}>
                        <img
                            src="/top_anime.png"
                            className={extraStyle["anime-section-img"]}
                            alt="Top anime"
                        />
                        <img
                            src={"/top_character.png"}
                            className={extraStyle["character-section-img"]}
                            alt="Top character"
                        />
                    </div>
                    <div
                        className={`${extraStyle["line-separator"]} ${extraStyle["line-separator-1"]}`}></div>
                    <div className={extraStyle["information"]}>
                        <h3>At your fingertip </h3>
                        <p>
                            Check out your favorites from a large list of anime
                            and character collection, new or even top ones.
                        </p>
                    </div>
                </div>
                <div className={extraStyle["site-info-container"]}>
                    <div className={extraStyle["visual-content"]}>
                        <div>
                            <video
                                aria-label="add to list video"
                                loop={true}
                                className={extraStyle["list-video"]}
                                autoPlay={true}
                                muted={true}>
                                <source
                                    src="/downlist_add_to_list.mp4"
                                    type="video/mp4"
                                />
                                Sorry, your browser doesn't support embedded
                                videos, but don't worry, you can
                                <a href="/downlist_add_to_list.mp4">
                                    download the MP4
                                </a>
                                and watch it with your favorite video player!
                            </video>
                        </div>
                    </div>
                    <div className={extraStyle["line-separator"]}></div>
                    <div className={extraStyle["information"]}>
                        <h3>Add it to your list</h3>
                        <p>
                            One click, to add your favorites into{" "}
                            <span>your list.</span>
                        </p>
                    </div>
                </div>
                <div className={extraStyle["site-info-container"]}>
                    <div className={extraStyle["visual-content"]}>
                        <img
                            src={"/github-github-com.svg"}
                            className={extraStyle["github-image"]}
                            alt="Contribute to github"
                        />
                    </div>
                    <div className={extraStyle["line-separator"]}></div>
                    <div className={extraStyle["information"]}>
                        <h3>Open to all</h3>
                        <p>
                            <a
                                href="https://github.com/Anirban-1490/Downlist.git"
                                target={"_blank"}
                                rel="noreferrer">
                                Downlist
                            </a>
                            is a open-source project, meaning anyone can
                            contribute their new ideas.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
