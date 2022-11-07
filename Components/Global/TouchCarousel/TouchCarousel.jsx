import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css/bundle";
import carouselStyle from "./Carousel.module.scss";

import { Card } from "../Card/Card";

//* image slider component

export const TouchCarousel = ({ items, switch_details }) => {
  return (
    <>
      <Swiper
        className={carouselStyle["swiper"]}
        spaceBetween={12}
        slidesPerView={"auto"}
        navigation={true}
        modules={[Navigation]}
      >
        {items &&
          items.map((anime) => {
            const {
              mal_id,
              title,
              name,
              images: {
                jpg: { image_url },
              },
              type,
            } = anime;
            const mainTitle = title || name;
            const animeType = type || ``;
            const path = switch_details === "anime" ? `/anime` : `/character`;
            const props = { mal_id, image_url, path, mainTitle, animeType };
            return (
              <SwiperSlide
                className={carouselStyle["swiper-slide"]}
                key={mal_id}
              >
                <Card {...props} />
              </SwiperSlide>
            );
          })}
      </Swiper>
    </>
  );
};
