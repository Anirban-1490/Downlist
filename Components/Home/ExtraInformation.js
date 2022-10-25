import extraStyle from "Components/Home/Style/Extra.module.scss";

export function HomeExtraInformation() {
  return (
    <section className={extraStyle["home-section-2"]}>
      <div className={extraStyle["flex-container"]}>
        <div className={extraStyle["site-info-container"]}>
          <div className={extraStyle["visual-content"]}>
            <img
              src="/information-anime.JPG"
              className={extraStyle["anime-section-img"]}
              alt=""
            />
            <img
              src={"/information-character.JPG"}
              className={extraStyle["character-section-img"]}
              alt=""
            />
          </div>
          <div
            className={`${extraStyle["line-separator"]} ${extraStyle["line-separator-1"]}`}
          ></div>
          <div className={extraStyle["information"]}>
            <h3>At your fingertip </h3>
            <p>
              Check out your favorites from a large list of anime and character
              collection, new or even top ones.
            </p>
          </div>
        </div>
        <div className={extraStyle["site-info-container"]}>
          <div className={extraStyle["visual-content"]}>
            <img
              src={"/information-adding-stuff.gif"}
              className={extraStyle["addto-list-gif"]}
              alt=""
            />
          </div>
          <div className={extraStyle["line-separator"]}></div>
          <div className={extraStyle["information"]}>
            <h3>Add it to your list</h3>
            <p>
              One click, to add your favorites into <span>your list.</span>
            </p>
          </div>
        </div>
        <div className={extraStyle["site-info-container"]}>
          <div className={extraStyle["visual-content"]}>
            <img
              src={"/github-github-com.svg"}
              className={extraStyle["github-image"]}
              alt=""
            />
          </div>
          <div className={extraStyle["line-separator"]}></div>
          <div className={extraStyle["information"]}>
            <h3>Open to all</h3>
            <p>
              <a
                href="https://github.com/Anirban-1490/Downlist.git"
                target={"_blank"}
                rel="noreferrer"
              >
                Downlist
              </a>
              is a open-source project, meaning anyone can contribute their new
              ideas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
