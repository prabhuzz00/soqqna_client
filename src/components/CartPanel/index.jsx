import React, { useContext } from "react";
import Link from "next/link";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Button from "@mui/material/Button";
import { MyContext } from "@/context/ThemeProvider";
import Image from "next/image";
import { deleteData } from "@/utils/api";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/utils/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
const CartPanel = (props) => {
  const context = useContext(MyContext);
  const { t } = useTranslation();
  const { locale } = useLanguage();

  const removeItem = (id) => {
    const cart = context?.getCartItems().filter((item) => item._id !== id);
    Cookies.set("cart", JSON.stringify(cart));
    context?.getCartItems();
  };

  const router = useRouter();
  const onCheckout = () => {
    context.setOpenCartPanel(false);
    if (context?.userData?.token || context?.userData?._id) {
      router.push("/checkout");
    } else {
      router.push("/login?redirect=/checkout");
    }
  };

  return (
    <>
      <div className="scroll w-full max-h-[60vh] overflow-y-scroll overflow-x-hidden py-3 px-4">
        {props?.data?.map((item, index) => {
          return (
            <div
              className="cartItem w-full flex items-center gap-4 border-b border-[rgba(0,0,0,0.1)] pb-4"
              key={index}
            >
              <div
                className="img w-[25%] overflow-hidden h-[80px] rounded-md"
                onClick={context.toggleCartPanel(false)}
              >
                <Link href={`/product/${item?._id}`} className="block group">
                  <Image
                    width={80}
                    height={80}
                    alt="image"
                    src={item?.image}
                    className="!w-full group-hover:scale-105"
                  />
                </Link>
              </div>

              <div className="info w-[75%] pr-5 relative pt-3">
                <h4
                  className="text-[12px] sm:text-[14px] font-[500]"
                  onClick={context.toggleCartPanel(false)}
                >
                  <Link
                    href={`/product/${item?._id}`}
                    className="link transition-all"
                  >
                    {locale === "ar"
                      ? item?.arName?.substr(0, 20) + "..."
                      : item?.name?.substr(0, 20) + "..."}
                  </Link>
                </h4>
                <p className="flex items-center gap-5 mt-2 mb-2">
                  <span className="text-[13px] sm:text-[14px]">
                    {t("cartPage.qty")} : <span>{item?.quantity}</span>
                  </span>
                  <span className="text-primary font-bold">
                    {parseInt(item?.price * item?.quantity)?.toLocaleString(
                      "en-US",
                      { style: "currency", currency: "USD" }
                    )}
                  </span>
                </p>

                <MdOutlineDeleteOutline
                  className="absolute top-[10px] right-[10px] cursor-pointer text-[20px] link transition-all"
                  onClick={() => removeItem(item?._id)}
                />
              </div>
            </div>
          );
        })}
      </div>

      <br />

      <div className="bottomSec absolute bottom-[10px] left-[10px] w-full overflow-hidden pr-5 bg-white">
        <div className="bottomInfo py-3 px-4 w-full border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col">
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">
              {props?.data?.length} {t("cartPage.item")}
            </span>
            <span className="text-primary font-bold">
              {(props?.data?.length !== 0
                ? props?.data
                    ?.map((item) => parseInt(item.price) * item.quantity)
                    .reduce((total, value) => total + value, 0)
                : 0
              )?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>
        </div>

        <div className="bottomInfo py-3 px-4 w-full border-t border-[rgba(0,0,0,0.1)] flex items-center justify-between flex-col">
          <div className="flex items-center justify-between w-full">
            <span className="text-[14px] font-[600]">
              {t("cartPage.totalex")}
            </span>
            <span className="text-primary font-bold">
              {(props?.data?.length !== 0
                ? props?.data
                    ?.map((item) => parseInt(item.price) * item.quantity)
                    .reduce((total, value) => total + value, 0)
                : 0
              )?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>

          <br />

          <div className="flex items-center justify-between w-full gap-5">
            <Link
              href="/cart"
              className=" w-[50%] d-block"
              onClick={context.toggleCartPanel(false)}
            >
              <Button className="btn-org  w-full">
                {t("cartPage.viewcart")}
              </Button>
            </Link>
            {/* <Link
              className=" w-[50%] d-block"
              onClick={context.toggleCartPanel(false)}
            > */}
            <div className="w-[50%] d-block">
              <Button
                className=" btn-org btn-border  w-full"
                onClick={onCheckout}
              >
                {t("cartPage.checkout")}
              </Button>
            </div>
            {/* </Link> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPanel;
