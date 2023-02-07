import { useRef, useEffect, useLayoutEffect } from "react";
import { gsap, random } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import ranmdomTextStyle from "Components/Home/Style/RandomizedText.module.scss";

export function HomeHeader() {
    const homeContainerRef = useRef();
    useEffect(() => {
        const ctx = gsap.context(() => {
            const bigHeaderTextTimeline = gsap.timeline({
                defaults: { ease: "power2.out" },
            });
            //#region - timeline animation
            bigHeaderTextTimeline
                .fromTo(
                    `.header-1 `,
                    {
                        opacity: 0,
                        scale: 1.2,
                    },
                    { opacity: 1, scale: 1 }
                )
                .set(`.header-1 `, {
                    backgroundImage:
                        "linear-gradient( 45deg, #12c2e9 , #c471ed, #f64f59)",
                    color: "transparent",
                })
                .fromTo(
                    `.header-1 `,
                    { backgroundPosition: "0 0" },
                    {
                        backgroundPosition: "100% 0",
                        duration: 3,
                    }
                )

                .fromTo(
                    `.header-2 `,
                    {
                        opacity: 0,
                        scale: 1.2,
                    },
                    { opacity: 1, scale: 1 },
                    "-=2"
                )
                .fromTo(
                    `.header-3 `,
                    {
                        opacity: 0,
                        scale: 1.2,
                    },
                    { opacity: 1, scale: 1 },
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
                .fromTo(
                    `.header-3 `,
                    { backgroundPosition: "0 0" },
                    {
                        backgroundPosition: "100% 0",
                        duration: 2,
                    }
                )
                .fromTo(
                    `.${ranmdomTextStyle["random-para"]}`,
                    {
                        xPercent: -100,
                    },
                    { xPercent: 0 }
                );

            //#endregion

            const scrollTrigger = ScrollTrigger.create({
                animation: bigHeaderTextTimeline,
                trigger: `.${ranmdomTextStyle["main-text-container"]}`,
                start: "top 15%",
                end: `+=${window.innerHeight * 2}`,
                pin: true,

                scrub: 1,
            });
        });

        return () => ctx.revert();
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
                </div>
                <div className={ranmdomTextStyle["para-container"]}>
                    <p className={ranmdomTextStyle["random-para"]}>
                        Explore a vast list of Anime and Characters. Comes with
                        full details on them.
                    </p>
                </div>
            </section>
        </>
    );
}
