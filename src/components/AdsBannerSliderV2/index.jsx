"use client"
import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import 'swiper/css/free-mode';

import { Navigation, FreeMode } from "swiper/modules";
import { MyContext } from "@/context/ThemeProvider";
import BannerBoxV2 from "../bannerBoxV2";

const AdsBannerSliderV2 = (props) => {

  const context = useContext(MyContext);

  return (
    <div className="py-2 lg:py-5 w-full resBannersSlider">
      <Swiper
        slidesPerView={props.items}
        spaceBetween={15}
        navigation={context?.windowWidth < 992 ? false : true}
        modules={[Navigation, FreeMode]}
        freeMode={true}
        breakpoints={{
          300: {
            slidesPerView: 1,
            spaceBetween: 5,
          },
          450: {
            slidesPerView: 2,
            spaceBetween: 5,
          },
          750: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1100: {
            slidesPerView: 4,
            spaceBetween: 15,
          },
        }}
        className="smlBtn"
      >

      {
        props?.data?.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <BannerBoxV2 info={item?.alignInfo} item={item} image={item?.images[0]} link={"/"} />
            </SwiperSlide>
          )
        })

      }


      </Swiper>
    </div>
  );
};

export default AdsBannerSliderV2;
