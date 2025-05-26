"use client";
import React, { useContext, useRef, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { MyContext } from "@/context/ThemeProvider";
import Image from "next/image";

export const ProductZoom = (props) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const zoomSliderBig = useRef();
  const zoomSliderSml = useRef();

  const context = useContext(MyContext);

  const goto = (index) => {
    setSlideIndex(index);
    zoomSliderSml.current.swiper.slideTo(index);
    zoomSliderBig.current.swiper.slideTo(index);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="slider w-full lg:w-[15%] order-2 lg:order-1">
          <Swiper
            ref={zoomSliderSml}
            direction={context?.windowWidth < 992 ? "horizontal" : "vertical"}
            slidesPerView={5}
            spaceBetween={10}
            navigation={context?.windowWidth < 992 ? false : true}
            modules={[Navigation]}
            className={`zoomProductSliderThumbs h-auto lg:h-[500px] overflow-hidden ${
              props?.images?.length > 5 && "space"
            }`}
          >
            {props?.images?.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <div
                    className={`item rounded-md overflow-hidden cursor-pointer group h-[100%] ${
                      slideIndex === index ? "opacity-1" : "opacity-30"
                    }`}
                    onClick={() => goto(index)}
                  >
                    <img src={item} />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className="zoomContainer w-full lg:w-[85%] h-auto lg:h-[500px] overflow-hidden rounded-md  order-1 lg:order-2">
          <Swiper
            ref={zoomSliderBig}
            slidesPerView={1}
            spaceBetween={0}
            navigation={false}
          >
            {props?.images?.map((item, index) => {
              return (
                <SwiperSlide key={index}>
                  <InnerImageZoom zoomType="hover" zoomScale={1} src={item} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

// "use client";
// import React, { useContext, useRef, useState, useCallback } from "react";
// import InnerImageZoom from "react-inner-image-zoom";
// import "react-inner-image-zoom/lib/InnerImageZoom/styles.css";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import { Navigation } from "swiper/modules";
// import { MyContext } from "@/context/ThemeProvider";
// import Image from "next/image";

// export const ProductZoom = ({ images = [] }) => {
//   const [slideIndex, setSlideIndex] = useState(0);
//   const zoomSliderBig = useRef(null);
//   const zoomSliderSml = useRef(null);
//   const context = useContext(MyContext);

//   const goto = useCallback((index) => {
//     setSlideIndex(index);
//     if (zoomSliderSml.current?.swiper) {
//       zoomSliderSml.current.swiper.slideTo(index);
//     }
//     if (zoomSliderBig.current?.swiper) {
//       zoomSliderBig.current.swiper.slideTo(index);
//     }
//   }, []);

//   if (!images.length) {
//     return (
//       <div className="flex items-center justify-center h-[500px] bg-gray-100 rounded-md">
//         <Image
//           src="/default-image.jpg"
//           alt="No image available"
//           width={200}
//           height={200}
//           className="opacity-50"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col lg:flex-row gap-3">
//       <div className="slider w-full lg:w-[150px] order-2 lg:order-1">
//         <Swiper
//           ref={zoomSliderSml}
//           direction={context?.metadata?.windowWidth < 768 ? "horizontal" : "vertical"}
//           slidesPerView={5}
//           spaceBetween={10}
//           navigation={context?.metadata?.windowWidth < 768 ? undefined : true}
//           modules={[Navigation]}
//           className={`zoomProductSliderThumbs h-auto lg:h-[400px] overflow-y-auto ${images.length > 5 ? "space" : ""}`}
//         >
//           {images.map((item, index) => (
//             <SwiperSlide key={item}>
//               <div
//                 className={`item rounded-md overflow-hidden h-[80px] cursor-pointer group ${slideIndex === index ? "opacity-100 border-2 border-primary" : "opacity-60 hover:opacity-80"}`}
//                 onClick={() => goto(index)}
//                 role="button"
//                 aria-label={`Select image ${index + 1}}`}
//               >
//                 <Image
//                   src={item}
//                   alt={`Thumbnail ${index + 1}`}
//                   width={80}
//                   height={80}
//                   className="object-contain w-full h-full rounded-md"
//                   loading="lazy"
//                   sizes="(max-width: 768px) 20vw, 10vw"
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       <div className="zoomContainer w-full lg:w-[calc(100%-170px)] h-[300px] sm:h-[400px] lg:h-[400px] overflow-hidden rounded-md order-1 lg:order-2 relative">
//         <Swiper
//           ref={zoomSliderBig}
//           slidesPerView={1}
//           spaceBetween={0}
//           navigation={false}
//           modules={[Navigation]}
//           className="h-full w-full"
//         >
//           {images.map((item, index) => (
//             <SwiperSlide key={item}>
//               <div className="relative w-full h-full">
//                 <InnerImageZoom
//                   zoomType="hover"
//                   zoomScale={1.5}
//                   src={item}
//                   imgAttributes={{
//                     alt: `Product image ${index + 1}`,
//                     className: "object-contain w-full h-full rounded-md",
//                   }}
//                   zoomSrc={item}
//                   fullscreenOnMobile={false}
//                   className="w-full h-full"
//                 />
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>
//     </div>
//   );
// };
