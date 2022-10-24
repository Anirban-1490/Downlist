import React from "react";
// import "./Styles/animestyle.css";
import { useEffect, useState, useRef } from "react";
import Fog from "vanta/dist/vanta.fog.min";

// import simpleParallax from ;
import { Content } from "Components/Home/MainContent";

import { HomeExtraInformation } from "Components/Home/ExtraInformation";
import { HomeHeader } from "Components/Home/BigHeader";

export default function HomeMain() {
  const mydiv = useRef();
  //* Vanta.js fog animated background initializer
  const [vantaEffect, setVantaEffect] = useState();

  const [parallaxEffect, setParallaxEffect] = useState();

  const isMotionEnabled =
    typeof window !== "undefined"
      ? window?.matchMedia("(prefers-reduced-motion: reduce)").matches
      : undefined;

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        Fog({
          el: mydiv.current,
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
      import("simple-parallax-js").then((simpleParallax) => {
        const instance = new simpleParallax(mydiv.current, {
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
      <div className="inner-root-container">
        <div className="parent-wrapper">
          <div
            className="container1"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            ref={mydiv}
          >
            <Content isMotionEnabled={isMotionEnabled} />
          </div>
        </div>
        <HomeHeader />
        <HomeExtraInformation />
      </div>
    </>
  );
}
