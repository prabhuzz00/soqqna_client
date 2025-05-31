"use client";
import Button from "@mui/material/Button";
import React, { useContext, useEffect, useState, useRef } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { LiaAngleDownSolid } from "react-icons/lia";
import { GoRocket } from "react-icons/go";
import "../Navigation/style.css";
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
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null);
  const dropdownRef = useRef(null); // Ref for dropdown container

  const context = useContext(MyContext);
  const { locale } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    setCatData(context?.catData);
  }, [context?.catData]);

  useEffect(() => {
    setCatProd(context?.catData);
  }, [context?.catData]);

  // Handle outside clicks
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isOpenCatPanel &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpenCatPanel(false);
        props.setIsOpenCatPanel(false);
        setActiveCategoryIndex(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpenCatPanel, props]);

  const openCategoryPanel = () => {
    setIsOpenCatPanel(!isOpenCatPanel);
    props.setIsOpenCatPanel(!isOpenCatPanel);
    if (!isOpenCatPanel) {
      setActiveCategoryIndex(0); // Set first category active when opening
    } else {
      setActiveCategoryIndex(null); // Reset when closing
    }
  };

  const handleCategoryClick = (index) => {
    setActiveCategoryIndex(index === activeCategoryIndex ? null : index);
  };

  const handleLinkClick = () => {
    setIsOpenCatPanel(false);
    props.setIsOpenCatPanel(false);
    setActiveCategoryIndex(null);
  };

  return (
    <>
      <nav className="navigation bg-gray-900 relative">
        <div className="container flex items-center justify-start lg:justify-end gap-8">
          {context?.windowWidth > 992 && (
            <div className="col_1 w-[20%] static" ref={dropdownRef}>
              <Button
                className="!text-gray-300 !font-[600] gap-2 w-full"
                onClick={openCategoryPanel}
              >
                <RiMenu2Fill className="text-[18px]" />
                {t("header.shopByCategories")}
                <LiaAngleDownSolid className="text-[13px] ml-auto font-bold" />
              </Button>

              <div className="categoryDropdownMwnu w-full h-auto bg-white absolute top-[100%] left-0 z-[100] shadow-md">
                <Collapse isOpened={isOpenCatPanel}>
                  <div className="flex gap-4 py-4">
                    <ul className="mb-0 p-2 pl-8 w-[300px]">
                      {catData?.length !== 0 &&
                        catData
                          ?.filter((cat, idx) => idx < 8)
                          ?.map((cat, index) => {
                            return (
                              <li
                                className="list-none static w-full mb-1"
                                key={index}
                              >
                                <Button
                                  className={`link transition !font-[500] !text-gray-800 hover:!text-black !py-2 !w-full !text-left !justify-start hover:!bg-gray-200`}
                                  onClick={() => handleCategoryClick(index)}
                                >
                                  <img
                                    src={cat?.images[0] || "/default-image.jpg"}
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

                                {cat?.children?.length !== 0 && (
                                  <div
                                    className={`submenu absolute top-[0%] left-[22%] min-w-[78%] bg-white ${
                                      activeCategoryIndex === index
                                        ? "opacity-100 visible"
                                        : "opacity-0 invisible"
                                    } border-l [border-left-color:#ccc] h-[100%] p-4 py-6 text-orange overflow-y-scroll`}
                                  >
                                    <h3 className="pl-5">SHOP BY CATEGORY</h3>

                                    <div className="grid grid-cols-8 mt-4 gap-4">
                                      <Link
                                        href={`/products?catId=${cat?._id}`}
                                        className="flex items-center justify-center flex-col gap-1"
                                        onClick={handleLinkClick}
                                      >
                                        <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden bg-gray-200">
                                          <RiGridFill
                                            size={30}
                                            className="hover:!text-primary"
                                          />
                                        </div>
                                        <h4 className="text-center text-[12px] hover:!text-primary">
                                          {locale === "ar"
                                            ? cat?.arName
                                            : cat?.name}
                                        </h4>
                                      </Link>

                                      {cat?.children?.map(
                                        (subCat, subIndex) => (
                                          <Link
                                            href={`/products?subCatId=${subCat?._id}`}
                                            className="flex items-center justify-center flex-col gap-1"
                                            key={subIndex}
                                            onClick={handleLinkClick}
                                          >
                                            <div className="flex items-center justify-center w-[60px] h-[60px] rounded-full overflow-hidden">
                                              <img
                                                src={
                                                  subCat?.images[0] ||
                                                  "/default-image.jpg"
                                                }
                                                className="w-full h-full object-cover transition"
                                                alt={
                                                  locale === "ar"
                                                    ? subCat?.arName
                                                    : subCat?.name
                                                }
                                              />
                                            </div>
                                            <h4 className="text-center text-[12px] hover:!text-primary">
                                              {locale === "ar"
                                                ? subCat?.arName
                                                : subCat?.name}
                                            </h4>
                                          </Link>
                                        )
                                      )}
                                    </div>
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
                                      <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none">
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
                                                    <Button className="!text-[rgba(0,0,0,0.8)] w-full !text-left !justify-start !rounded-none">
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
