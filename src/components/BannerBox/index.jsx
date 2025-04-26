
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BannerBox = (props) => {
  return (
    <div className="box bannerBox overflow-hidden rounded-lg group">
      {
        props?.item?.subCatId !== undefined && props?.item?.subCatId !== null &&  props?.item?.subCatId !== ""  ?
          <Link href={`/products?subCatId=${props?.item?.subCatId}`} className="text-[16px] font-[600] link relative">
            <Image width={400} height={233} src={props.img} className="w-full transition-all group-hover:scale-105 group-hover:rotate-1" alt="banner" />
          </Link>
          :

          <Link href={`/products?catId=${props?.item?.catId}`} className="text-[16px] font-[600] link">
        
            <Image width={400} height={233} src={props.img} className="w-full transition-all group-hover:scale-105 group-hover:rotate-1" alt="banner" />
          </Link>

      }

    </div>
  );
};

export default BannerBox;
