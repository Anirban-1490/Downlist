import { TouchCarousel } from "Components/Global/TouchCarousel/TouchCarousel";
import react from "react";
import mainSectionStyle from "Components/Top/style/StyledMainSection.module.scss";

export const StyledSection = react.memo(
  ({
    data,
    switch_details,
    text_,
    headerColor,
    subHeadingText,
    subHeaderColor = "#ffffffa7",
  }) => {
    return (
      <>
        <div className={mainSectionStyle["section-wrapper"]}>
          <h2 style={{ color: headerColor }}>
            {text_}
            <h4 style={{ color: subHeaderColor }}>{subHeadingText}</h4>
          </h2>

          <TouchCarousel items={data} switch_details={switch_details} />
        </div>
      </>
    );
  }
);
