"use client";
import React, { useContext } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

import { Navigation, FreeMode } from "swiper/modules";
import Link from "next/link";
import { MyContext } from "@/context/ThemeProvider";
import { useLanguage } from "@/context/LanguageContext";

const HomeCatSlider = (props) => {
  const context = useContext(MyContext);
  const { locale } = useLanguage();

  return (
    <div className="homeCatSlider pt-0 lg:pt-4 py-4 lg:py-8">
      <div className="container">
        <Swiper
          slidesPerView={8}
          spaceBetween={10}
          navigation={context?.windowWidth < 992 ? false : true}
          modules={[Navigation, FreeMode]}
          freeMode={true}
          breakpoints={{
            300: {
              slidesPerView: 4,
              spaceBetween: 5,
            },
            550: {
              slidesPerView: 5,
              spaceBetween: 5,
            },
            900: {
              slidesPerView: 5,
              spaceBetween: 5,
            },
            1100: {
              slidesPerView: 8,
              spaceBetween: 5,
            },
          }}
          className="mySwiper"
        >
          {props?.data?.map((cat, index) => {
            return (
              <SwiperSlide key={index}>
                <Link href={`/products?catId=${cat?._id}`} className="group">
                  <div className="item py-4 lg:py-7 px-3 bg-white rounbded-sm text-center flex items-center justify-center flex-col rounded-full w-[70px] h-[70px]  lg:w-[120px] lg:h-[120px] m-auto">
                    <img
                      src={cat?.images[0]}
                      className="w-[35px] lg:w-[50px] transition-all"
                    />
                  </div>
                  <h3 className="text-[12px] text-center lg:text-[15px] font-[600] mt-3 group-hover:text-primary">
                    {locale === "ar" ? cat?.arName : cat?.name}
                  </h3>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
};

export default HomeCatSlider;
