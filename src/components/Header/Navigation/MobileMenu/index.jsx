// "use client";
// import React, { useState } from "react";
// import Cookies from "js-cookie";
// import Link from "next/link";
// import { Button } from "@mui/material";
// import { IoIosArrowDown } from "react-icons/io";
// import { Collapse } from "react-collapse";
// import { RiGridFill } from "react-icons/ri";
// import Image from "next/image";
// import { useLanguage } from "@/context/LanguageContext";
// import { useTranslation } from "@/utils/useTranslation";

// const MobileMenu = ({ catData = [], isOpenMobileMenu, openMobileMenu }) => {
//   const [openIndex, setOpenIndex] = useState(null); // <— single source of truth
//   const { locale } = useLanguage();
//   const { t } = useTranslation();

//   const toggle = (index) =>
//     setOpenIndex((prev) => (prev === index ? null : index));

//   const closeEverything = () => {
//     setOpenIndex(null);
//     openMobileMenu(false);
//   };

//   return (
//     <>
//       {/* sliding drawer */}
//       {/* <div
//         className={`mobileMenu fixed top-0 left-[-100%] w-[80%] h-full bg-white z-[101]
//         transition-all ${
//           isOpenMobileMenu ? "left-0 opacity-100" : "opacity-0"
//         }`}
//       > */}
//       <div
//         className={`mobileMenu fixed top-0 w-[80%] h-full bg-white z-[110] transition-all
//   ${isOpenMobileMenu ? "left-0 opacity-100" : "left-[-100%] opacity-0"}`}
//       >
//         {/* logo */}
//         <div className="p-3">
//           <Image
//             src={Cookies.get("logo") || "/sooqna.svg"}
//             width={100}
//             height={40}
//             alt="logo"
//             className="w-[100px]"
//           />
//         </div>

//         {/* main category list */}
//         <ul className="mb-0 p-2 max-h-[80vh] overflow-y-auto">
//           {catData.slice(0, 8).map((cat, idx) => (
//             <li key={cat._id} className="relative border-b border-slate-100">
//               <Link
//                 href={`/products?catId=${cat._id}`}
//                 onClick={closeEverything}
//               >
//                 <Button className="!w-full !justify-start !py-2 !text-gray-800 hover:!text-primary !capitalize !font-medium">
//                   <Image
//                     src={cat.images?.[0] || "/default-image.jpg"}
//                     alt={cat.name}
//                     width={20}
//                     height={20}
//                     className="w-[20px] mr-2"
//                   />
//                   {locale === "ar" ? cat.arName : cat.name}
//                 </Button>
//               </Link>

//               {/* arrow toggler */}
//               {cat.children?.length > 0 && (
//                 <button
//                   onClick={() => toggle(idx)}
//                   className="absolute top-[10px] right-2 w-[30px] h-[30px] flex items-center justify-center"
//                 >
//                   <IoIosArrowDown
//                     size={18}
//                     className={`transition-transform ${
//                       openIndex === idx ? "rotate-180" : ""
//                     }`}
//                   />
//                 </button>
//               )}

//               {/* sub-menu grid */}
//               {cat.children?.length > 0 && (
//                 <Collapse isOpened={openIndex === idx}>
//                   <div className="bg-white py-4">
//                     <h3 className="pl-4 mb-4 text-sm font-semibold text-gray-600 uppercase">
//                       {t("header.shopByCategories")}
//                     </h3>

//                     <div className="grid grid-cols-4 gap-4 px-4">
//                       {/* view-all tile */}
//                       <Link
//                         href={`/products?catId=${cat._id}`}
//                         onClick={closeEverything}
//                         className="flex flex-col items-center gap-1"
//                       >
//                         <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-gray-200">
//                           <RiGridFill size={28} />
//                         </div>
//                         <span className="text-[12px]">
//                           {locale === "ar" ? cat?.arName : cat?.name}
//                         </span>
//                       </Link>

//                       {/* child categories */}
//                       {cat.children.map((sub) => (
//                         <Link
//                           key={sub._id}
//                           href={`/products?subCatId=${sub._id}`}
//                           onClick={closeEverything}
//                           className="flex flex-col items-center gap-1"
//                         >
//                           <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
//                             <Image
//                               src={sub.images?.[0] || "/default-image.jpg"}
//                               alt={sub.name}
//                               width={60}
//                               height={60}
//                               className="object-cover w-full h-full transition-transform hover:scale-105"
//                             />
//                           </div>
//                           <span className="text-[12px] text-center">
//                             {locale === "ar" ? sub.arName : sub.name}
//                           </span>
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 </Collapse>
//               )}
//             </li>
//           ))}
//         </ul>

//         {/* footer buttons */}
//         <div className="grid grid-cols-2 gap-2 px-3 mt-4">
//           <Link href="https://seller.soouqna.com" onClick={closeEverything}>
//             <Button className="w-full btn-org btn-dark !px-2 !py-2 !text-[11px]">
//               {t("header.becomeVendor")}
//             </Button>
//           </Link>
//           <Link href="/login" onClick={closeEverything}>
//             <Button className="w-full btn-org !px-2 !py-2 !text-[11px]">
//               {t("header.login")}
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* backdrop */}
//       {isOpenMobileMenu && (
//         <div
//           className="mobileMenuOverlay fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[100]"
//           onClick={() => openMobileMenu(false)}
//         />
//       )}
//     </>
//   );
// };

// export default MobileMenu;

"use client";
import React, { useState } from "react";
import Cookies from "js-cookie";
import Link from "next/link";
import { Button } from "@mui/material";
import { IoIosArrowDown } from "react-icons/io";
import { Collapse } from "react-collapse";
import { RiGridFill } from "react-icons/ri";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/utils/useTranslation";

const MobileMenu = ({ catData = [], isOpenMobileMenu, openMobileMenu }) => {
  const [openIndex, setOpenIndex] = useState(null); // <— single source of truth
  const { locale } = useLanguage();
  const { t } = useTranslation();

  const toggle = (index) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  const closeEverything = () => {
    setOpenIndex(null);
    openMobileMenu(false);
  };

  // RTL/LTR logic for menu position and direction
  const menuPosition = locale === "ar" ? "right-0" : "left-0";
  const hiddenPosition = locale === "ar" ? "right-[-100%]" : "left-[-100%]";
  const menuDirection = locale === "ar" ? "rtl" : "ltr";

  return (
    <>
      {/* sliding drawer */}
      <div
        className={`mobileMenu fixed top-0 w-[80%] h-full bg-white z-[110] transition-all
          ${
            isOpenMobileMenu
              ? `${menuPosition} opacity-100`
              : `${hiddenPosition} opacity-0`
          }`}
        style={{ direction: menuDirection }}
      >
        {/* logo */}
        <div className="p-3 flex justify-center">
          <Image
            src={Cookies.get("logo") || "/sooqna.svg"}
            width={100}
            height={40}
            alt="logo"
            className="w-[100px]"
          />
        </div>

        {/* main category list */}
        <ul className="mb-0 p-2 max-h-[80vh] overflow-y-auto">
          {catData.slice(0, 8).map((cat, idx) => (
            <li key={cat._id} className="relative border-b border-slate-100">
              <Link
                href={`/products?catId=${cat._id}`}
                onClick={closeEverything}
              >
                <Button
                  className={`!w-full !justify-start !py-2 !text-gray-800 hover:!text-primary !capitalize !font-medium`}
                >
                  <Image
                    src={cat.images?.[0] || "/default-image.jpg"}
                    alt={cat.name}
                    width={20}
                    height={20}
                    className={`w-[20px] ${locale === "ar" ? "ml-2" : "mr-2"}`}
                  />
                  {locale === "ar" ? cat.arName : cat.name}
                </Button>
              </Link>

              {/* arrow toggler */}
              {cat.children?.length > 0 && (
                <button
                  onClick={() => toggle(idx)}
                  className={`absolute top-[10px] ${
                    locale === "ar" ? "left-2" : "right-2"
                  } w-[30px] h-[30px] flex items-center justify-center`}
                >
                  <IoIosArrowDown
                    size={18}
                    className={`transition-transform ${
                      openIndex === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}

              {/* sub-menu grid */}
              {cat.children?.length > 0 && (
                <Collapse isOpened={openIndex === idx}>
                  <div className="bg-white py-4">
                    <h3
                      className={`${
                        locale === "ar" ? "pr-4" : "pl-4"
                      } mb-4 text-sm font-semibold text-gray-600 uppercase`}
                    >
                      {t("header.shopByCategories")}
                    </h3>

                    <div className="grid grid-cols-4 gap-4 px-4">
                      {/* view-all tile */}
                      <Link
                        href={`/products?catId=${cat._id}`}
                        onClick={closeEverything}
                        className="flex flex-col items-center gap-1"
                      >
                        <div className="w-[60px] h-[60px] flex items-center justify-center rounded-full bg-gray-200">
                          <RiGridFill size={28} />
                        </div>
                        <span className="text-[12px]">
                          {locale === "ar" ? cat?.arName : cat?.name}
                        </span>
                      </Link>

                      {/* child categories */}
                      {cat.children.map((sub) => (
                        <Link
                          key={sub._id}
                          href={`/products?subCatId=${sub._id}`}
                          onClick={closeEverything}
                          className="flex flex-col items-center gap-1"
                        >
                          <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
                            <Image
                              src={sub.images?.[0] || "/default-image.jpg"}
                              alt={sub.name}
                              width={60}
                              height={60}
                              className="object-cover w-full h-full transition-transform hover:scale-105"
                            />
                          </div>
                          <span className="text-[12px] text-center">
                            {locale === "ar" ? sub.arName : sub.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Collapse>
              )}
            </li>
          ))}
        </ul>

        {/* footer buttons */}
        <div className="grid grid-cols-2 gap-2 px-3 mt-4">
          <Link href="https://seller.soouqna.com" onClick={closeEverything}>
            <Button className="w-full btn-org btn-dark !px-2 !py-2 !text-[11px]">
              {t("header.becomeVendor")}
            </Button>
          </Link>
          <Link href="/login" onClick={closeEverything}>
            <Button className="w-full btn-org !px-2 !py-2 !text-[11px]">
              {t("header.login")}
            </Button>
          </Link>
        </div>
      </div>

      {/* backdrop */}
      {isOpenMobileMenu && (
        <div
          className="mobileMenuOverlay fixed inset-0 bg-[rgba(0,0,0,0.5)] z-[100]"
          onClick={() => openMobileMenu(false)}
        />
      )}
    </>
  );
};

export default MobileMenu;
