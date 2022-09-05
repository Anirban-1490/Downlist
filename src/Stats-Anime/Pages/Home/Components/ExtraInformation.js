import animeSectionImage from "../../../Home_page_images/information-anime.JPG";
import characterSectionImage from "../../../Home_page_images/information-character.JPG";
import addingStuffToListGIF from "../../../Home_page_images/information-adding-stuff.gif";

import openSourceImages from "../../../Home_page_images/github-github-com.svg";

export function HomeExtraInformation() {
  return (
    <section className="home-section-2">
      <div className="flex-container">
        <div className="site-info-container">
          <div className="visual-content">
            <img src={animeSectionImage} className="anime-section-img" alt="" />
            <img
              src={characterSectionImage}
              className="character-section-img"
              alt=""
            />
          </div>
          <div className="line-separator line-separator-1"></div>
          <div className="information">
            <h3>At your fingertip </h3>
            <p>
              Check out your favorites from a large list of anime and character
              collection, new or even top ones.
            </p>
          </div>
        </div>
        <div className="site-info-container">
          <div className="visual-content">
            <img src={addingStuffToListGIF} className="addto-list-gif" alt="" />
          </div>
          <div className="line-separator"></div>
          <div className="information">
            <h3>Add it to your list</h3>
            <p>
              One click, to add your favorites into <span>your list.</span>
            </p>
          </div>
        </div>
        <div className="site-info-container">
          <div className="visual-content">
            <img src={openSourceImages} className="github-image" alt="" />
          </div>
          <div className="line-separator"></div>
          <div className="information">
            <h3>Open to all</h3>
            <p>
              <a
                href="https://github.com/Anirban-1490/Uplist"
                target={"_blank"}
                rel="noreferrer"
              >
                Uplist
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
