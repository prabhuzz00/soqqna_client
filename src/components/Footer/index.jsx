"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoChatboxOutline } from "react-icons/io5";
import Drawer from "@mui/material/Drawer";
import CartPanel from "../CartPanel";
import { MyContext } from "@/context/ThemeProvider";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { ProductZoom } from "../ProductZoom";
import { IoCloseSharp } from "react-icons/io5";
import { ProductDetailsComponent } from "../ProductDetails";
import AddAddress from "@/app/my-account/addAddress";
import { useTranslation } from "@/utils/useTranslation";
import { useLanguage } from "@/context/LanguageContext";

const Footer = () => {
  const [catData, setCatData] = useState([]);
  const context = useContext(MyContext);

  const { locale } = useLanguage();

  const { t } = useTranslation();

  useEffect(() => {
    setCatData(context?.catData);
  }, [context?.catData]);

  return (
    <>
      <footer className="py-6 pb-0 bg-gray-900">
        <div className="container">
          <div className="footer flex px-3 lg:px-0 flex-col lg:flex-row py-8">
            <div className="part1 w-full lg:w-[45%] border-r border-[rgba(255,255,255,0.1)] pr-5">
              <h3>{t("footer.heading")}</h3>
              <p className="text-gray-200">{t("footer.description")}</p>

              <Link
                className="link text-[13px] text-primary hover:text-white"
                href="mailto:info@soouqna.com"
              >
                info@soouqna.com
              </Link>

              <br />

              <div className="flex items-center gap-2 mt-3">
                <IoChatboxOutline className="text-[40px] text-primary" />
                <span className="text-[16px] font-[600]">
                  {t("footer.onlineChat")}
                  <br />
                  {t("footer.getExpertHelp")}
                </span>
              </div>
            </div>

            <div className="part2  w-full lg:w-[55%] flex pl-0 lg:pl-8 mt-5 lg:mt-0">
              <div className="part2_col1 w-[50%]">
                <h2 className="text-[18px] font-[600] mb-4">
                  {t("footer.products")}
                </h2>

                <ul className="list grid grid-cols-2">
                  {catData?.length !== 0 &&
                    catData?.map((cat, index) => {
                      return (
                        <li
                          className="list-none text-[14px] w-full mb-2"
                          key={index}
                        >
                          <Link
                            href={`/products?catId=${cat?._id}`}
                            className="link transition text-[14px] !font-[500]"
                          >
                            {locale === "ar" ? cat?.arName : cat?.name}
                          </Link>
                        </li>
                      );
                    })}
                </ul>
              </div>

              <div className="part2_col2 w-[50%] pl-20">
                <h2 className="text-[18px] font-[600] mb-4">
                  {t("footer.ourCompany")}
                </h2>
                <ul className="list">
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link href="/about-us" className="link">
                      {t("footer.aboutUs")}
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link href="/contact-us" className="link">
                      {t("footer.contactUs")}
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link href="/terms-condition" className="link">
                      {t("footer.termsConditions")}
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link href="/privacy-policy" className="link">
                      {t("footer.PrivacyPolicy")}
                    </Link>
                  </li>
                  <li className="list-none text-[14px] w-full mb-2">
                    <Link href="/refund-policy" className="link">
                      {t("footer.RefundPolicy")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bottomStrip border-t border-[rgba(0,0,0,0.1)] pb-[100px] lg:pb-3 bg-gray-950">
          <div className="container flex items-center justify-center flex-col lg:flex-row gap-4 lg:gap-0">
            <p className="text-[13px] text-center mb-0">© 2025 - SOOUQNA</p>
          </div>
        </div>
      </footer>

      {/* Cart Panel */}
      <Drawer
        open={context.openCartPanel}
        onClose={context.toggleCartPanel(false)}
        anchor={"right"}
        className="cartPanel"
      >
        <div className="flex items-center justify-between py-3 px-4 gap-3 border-b border-[rgba(0,0,0,0.1)] overflow-hidden">
          <h4>
            {t("cartPage.panelTitle")} ({context?.cartData?.length})
          </h4>
          <IoCloseSharp
            className="text-[20px] cursor-pointer"
            onClick={context.toggleCartPanel(false)}
          />
        </div>

        {context?.cartData?.length !== 0 ? (
          <CartPanel data={context?.cartData} />
        ) : (
          <>
            <div className="flex items-center justify-center flex-col pt-[100px] gap-5">
              <Image
                src="/empty-cart.png"
                alt="empty cart"
                width={150}
                height={150}
              />
              <h4>Your Cart is currently empty</h4>
              <Button
                className="btn-org btn-sm"
                onClick={context.toggleCartPanel(false)}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </Drawer>

      {/* Address Panel */}
      <Drawer
        open={context.openAddressPanel}
        onClose={context.toggleAddressPanel(false)}
        anchor={"right"}
        className="addressPanel"
      >
        <div className="flex items-center justify-between py-3 px-4 gap-3 border-b border-[rgba(0,0,0,0.1)] overflow-hidden">
          <h4>
            {context?.addressMode === "add" ? "Add" : "Edit"} Delivery Address{" "}
          </h4>
          <IoCloseSharp
            className="text-[20px] cursor-pointer"
            onClick={context.toggleAddressPanel(false)}
          />
        </div>

        <div className="w-full max-h-[100vh] overflow-auto">
          <AddAddress />
        </div>
      </Drawer>
      {/* Product Details Modal */}
      <Dialog
        open={context?.openProductDetailsModal.open}
        fullWidth={context?.fullWidth}
        maxWidth={context?.maxWidth}
        onClose={context?.handleCloseProductDetailsModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="productDetailsModal"
      >
        <DialogContent>
          <div className="flex items-center w-full productDetailsModalContainer relative">
            <Button
              className="!w-[40px] !h-[40px] !min-w-[40px] !rounded-full !text-[#000] !absolute top-[15px] right-[15px] !bg-[#f1f1f1]"
              onClick={context?.handleCloseProductDetailsModal}
            >
              <IoCloseSharp className="text-[20px]" />
            </Button>
            {Object.keys(context?.openProductDetailsModal?.item || {})
              .length !== 0 && (
              <>
                <div className="col1 w-[40%] px-3 py-8">
                  <ProductZoom
                    images={
                      context?.openProductDetailsModal?.extraProps?.images ||
                      context?.openProductDetailsModal?.item?.images
                    }
                  />
                </div>
                <div className="col2 w-[60%] py-8 px-8 pr-16 productContent">
                  <ProductDetailsComponent
                    item={context?.openProductDetailsModal?.item}
                    setImages={
                      context?.openProductDetailsModal?.extraProps?.setImages
                    }
                  />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
