export function Loading({ loadingtext }) {
  return (
    <>
      <h3 style={{ color: "white" }} className="loading">
        {loadingtext}
      </h3>
    </>
  );
}
