import React from "react";
import { useEffect, useState, useRef } from "react";
import Fog from "vanta/dist/vanta.fog.min";

import homeStyle from "Style/Home/home.module.scss";
import { Content } from "Components/Home/MainContent";

import { HomeExtraInformation } from "Components/Home/ExtraInformation";
import { HomeHeader } from "Components/Home/BigHeader";
import { authorizeDomain } from "Feature/Authorize/AuthorizeDomain";

export default function HomeMain() {
  const mydiv = useRef();
  //* Vanta.js fog animated background initializer
  const [vantaEffect, setVantaEffect] = useState();

  const [parallaxEffect, setParallaxEffect] = useState();

  const [isMotionEnabled, setMotion] = useState(
    typeof window !== "undefined" &&
      window?.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    setMotion(window?.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  console.log(isMotionEnabled);

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
      import("simple-parallax-js").then((SimpleParallax) => {
        const instance = new SimpleParallax(mydiv.current, {
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
      <div className={homeStyle["inner-root-container"]}>
        <div
          className={homeStyle["container1"]}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          ref={mydiv}
        >
          <Content isMotionEnabled={isMotionEnabled} />
        </div>

        <HomeHeader />
        <HomeExtraInformation />
      </div>
    </>
  );
}
