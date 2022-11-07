export function StyledMainHeader(prop) {
  const { text, isanimateable, subtext } = prop.content;

  return (
    <>
      <div className="head-main-container">
        <div className="inner-content">
          <span>
            {isanimateable && <div className="ball"></div>}
            <h1>
              {text[0]}
              {isanimateable && <span className="anim-letter">{text[1]}</span>}
              {text[2]}
            </h1>
          </span>
          <span>
            <h1>{text[3]}</h1>
          </span>
        </div>
        <h3>{subtext}</h3>
      </div>
    </>
  );
}
