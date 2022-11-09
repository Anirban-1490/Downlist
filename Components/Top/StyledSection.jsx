import { TouchCarousel } from "Components/Global/TouchCarousel/TouchCarousel";
import react from "react";
import mainSectionStyle from "Components/Top/style/StyledMainSection.module.scss";

export const StyledSection = react.memo((prop) => {
  const { data, switch_details, text_, headerColor } = prop;

  return (
    <>
      <div className={mainSectionStyle["section-wrapper"]}>
        <h2 style={{ color: headerColor }}>{text_}</h2>
        <TouchCarousel items={data} switch_details={switch_details} />
      </div>
    </>
  );
});
