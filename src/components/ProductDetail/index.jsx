"use client";
import React, { useEffect, useRef, useState } from "react";
import { ProductZoom } from "@/components/ProductZoom";
import { ProductDetailsComponent } from "@/components/ProductDetails";
import { Reviews } from "../../app/product/[productId]/reviews";
import ProductsSlider from "@/components/ProductsSlider";
import CircularProgress from "@mui/material/CircularProgress";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "@/utils/useTranslation";
import Breadcrumb from "../Breadcrumb";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";

const ProductOverview = ({ reviewsCountProp, product, relatedProducts }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [productData, setProductData] = useState(product);
  const [productName, setProductName] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [reviewsCount, setReviewsCount] = useState(reviewsCountProp ?? 0);
  const [relatedProductData, setRelatedProductData] = useState(relatedProducts);

  const { locale } = useLanguage();
  const { t } = useTranslation();
  const reviewSec = useRef();
  console.log("productData", productData);
  useEffect(() => {
    setProductData(product);
    setRelatedProductData(relatedProducts);
    setProductName(product.name);

    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [product, relatedProducts]);

  const gotoReviews = () => {
    window.scrollTo({
      top: reviewSec?.current.offsetTop - 170,
      behavior: "smooth",
    });

    setActiveTab(1);
  };

  return (
    <>
      <Breadcrumb
        paths={[
          {
            label: productName,
            href: `/`,
          },
        ]}
      />

      <div className="container py-2">
        {/* <Breadcrumbs aria-label="breadcrumb">
          <Link
            underline="hover"
            color="inherit"
            href="/"
            className="link transition !text-[14px]"
          >
            Home
          </Link>
          <Link
            underline="hover"
            color="inherit"
            href="/"
            className="link transition !text-[14px]s"
          >
            Fashion
          </Link>
        </Breadcrumbs> */}
      </div>

      <section className="py-5 bg-white">
        {isLoading === true ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className="container flex flex-col items-start gap-8 lg:flex-row lg:items-center">
              <div className="productZoomContainer w-full lg:w-[40%]">
                <ProductZoom images={productData?.images} />
              </div>

              <div className="productContent w-full lg:w-[60%] pr-2 pl-2 lg:pr-10 lg:pl-10">
                <ProductDetailsComponent
                  item={productData}
                  reviewsCount={reviewsCount}
                  gotoReviews={gotoReviews}
                />
              </div>
            </div>

            <div className="container pt-10">
              <div className="flex items-center gap-8 mb-5">
                <span
                  className={`link text-[17px] cursor-pointer font-[500] ${
                    activeTab === 0 && "text-primary"
                  }`}
                  onClick={() => setActiveTab(0)}
                >
                  Description
                </span>

                <span
                  className={`link text-[17px] cursor-pointer font-[500] ${
                    activeTab === 1 && "text-primary"
                  }`}
                  onClick={() => setActiveTab(1)}
                  ref={reviewSec}
                >
                  Reviews ({reviewsCount})
                </span>
              </div>

              {activeTab === 0 && (
                <div className="shadow-md w-full py-5 px-8 rounded-md text-[14px]">
                  {locale === "ar"
                    ? productData.arbDescription
                    : productData.description}
                </div>
              )}

              {activeTab === 1 && (
                <div className="w-full sm:w-[80%] py-0  rounded-md">
                  {productData?.length !== 0 && (
                    <Reviews
                      productId={productData?._id}
                      setReviewsCount={setReviewsCount}
                    />
                  )}
                </div>
              )}
            </div>

            {relatedProductData?.length !== 0 && (
              <div className="container pt-8">
                <h2 className="text-[20px] font-[600] pb-0">
                  Related Products
                </h2>
                <ProductsSlider items={6} data={relatedProductData} />
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default ProductOverview;
