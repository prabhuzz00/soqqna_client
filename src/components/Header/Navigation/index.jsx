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
  };

  return (
    <>
      <nav className="navigation bg-gray-900">
        <div className="container flex items-center justify-start lg:justify-end gap-8">
          {context?.windowWidth > 992 && (
            <div className="col_1 w-[20%] relative">
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
              top-[128%] left-0 z-[100] shadow-md"
              >
                <Collapse isOpened={isOpenCatPanel}>
                  <ul className="w-full mb-0 p-2">
                    {catData?.length !== 0 &&
                      catData
                        ?.filter((cat, idx) => idx < 8)
                        ?.map((cat, index) => {
                          return (
                            <li
                              className="list-none static w-full group"
                              key={index}
                            >
                              <Link
                                href={`/products?catId=${cat?._id}`}
                                className="link transition text-[14px] !font-[500]"
                              >
                                <Button className="link transition !font-[500] !text-gray-800 hover:!text-primary !py-2 !w-full !text-left !justify-start">
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
                                <div className="submenu absolute top-[0%] left-[98%] min-w-[200px] bg-white shadow-md opacity-0 invisible  group-hover:opacity-100 group-hover:visible  h-[100%]">
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
                                            <Button className="!text-[rgba(0,0,0,0.8)]  w-full !text-left !justify-start !rounded-none !text-gray-800 hover:!text-primary !py-2 ">
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
                                                          <Button className="!text-[rgba(0,0,0,0.8)]  w-full !text-left !justify-start !rounded-none !text-gray-800 hover:!text-primary !py-2 ">
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
