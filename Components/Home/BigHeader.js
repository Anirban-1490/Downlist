import { useRef, useEffect } from "react";
import { gsap, random } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import ranmdomTextStyle from "Components/Home/Style/RandomizedText.module.scss";

export function HomeHeader() {
    const homeContainerRef = useRef();

    let colors = [
        "lightgreen",
        "#FFD700",
        "#FF6103",
        "#ADD8E6",
        "#D4C2B0",
        "#D15D84",
    ];

    useEffect(() => {
        const tl = gsap.timeline({ ease: "power2.in" });

        tl.from(`.header-1 `, {
            opacity: 0,
            scale: 1.2,
        })
            .set(`.header-1 `, {
                backgroundImage:
                    "linear-gradient( 45deg, #12c2e9 , #c471ed, #f64f59)",
                color: "transparent",
            })
            .to(`.header-1 `, {
                backgroundPosition: "100% 0",
                duration: 3,
            })

            .from(
                `.header-2 `,
                {
                    opacity: 0,
                    scale: 1.2,
                },
                "-=2"
            )
            .from(
                `.header-3 `,
                {
                    opacity: 0,
                    scale: 1.2,
                },
                "-=1.5"
            )
            .set(
                `.header-3 `,
                {
                    backgroundImage:
                        "linear-gradient( 45deg, #ef8e38 , #108dc7)",
                    color: "transparent",
                },
                "-=1"
            )
            .to(`.header-3 `, {
                backgroundPosition: "100% 0",
                duration: 2,
            });

        const scrollTrigger = ScrollTrigger.create({
            animation: tl,
            trigger: `.${ranmdomTextStyle["main-text-container"]}`,
            start: "top 10%",

            end: `+=${window.innerHeight * 5}`,
            pin: true,
            anticipatePin: 1,
            scrub: 1,
        });

        return () => {
            tl.kill();
            scrollTrigger.kill();
            return;
        };
    }, []);

    return (
        <>
            <section
                className={ranmdomTextStyle["home-section-1"]}
                ref={homeContainerRef}>
                <div className={ranmdomTextStyle["main-text-container"]}>
                    <h1
                        className={`${ranmdomTextStyle["random-header"]} header-1`}>
                        <div className={ranmdomTextStyle["letter"]}>y</div>
                        <div className={ranmdomTextStyle["letter"]}>o</div>
                        <div className={ranmdomTextStyle["letter"]}>u</div>
                        <div className={ranmdomTextStyle["letter"]}>r</div>
                    </h1>
                    <h1
                        className={`${ranmdomTextStyle["random-header"]} header-2`}>
                        <div className={ranmdomTextStyle["letter"]}>o</div>
                        <div className={ranmdomTextStyle["letter"]}>w</div>
                        <div className={ranmdomTextStyle["letter"]}>n</div>
                    </h1>
                    <h1
                        className={`${ranmdomTextStyle["random-header"]} header-3`}>
                        <div className={ranmdomTextStyle["letter"]}>w</div>
                        <div className={ranmdomTextStyle["letter"]}>o</div>
                        <div className={ranmdomTextStyle["letter"]}>r</div>
                        <div className={ranmdomTextStyle["letter"]}>l</div>
                        <div className={ranmdomTextStyle["letter"]}>d</div>
                    </h1>
                    {/* <p className={ranmdomTextStyle["random-para"]}>
                        Explore a vast list of Anime and Characters. Comes with
                        full details on them.
                    </p> */}
                </div>
            </section>
        </>
    );
}
