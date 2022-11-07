import { TouchCarousel } from "Components/Global/TouchCarousel/TouchCarousel";
import react from "react";

export const StyledSection = react.memo((prop) => {
  const { data, switch_details, text_, className } = prop;

  console.log(data);
  return (
    <>
      <div className={className}>
        <h2>{text_}</h2>
        <TouchCarousel items={data} switch_details={switch_details} />
      </div>
    </>
  );
});
