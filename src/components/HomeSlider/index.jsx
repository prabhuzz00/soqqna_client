import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

import { Navigation, Autoplay } from "swiper/modules";
import { MyContext } from "@/context/ThemeProvider";
import Image from "next/image";

const HomeSlider = (props) => {

  const context  = useContext(MyContext);

  return (
    <div className="homeSlider pb-3 pt-3 lg:pb-5 lg:pt-5 relative z-[99]">
      <div className="container">
        <Swiper
          loop={props?.data?.length > 1 ? true : false}
          spaceBetween={10}
          navigation={context?.windowWidth < 992 ? false : true}
          modules={[Navigation, Autoplay]}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          className="sliderHome"
        >
          {props?.data?.length !== 0 &&
            props?.data
              ?.slice()
              ?.reverse()
              ?.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="item rounded-[10px] overflow-hidden relative">
                    <Image
                      width={1343}
                      height={397}
                      src={item?.images[0]}
                      alt="Banner slide"
                      className="!w-full !h-auto"
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeSlider;
