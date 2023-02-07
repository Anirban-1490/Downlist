/** @jsxImportSource @emotion/react  */

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export const WrapperParent = ({ children, setAnimating }) => {
    const [isDividerMount, setDividerMount] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set("#__next", { overflow: "hidden" });
            // gsap.set(`.outer`, { yPercent: 100 });
            // gsap.set(".inner", { yPercent: -100 });

            const globalTimeline = gsap.timeline({
                defaults: { duration: 1, ease: "power3.inOut" },
                onComplete: () => {
                    ScrollTrigger.refresh();
                    setDividerMount(true);
                },
            });

            globalTimeline.fromTo(
                ".divider",
                {
                    xPercent: 0,
                },
                {
                    xPercent: -100,
                    stagger: {
                        each: 0.14,
                        from: "random",
                    },
                    delay: 2,
                }
            );
        });

        return () => ctx.revert();
    }, []);
    return (
        <>
            <main className="global-wrapper">
                <div className="outer">
                    {!isDividerMount && (
                        <div className="divider-container">
                            <div
                                className="divider divider-1"
                                key={"divider-1"}></div>
                            <div
                                className="divider divider-2"
                                key={"divider-2"}></div>
                            <div
                                className="divider divider-3"
                                key={"divider-3"}></div>
                        </div>
                    )}
                    <div className="inner">{children}</div>
                </div>
            </main>
        </>
    );
};
