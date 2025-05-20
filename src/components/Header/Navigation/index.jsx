"use client";
import Button from "@mui/material/Button";
import React, { useContext, useEffect, useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { LiaAngleDownSolid } from "react-icons/lia";
import { GoRocket } from "react-icons/go";
// import CategoryPanel from "./CategoryPanel";

import "../Navigation/style.css";
// import MobileNav from "./MobileNav";
import { MyContext } from "@/context/ThemeProvider";
import Link from "next/link";
import CategoryPanel from "./CategoryPanel";
import MobileNav from "./MobileNav";
import { useTranslation } from "@/utils/useTranslation";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Collapse } from "react-collapse";
import MobileMenu from "./MobileMenu";
import { useLanguage } from "@/context/LanguageContext";
import { RiGridFill } from "react-icons/ri";

const Navigation = (props) => {
  const [isOpenCatPanel, setIsOpenCatPanel] = useState(false);
  const [catData, setCatData] = useState([]);
  const [MyCatProdData, setCatProd] = useState([]);

  const context = useContext(MyContext);
  const { locale } = useLanguage();

  const { t } = useTranslation();

  useEffect(() => {
    setCatData(context?.catData);
  }, [context?.catData]);

  useEffect(() => {
    setCatProd(context?.catData);
  }, [context?.catData]);

  // useEffect(() => {
  //   setIsOpenCatPanel(props.isOpenCatPanel);
  // }, [props.isOpenCatPanel]);

  const openCategoryPanel = () => {
    setIsOpenCatPanel(!isOpenCatPanel);
    props.setIsOpenCatPanel(!isOpenCatPanel)
  };

  return (
    <>
      <nav className="navigation bg-gray-900 relative">
        <div className="container flex items-center justify-start lg:justify-end gap-8">
          {context?.windowWidth > 992 && (
            <div className="col_1 w-[20%] static">
              <Button
                className="!text-gray-300 !font-[600] gap-2 w-full"
                onClick={openCategoryPanel}
              >
                <RiMenu2Fill className="text-[18px]" />
                {t("header.shopByCategories")}
                <LiaAngleDownSolid className="text-[13px] ml-auto font-bold" />
              </Button>

              <div
                className="categoryDropdownMwnu w-full h-auto bg-white absolute 
              top-[100%] left-0 z-[100] shadow-md"
              >
                <Collapse isOpened={isOpenCatPanel}>
                  <div className="flex gap-4 py-4">
                    <ul className="mb-0 p-2 pl-8 w-[300px]">
                      {catData?.length !== 0 &&
                        catData
                          ?.filter((cat, idx) => idx < 8)
                          ?.map((cat, index) => {
                            return (
                              <li
                                className="list-none static w-full group mb-1"
                                key={index}
                              >
                                <Link
                                  href={`/products?catId=${cat?._id}`}
                                  className="link transition text-[14px] !font-[500]"
                                >
                                  <Button className={`link transition !font-[500] !text-gray-800 hover:!text-black !py-2 !w-full !text-left !justify-start hover:!bg-gray-200 `}>
                                    <img
                                      src={cat?.images[0]}
                                      alt="image"
                                      className="w-[20px] mr-2"
                                    />
                                    {locale === "ar" ? cat?.arName : cat?.name}
                                    {cat?.children?.length !== 0 && (
                                      <MdOutlineKeyboardArrowRight
                                        className="ml-auto"
                                        size={18}
                                      />
                                    )}
                                  </Button>
                                </Link>

                                {cat?.children?.length !== 0 && (
                                  <div className={`submenu absolute top-[0%] left-[22%] min-w-[78%] bg-white opacity-0 invisible  group-hover:opacity-100 group-hover:visible border-l [border-left-color:#ccc] h-[100%] p-4 py-6 text-orange overflow-y-scroll ${index === 0 && isOpenCatPanel === true && '!opacity-100 !visible'}`}>
                                    <h3 className="pl-5">SHOP BY CATEGORY</h3>

                                    <div className="grid grid-cols-8 mt-4 gap-4">
                                        <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden bg-gray-200">
                                          <RiGridFill size={30} className="hover:!text-primary" />
                                        </div>
                                        <h4 className="text-center text-[12px] hover:!text-primary">View All</h4>
                                      </Link>

                                         <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742452096038_thth1.jpg" className="w-full h-full object-cover transition" />
                                        </div>
                                        <h4 className="text-center text-[12px] hover:!text-primary">New In</h4>
                                      </Link>

                                        <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742452035507_rtrt1.jpg" className="w-full h-full object-cover" />
                                        </div>
                                         <h4 className="text-center text-[12px] hover:!text-primary">Top Rated</h4>
                                      </Link>


                                       <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742447215241_blubags-waterproof-school-backpack-36-l-laptop-bag-college-backpack-school-bag-product-images-rvxyzquw2b-0-202312201359.webp" className="w-full h-full object-cover" />
                                         
                                        </div>
                                          <h4 className="text-center text-[12px] hover:!text-primary">Top Bags</h4>
                                      </Link>


                                       <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742445932012_paragon-puk7014l-women-sandals-casual-everyday-sandals-stylish-comfortable-durable-for-daily-occasion-wear-product-images-rvy1o3iatj-0-202309191612.jpg" className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="text-center text-[12px] hover:!text-primary">Top Sandels</h4>
                                      </Link>



                                        <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742439142762_gespo-peach-solid-mandarin-collar-half-sleeve-casual-t-shirt-product-images-rvrtzhyumb-0-202304080900.webp" className="w-full h-full object-cover" />
                                        </div>
                                         <h4 className="text-center text-[12px] hover:!text-primary">Men T-Shirts</h4>
                                      </Link>

                                        <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742439426966_modestouze-attires-women-s-mukaish-worked-ethnic-jacket-with-top-and-pant-set-product-images-rvziicqwq6-0-202403231855.jpg" className="w-full h-full object-cover" />
                                            
                                        </div>
                                        <h4 className="text-center text-[12px] hover:!text-primary">New Arrivals</h4>
                                      </Link>

                                       <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742439504084_deel-band-women-rayon-embroidered-kurta-pant-dupatta-set-product-images-rvz2bvyrm2-0-202404071602.webp" className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="text-center text-[12px] hover:!text-primary">Girls Suits</h4>
                                      </Link>


                                     <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742439887415_miss-ayse-women-s-multicolor-crepe-printed-top-product-images-rvvlrud6qm-0-202410111253.webp" className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="text-center text-[12px] hover:!text-primary">Girls Tops</h4>
                                      </Link>

                                        <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742451878625_gosriki-women-s-pink-ethnic-motifs-printed-kurta-with-trouser-dupatta-product-images-rvpkyh5qdr-4-202310141511.jpg" className="w-full h-full object-cover" />
                                        </div>
                                         <h4 className="text-center text-[12px] hover:!text-primary">Girls Kurta</h4>
                                      </Link>


                                   <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742452096038_thth1.jpg" className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="text-center text-[12px] hover:!text-primary">New In</h4>
                                      </Link>

                                       <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742452035507_rtrt1.jpg" className="w-full h-full object-cover" />
                                        </div>
                                         <h4 className="text-center text-[12px] hover:!text-primary">Top Rated</h4>
                                      </Link>


                                        <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742447215241_blubags-waterproof-school-backpack-36-l-laptop-bag-college-backpack-school-bag-product-images-rvxyzquw2b-0-202312201359.webp" className="w-full h-full object-cover" />
                                         
                                        </div>
                                          <h4 className="text-center text-[12px] hover:!text-primary">Top Bags</h4>
                                      </Link>


                                       <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742445932012_paragon-puk7014l-women-sandals-casual-everyday-sandals-stylish-comfortable-durable-for-daily-occasion-wear-product-images-rvy1o3iatj-0-202309191612.jpg" className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="text-center text-[12px] hover:!text-primary">Top Sandels</h4>
                                      </Link>



                                     <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742439142762_gespo-peach-solid-mandarin-collar-half-sleeve-casual-t-shirt-product-images-rvrtzhyumb-0-202304080900.webp" className="w-full h-full object-cover" />
                                        </div>
                                         <h4 className="text-center text-[12px] hover:!text-primary">Men T-Shirts</h4>
                                      </Link>

                                    <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742439426966_modestouze-attires-women-s-mukaish-worked-ethnic-jacket-with-top-and-pant-set-product-images-rvziicqwq6-0-202403231855.jpg" className="w-full h-full object-cover" />
                                            
                                        </div>
                                        <h4 className="text-center text-[12px] hover:!text-primary">New Arrivals</h4>
                                      </Link>

                                  <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742439504084_deel-band-women-rayon-embroidered-kurta-pant-dupatta-set-product-images-rvz2bvyrm2-0-202404071602.webp" className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="text-center text-[12px] hover:!text-primary">Girls Suits</h4>
                                      </Link>


                                <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742439887415_miss-ayse-women-s-multicolor-crepe-printed-top-product-images-rvvlrud6qm-0-202410111253.webp" className="w-full h-full object-cover" />
                                        </div>
                                        <h4 className="text-center text-[12px] hover:!text-primary">Girls Tops</h4>
                                      </Link>

                                  <Link href="#" className="flex items-center justify-center flex-col gap-1">
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                          <img src="https://serviceapi.spicezgold.com/download/1742451878625_gosriki-women-s-pink-ethnic-motifs-printed-kurta-with-trouser-dupatta-product-images-rvpkyh5qdr-4-202310141511.jpg" className="w-full h-full object-cover" />
                                        </div>
                                         <h4 className="text-center text-[12px] hover:!text-primary">Girls Kurta</h4>
                                      </Link>


                                    </div>


                                    {
                                      //   <ul>
                                      //   {cat?.children?.map((subCat, index_) => {
                                      //     return (
                                      //       <li
                                      //         className="list-none w-full relative"
                                      //         key={index_}
                                      //       >
                                      //         <Link
                                      //           href={`/products?subCatId=${subCat?._id}`}
                                      //           className="w-full"
                                      //         >
                                      //           <Button className="!text-[rgba(0,0,0,0.8)]  w-full !text-left !justify-start !rounded-none !text-gray-800 hover:!text-primary !py-2 ">
                                      //             {locale === "ar"
                                      //               ? subCat?.arName
                                      //               : subCat?.name}
                                      //           </Button>
                                      //         </Link>

                                      //         {subCat?.children?.length !== 0 && (
                                      //           <div className="submenu absolute top-[0%] left-[100%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
                                      //             <ul>
                                      //               {subCat?.children?.map(
                                      //                 (thirdLavelCat, index__) => {
                                      //                   return (
                                      //                     <li
                                      //                       className="list-none w-full"
                                      //                       key={index__}
                                      //                     >
                                      //                       <Link
                                      //                         href={`/products?thirdLavelCatId=${thirdLavelCat?._id}`}
                                      //                         className="w-full"
                                      //                       >
                                      //                         <Button className="!text-[rgba(0,0,0,0.8)]  w-full !text-left !justify-start !rounded-none !text-gray-800 hover:!text-primary !py-2 ">
                                      //                           {locale === "ar"
                                      //                             ? thirdLavelCat?.arName
                                      //                             : thirdLavelCat?.name}
                                      //                         </Button>
                                      //                       </Link>
                                      //                     </li>
                                      //                   );
                                      //                 }
                                      //               )}
                                      //             </ul>
                                      //           </div>
                                      //         )}
                                      //       </li>
                                      //     );
                                      //   })}
                                      // </ul>
                                    }
                                  </div>
                                )}
                              </li>
                            );
                          })}
                    </ul>
                  </div>

                </Collapse>
              </div>
            </div>
          )}

          <div className="col_2 w-full lg:w-[80%]">
            <ul className="flex items-center gap-2 nav">
              <li className="list-none">
                <Link
                  href="/"
                  className="link transition text-[14px] font-[500]"
                >
                  <Button className="link transition !font-[500] !text-gray-300 hover:!text-primary !py-3 lg:!py-4">
                    {t("header.home")}
                  </Button>
                </Link>
              </li>

              {catData?.length !== 0 &&
                catData
                  ?.filter((cat, idx) => idx < 8)
                  ?.map((cat, index) => {
                    return (
                      <li className="list-none relative" key={index}>
                        <Link
                          href={`/products?catId=${cat?._id}`}
                          className="link transition text-[14px] !font-[500]"
                        >
                          <Button className="link transition !font-[500] !text-gray-300 hover:!text-primary !py-3 lg:!py-4">
                            {locale === "ar" ? cat?.arName : cat?.name}
                          </Button>
                        </Link>

                        {cat?.children?.length !== 0 && (
                          <div className="submenu absolute top-[120%] left-[0%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
                            <ul>
                              {cat?.children?.map((subCat, index_) => {
                                return (
                                  <li
                                    className="list-none w-full relative"
                                    key={index_}
                                  >
                                    <Link
                                      href={`/products?subCatId=${subCat?._id}`}
                                      className="w-full"
                                    >
                                      <Button className="!text-[rgba(0,0,0,0.8)]  w-full !text-left !justify-start !rounded-none">
                                        {locale === "ar"
                                          ? subCat?.arName
                                          : subCat?.name}
                                      </Button>
                                    </Link>

                                    {subCat?.children?.length !== 0 && (
                                      <div className="submenu absolute top-[0%] left-[100%] min-w-[150px] bg-white shadow-md opacity-0 transition-all">
                                        <ul>
                                          {subCat?.children?.map(
                                            (thirdLavelCat, index__) => {
                                              return (
                                                <li
                                                  className="list-none w-full"
                                                  key={index__}
                                                >
                                                  <Link
                                                    href={`/products?thirdLavelCatId=${thirdLavelCat?._id}`}
                                                    className="w-full"
                                                  >
                                                    <Button className="!text-[rgba(0,0,0,0.8)]  w-full !text-left !justify-start !rounded-none">
                                                      {locale === "ar"
                                                        ? thirdLavelCat?.arName
                                                        : thirdLavelCat?.name}
                                                    </Button>
                                                  </Link>
                                                </li>
                                              );
                                            }
                                          )}
                                        </ul>
                                      </div>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </li>
                    );
                  })}
            </ul>
          </div>

          {/* <div className="col_3 w-[20%] hidden lg:block">
            <p className="text-[14px] !text-gray-300 font-[500] flex items-center gap-3 mb-0 mt-0">
              <GoRocket className="text-[18px]" />
              {t("header.freeDelivery")}
            </p>
          </div> */}
        </div>
      </nav>



      {context?.windowWidth < 992 && <MobileNav />}

      {catData?.length !== 0 && (
        <>
          {context?.windowWidth < 992 && (
            <MobileMenu
              catData={catData}
              isOpenMobileMenu={props.isOpenMobileMenu}
              openMobileMenu={props.openMobileMenu}
            />
          )}
        </>
      )}
    </>
  );
};

export default Navigation;
