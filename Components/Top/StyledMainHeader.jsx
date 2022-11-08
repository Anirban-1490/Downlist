import mainHeaderStyle from "Components/Top/style/MainHeader.module.scss";

export function StyledMainHeader(prop) {
  const { text, isanimateable, subtext } = prop.content;

  return (
    <>
      <div className={mainHeaderStyle["head-main-container"]}>
        <div className={mainHeaderStyle["inner-content"]}>
          <h1>
            {text[0]}
            {isanimateable && <div className={mainHeaderStyle["ball"]}></div>}
          </h1>

          <h1>{text[1]}</h1>
        </div>
        <h3>{subtext}</h3>
      </div>
    </>
  );
}
