"use client";
import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { BsFillBagCheckFill } from "react-icons/bs";
import CartItems from "./cartItems";
import { MyContext } from "@/context/ThemeProvider";
import Link from "next/link";
import { fetchDataFromApi } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/utils/useTranslation";

const CartPage = () => {
  const [productSizeData, setProductSizeData] = useState([]);
  const [productRamsData, setProductRamsData] = useState([]);
  const [productWeightData, setProductWeightData] = useState([]);
  const context = useContext(MyContext);

  const { t } = useTranslation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }

    fetchDataFromApi("/api/product/productSize/get").then((res) => {
      if (res?.error === false) {
        setProductSizeData(res?.data);
      }
    });

    fetchDataFromApi("/api/product/productRAMS/get").then((res) => {
      if (res?.error === false) {
        setProductRamsData(res?.data);
      }
    });

    fetchDataFromApi("/api/product/productWeight/get").then((res) => {
      if (res?.error === false) {
        setProductWeightData(res?.data);
      }
    });
  }, []);

  const selectedSize = (item) => {
    if (item?.size !== "") {
      return item?.size;
    }

    if (item?.weight !== "") {
      return item?.weight;
    }

    if (item?.ram !== "") {
      return item?.ram;
    }
  };
  const router = useRouter();
  const onCheckout = () => {
    if (context?.userData?.token || context?.userData?._id) {
      router.push("/checkout");
    } else {
      router.push("/login?redirect=/checkout"); // ✅ include redirect info
    }
  };

  return (
    <section className="section py-4 lg:py-8 pb-10">
      <div className="container w-[80%] max-w-[80%] flex gap-5 flex-col lg:flex-row">
        <div className="leftPart w-full lg:w-[70%]">
          <div className="shadow-md rounded-md bg-white">
            <div className="py-5 px-3 border-b border-[rgba(0,0,0,0.1)]">
              <h2>{t("cartPage.title")}</h2>
              <p className="mt-0 mb-0">
                {t("cartPage.there")}{" "}
                <span className="font-bold text-primary">
                  {context?.cartData?.length}
                </span>{" "}
                {t("cartPage.productsInCart")}
              </p>
            </div>

            {context?.cartData?.length !== 0 ? (
              context?.cartData?.map((item, index) => {
                return (
                  <CartItems
                    selected={() => selectedSize(item)}
                    qty={item?.quantity}
                    item={item}
                    key={index}
                    productSizeData={productSizeData}
                    productRamsData={productRamsData}
                    productWeightData={productWeightData}
                  />
                );
              })
            ) : (
              <>
                <>
                  <div className="flex items-center justify-center flex-col py-10 gap-5">
                    <img src="/empty-cart.png" className="w-[150px]" />
                    <h4>{t("cartPage.emptyTitle")}</h4>
                    <Link href="/">
                      <Button className="btn-org">
                        {t("cartPage.continueShopping")}
                      </Button>
                    </Link>
                  </div>
                </>
              </>
            )}
          </div>
        </div>

        <div className="rightPart w-full lg:w-[30%]">
          <div className="shadow-md rounded-md bg-white p-5 sticky top-[70px] z-[90]">
            <h3 className="pb-3">{t("cartPage.totalsTitle")}</h3>
            <hr />

            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">
                {t("cartPage.subtotal")}
              </span>
              <span className="text-primary font-bold">
                {(context.cartData?.length !== 0
                  ? context.cartData
                      ?.map((item) => parseInt(item.price) * item.quantity)
                      .reduce((total, value) => total + value, 0)
                  : 0
                )?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </p>

            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">
                {t("cartPage.shipping")}
              </span>
              <span className="font-bold">{t("cartPage.shippingValue")}</span>
            </p>

            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">
                {t("cartPage.estimateFor")}
              </span>
              <span className="font-bold">
                <span className="font-bold">
                  {context?.userData?.address_details[0]?.country}
                </span>
              </span>
            </p>

            <p className="flex items-center justify-between">
              <span className="text-[14px] font-[500]">
                {t("cartPage.total")}
              </span>
              <span className="text-primary font-bold">
                {(context.cartData?.length !== 0
                  ? context.cartData
                      ?.map((item) => parseInt(item.price) * item.quantity)
                      .reduce((total, value) => total + value, 0)
                  : 0
                )?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </p>

            <br />

            {/* <Link href="/checkout"> */}
            <Button
              className="btn-org btn-lg w-full flex gap-2"
              onClick={onCheckout}
            >
              <BsFillBagCheckFill className="text-[20px]" />{" "}
              {t("cartPage.checkout")}
            </Button>
            {/* </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
