import React from "react";
import "./animestyle.css";
import "./topanimestyle.css";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
import 'swiper/swiper.min.css';
import default_img from "./logo/default-placeholder.png";

export const Mulimgslider =  (prop)=>
{
    const {items,switch_details} = prop;


   
    return <>
       <Swiper className="swiper" spaceBetween={10} slidesPerView={"auto"} >
            {items && items.map((anime) => {
                const { image_url, mal_id, title } = anime;
                return <SwiperSlide className="swiper-slide" key={mal_id}>
                    <div className="airing_container" >
                        {(image_url) ? <img src={image_url}  onError={(currentElement)=>currentElement.target.src = default_img} alt=""/> : ""}
                        <div className="more">
                            {title && <h3>{title}</h3>}
                            <div className="see-more-container">
                           
                                <Link className="see-more" to={(switch_details)? switch_details + `/${mal_id}`:""}>See more
                                </Link>
                                <ion-icon name="arrow-forward-outline"></ion-icon>
                            </div>
                        </div>
                    </div>

                </SwiperSlide>
            })}
       </Swiper>
    
    </>
}
