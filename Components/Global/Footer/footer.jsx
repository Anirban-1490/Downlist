import footerStyle from "Components/Global/Footer/footer.module.scss";
import Link from "next/link";
import { AnyIcons } from "../AnyIcons/AnyIcons";

export function Footer() {
    return (
        <footer className={footerStyle["footer"]}>
            <div className={footerStyle["footer-inner"]}>
                <div className={footerStyle["logo-section"]}>
                    <Link href={"/"}>
                        <a className={footerStyle["logo-container"]}>
                            <img
                                src={"/DownlistLogoNew.svg"}
                                alt="downlistlogo"
                            />
                        </a>
                    </Link>
                    <p>One place for all your anime-needs.</p>
                    <div className={footerStyle["social-links"]}>
                        <Link
                            href={
                                "https://www.linkedin.com/in/anirban-pratihar-48a591226/"
                            }>
                            <a target={"_blank"} rel="noreferrer">
                                <AnyIcons badgeIcon={"logo-linkedin"} />
                            </a>
                        </Link>
                        <Link href={"https://github.com/Anirban-1490/Downlist"}>
                            <a target={"_blank"} rel="noreferrer">
                                <AnyIcons badgeIcon={"logo-github"} />
                            </a>
                        </Link>
                    </div>
                </div>
                <div className={footerStyle["nav-links"]}>
                    <div className={footerStyle["column"]}>
                        <h2 className={footerStyle["header"]}>Anime</h2>
                        <ul>
                            <li>
                                <Link href={"/topanime"}>
                                    <a>Topanime</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={"/"}>
                                    <a>Top 50 Anime</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={"/"}>
                                    <a>Top 50 Upcoming</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={"/"}>
                                    <a>Top 50 Airing</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className={footerStyle["column"]}>
                        <h2 className={footerStyle["header"]}>Characters</h2>
                        <ul>
                            <li>
                                <Link href={"/topcharacters"}>
                                    <a>Topcharacters</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={"/"}>
                                    <a>Top 50 Characters</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={"/"}>
                                    <a>Summer Toppers</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={"/"}>
                                    <a>Winter Toppers</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className={footerStyle["column"]}>
                        <h2 className={footerStyle["header"]}>About</h2>
                        <ul>
                            <li>
                                <Link href={"/about"}>
                                    <a>About Downlist</a>
                                </Link>
                            </li>
                            <li>
                                <Link href={"/"}>
                                    <a>About Me</a>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <h4 className={footerStyle["copyright"]}>
                Copyright &#169; {new Date().getFullYear()}, Downlist
            </h4>
        </footer>
    );
}
