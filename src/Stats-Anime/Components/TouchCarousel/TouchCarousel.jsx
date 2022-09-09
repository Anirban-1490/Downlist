import React from "react";

import "../../Pages/Top/Styles/topanimestyle.css";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react/swiper-react";
import "swiper/swiper.min.css";
import default_img from "../../logo/default-placeholder.png";

//* image slider component

export const TouchCarousel = ({ items, switch_details }) => {
  return (
    <>
      <Swiper className="swiper" spaceBetween={8} slidesPerView={"auto"}>
        {items &&
          items.map((anime) => {
            const {
              image_url,
              mal_id,
              title,
              name,
              images: {
                jpg: { image_url: newImageUrl },
              },
              type,
            } = anime;
            return (
              <SwiperSlide className="swiper-slide" key={mal_id}>
                <div className="airing_container">
                  <img
                    src={image_url || newImageUrl}
                    onError={(currentElement) =>
                      (currentElement.target.src = default_img)
                    }
                    alt=""
                  />
                  <div className="more">
                    {type && <h5 className="type">{type}</h5>}
                    {(title || name) && <h3>{title || name}</h3>}
                    <div className="see-more-container">
                      <Link
                        className="see-more"
                        to={switch_details ? switch_details + `/${mal_id}` : ""}
                      >
                        See more
                      </Link>
                      <ion-icon name="arrow-forward-outline"></ion-icon>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>
    </>
  );
};
