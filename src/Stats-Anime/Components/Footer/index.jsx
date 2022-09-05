import { Link } from "react-router-dom";

export function Footer({ marginTop }) {
  const year = new Date().getFullYear();
  return (
    <>
      <footer style={{ marginTop: `${marginTop}px` }}>
        <ul>
          <li>
            <Link to="/topanime">Anime</Link>
          </li>
          <li>
            <Link to="/topcharacters">Characters</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
        <div className="border"></div>
        <div className="important-links">
          <h3>
            Report a bug{" "}
            <a
              href="https://github.com/Anirban-1490/Uplist"
              target="_blank"
              rel="noreferrer"
            >
              <i class="fab fa-github"></i>
            </a>
          </h3>
          <h3>&copy;Uplist{year}</h3>
        </div>
      </footer>
    </>
  );
}
