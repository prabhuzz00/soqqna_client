import Image from 'next/image'
import React, { useContext } from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { MyContext } from '@/context/ThemeProvider';
import { FaRegImage } from "react-icons/fa6";

const HomeLoading = () => {
    const context = useContext(MyContext);

    return (
        <>
            <div className="homeSlider pb-3 pt-3 lg:pb-5 lg:pt-5 relative z-[99]">
                <div className="container">
                    <div className="flex items-center gap-2 animate-pulse relative w-full">
                        <Image src="/homeBannerPlaceholder.jpg" width={800} height={400} className='opacity-0 !w-full' alt='' />
                        <div className="flex items-center mb-3 justify-center w-full h-full bg-gray-300 rounded-lg  dark:bg-gray-700 absolute top-0 left-0 z-50">
                            <FaRegImage size={100} className='text-gray-400 ' />
                        </div>
                    </div>
                </div>
            </div>


            <div className="homeCatSlider homeCatSliderLoading pt-0 lg:pt-4 py-4 lg:py-8">
                <div className="container grid grid-cols-8 gap-10">
                    <div className="item py-4 lg:py-7 px-3 bg-gray-300 rounbded-sm text-center flex items-center justify-center flex-col rounded-full w-[70px] h-[70px]  lg:w-[120px] lg:h-[120px] m-auto animate-pulse">
                        <FaRegImage size={40} className='text-gray-400 ' />
                    </div>

                     <div className="item py-4 lg:py-7 px-3 bg-gray-300 rounbded-sm text-center flex items-center justify-center flex-col rounded-full w-[70px] h-[70px]  lg:w-[120px] lg:h-[120px] m-auto animate-pulse">
                        <FaRegImage size={40} className='text-gray-400 ' />
                    </div>

                     <div className="item py-4 lg:py-7 px-3 bg-gray-300 rounbded-sm text-center flex items-center justify-center flex-col rounded-full w-[70px] h-[70px]  lg:w-[120px] lg:h-[120px] m-auto animate-pulse">
                        <FaRegImage size={40} className='text-gray-400 ' />
                    </div>

                     <div className="item py-4 lg:py-7 px-3 bg-gray-300 rounbded-sm text-center flex items-center justify-center flex-col rounded-full w-[70px] h-[70px]  lg:w-[120px] lg:h-[120px] m-auto animate-pulse">
                        <FaRegImage size={40} className='text-gray-400 ' />
                    </div>

                     <div className="item py-4 lg:py-7 px-3 bg-gray-300 rounbded-sm text-center flex items-center justify-center flex-col rounded-full w-[70px] h-[70px]  lg:w-[120px] lg:h-[120px] m-auto animate-pulse">
                        <FaRegImage size={40} className='text-gray-400 ' />
                    </div>

                     <div className="item py-4 lg:py-7 px-3 bg-gray-300 rounbded-sm text-center flex items-center justify-center flex-col rounded-full w-[70px] h-[70px]  lg:w-[120px] lg:h-[120px] m-auto animate-pulse">
                        <FaRegImage size={40} className='text-gray-400 ' />
                    </div>

                     <div className="item py-4 lg:py-7 px-3 bg-gray-300 rounbded-sm text-center flex items-center justify-center flex-col rounded-full w-[70px] h-[70px]  lg:w-[120px] lg:h-[120px] m-auto animate-pulse">
                        <FaRegImage size={40} className='text-gray-400 ' />
                    </div>

                     <div className="item py-4 lg:py-7 px-3 bg-gray-300 rounbded-sm text-center flex items-center justify-center flex-col rounded-full w-[70px] h-[70px]  lg:w-[120px] lg:h-[120px] m-auto animate-pulse">
                        <FaRegImage size={40} className='text-gray-400 ' />
                    </div>
                    
                </div>
            </div>


        </>
    )
}

export default HomeLoading