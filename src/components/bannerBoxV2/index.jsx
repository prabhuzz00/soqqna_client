import React from "react";
import "../bannerBoxV2/style.css";
import Link from "next/link";
import Image from "next/image";

const BannerBoxV2 = (props) => {
  return (
    <div className="bannerBoxV2 box w-full overflow-hidden rounded-md group relative">
      <Image
        fill
        src={props.image}
        alt="banner"
        className="w-full transition-all duration-150 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
      />

      <div
        className={`info absolute p-5 top-0 ${props.info === "left" ? "left-0" : "right-0"
          } w-[70%] h-[100%] z-50 flex items-center justify-center flex-col gap-2 
       ${props.info === "left" ? '' : 'pl-16'}`}
      >
        <h2 className="text-[14px] md:text-[18px] font-[600]">{props?.item?.bannerTitle}</h2>

        <span className="text-[20px] text-primary font-[600] w-full">
        {props?.item?.price?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
        </span>

        <div className="w-full">
          {
            props?.item?.subCatId !== undefined && props?.item?.subCatId !== null ?
              <Link href={`/products?subCatId=${props?.item?.subCatId}`} className="text-[16px] font-[600] link">SHOP NOW</Link>
              :

              <Link href={`/products?catId=${props?.item?.catId}`} className="text-[16px] font-[600] link">SHOP NOW</Link>

          }


        </div>
      </div>
    </div>
  );
};

export default BannerBoxV2;
