import React from "react";
import { useEffect, useState, useRef } from "react";
import Fog from "vanta/dist/vanta.fog.min";

import homeStyle from "Style/Home/home.module.scss";
import { Content } from "Components/Home/MainContent";

import { HomeExtraInformation } from "Components/Home/ExtraInformation";
import { HomeHeader } from "Components/Home/BigHeader";
import { authorizeDomain } from "Feature/Authorize/AuthorizeDomain";
import { Container } from "Style/EmotionComponents";
import { CustomHead } from "Components/Global/CustomHead";

export default function HomeMain() {
    const containerRef = useRef();
    //* Vanta.js fog animated background initializer
    const [vantaEffect, setVantaEffect] = useState();

    const [parallaxEffect, setParallaxEffect] = useState();
    const isMotionEnabled =
        typeof window !== "undefined" &&
        window?.matchMedia("(prefers-reduced-motion: reduce)").matches;

    useEffect(() => {
        if (!vantaEffect) {
            setVantaEffect(
                Fog({
                    el: containerRef.current,
                    highlightColor: 0x435778,
                    midtoneColor: 0x826e96,
                    lowlightColor: 0xff7a50,
                    baseColor: 0x9c9c9d,
                    speed: 1.3,
                    zoom: 1,
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    useEffect(() => {
        if (!parallaxEffect && !isMotionEnabled) {
            import("simple-parallax-js").then((SimpleParallax) => {
                const instance = new SimpleParallax(containerRef.current, {
                    scale: 2.1,
                    orientation: "down",
                    customWrapper: ".parent-wrapper",
                });
                setParallaxEffect(instance);
            });
        }
        return () => {
            parallaxEffect?.destroy();
        };
    }, [parallaxEffect, isMotionEnabled]);

    return (
        <>
            <CustomHead
                description={
                    "Discover Huge Library of Anime and see your favourite characters"
                }
                contentTitle={"Downlist | Home of Anime"}
            />
            <div className={homeStyle["inner-root-container"]}>
                <Container
                    ref={containerRef}
                    minHeight="108vh"
                    displyStyle="flex-center-hv">
                    <Content isMotionEnabled={isMotionEnabled} />
                </Container>

                <HomeHeader />
                <HomeExtraInformation />
            </div>
        </>
    );
}
