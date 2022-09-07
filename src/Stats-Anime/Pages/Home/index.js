import React from "react";
import "./Styles/animestyle.css";
import { useEffect, useState, useRef } from "react";
import Fog from "vanta/dist/vanta.fog.min";

import simpleParallax from "simple-parallax-js";

import { Content } from "./Components/MainContent";
import { HomeExtraInformation } from "./Components/ExtraInformation";
import { HomeHeader } from "./Components/BigHeader";

export function HomeMain() {
  const mydiv = useRef();
  //* Vanta.js fog animated background initializer
  const [vantaEffect, setVantaEffect] = useState();

  const [parallaxEffect, setParallaxEffect] = useState();

  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        Fog({
          el: mydiv.current,
          highlightColor: 0xe2b34,
          midtoneColor: 0x98368b,
          lowlightColor: 0x9285cf,
          baseColor: 0x148b93,
          speed: 1.3,
          zoom: 0.6,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  useEffect(() => {
    console.log(document.querySelector(".vanta-canvas"));
    if (!parallaxEffect) {
      const instance = new simpleParallax(mydiv.current, {
        scale: 2.1,
        orientation: "down",
        customWrapper: ".parent-wrapper",
      });
      setParallaxEffect(instance);
    }
    return () => {
      parallaxEffect?.destroy();
    };
  }, [parallaxEffect]);

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
            <Content />
          </div>
        </div>
        <HomeHeader />
        <HomeExtraInformation />
      </div>
    </>
  );
}
