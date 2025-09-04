"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import { useLanguage } from "@/context/LanguageContext";
import Breadcrumb from "../Breadcrumb";
import Image from "next/image";
import Cookies from "js-cookie";
import { useTranslation } from "@/utils/useTranslation";

// Lazy-load components
const ProductZoom = dynamic(
  () => import("@/components/ProductZoom").then((mod) => mod.ProductZoom),
  { ssr: false }
);
const ProductDetailsComponent = dynamic(
  () =>
    import("@/components/ProductDetails").then(
      (mod) => mod.ProductDetailsComponent
    ),
  { ssr: false }
);
const Reviews = dynamic(
  () =>
    import("../../app/product/[productId]/reviews").then(
      (mod) => mod.Reviews || mod.default
    ),
  { ssr: true }
);
const ProductsSlider = dynamic(
  () =>
    import("@/components/ProductsSlider").then(
      (mod) => mod.default || mod.ProductsSlider
    ),
  { ssr: false }
);

const ProductOverview = ({ reviewsCountProp, product, relatedProducts }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [productData, setProductData] = useState(null);
  const [images, setImages] = useState([]);
  const [productName, setProductName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [reviewsCount, setReviewsCount] = useState(reviewsCountProp || 0);
  const [relatedProductData, setRelatedProductData] = useState(relatedProducts);

  const siteSettings = JSON.parse(Cookies.get("siteSettings") || "{}");
  const shippingdt = JSON.parse(Cookies.get("shippingdt") || "{}");

  const { locale } = useLanguage();
  const { t } = useTranslation();
  const reviewRef = useRef(null);

  useEffect(() => {
    if (!product) return;
    setProductData(product);
    setRelatedProductData(relatedProducts || []);
    setProductName(product.name || product.arbName || "Product");

    // Set initial images with fallback
    const initialImages =
      product?.variation?.length > 0
        ? product?.variation[0]?.color?.images ||
          product?.images || ["/default-image.jpg"]
        : product?.images || ["/default-image.jpg"];
    setImages(initialImages);

    window.scrollTo(0, 0);
    setIsLoading(false);
  }, [product, relatedProducts]);

  const gotoReviews = useCallback(() => {
    if (reviewRef.current) {
      window.scrollTo({
        top: reviewRef.current.offsetTop - 100,
        behavior: "smooth",
      });
      setActiveTab(1);
    }
  }, []);

  if (!productData) {
    return (
      <div className="text-red-500 text-center py-10">Product not found</div>
    );
  }

  return (
    <>
      <Breadcrumb
        paths={[
          {
            label: productName || "Product",
            href: `/product/${productData?._id}`,
          },
        ]}
      />
      <section className="py-8 bg-white">
        {isLoading ? (
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8">
              <Skeleton variant="rectangular" width="40%" height={400} />
              <div className="w-full lg:w-[60%]">
                <Skeleton variant="text" width="40%" height={30} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="rectangular" width="100%" height={150} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="container mx-auto px-4 flex flex-col items-start gap-8 lg:flex-row lg:items-start">
              <div className="productZoomContainer w-full lg:w-[40%]">
                <ProductZoom images={images} />
              </div>
              <div className="productContent w-full lg:w-[60%] pr-2 pl-2 lg:pl-5 flex flex-col sm:flex-row gap-5">
                <ProductDetailsComponent
                  item={productData}
                  reviewsCount={reviewsCount}
                  gotoReviews={gotoReviews}
                  setImages={setImages}
                />

                <div className="boxWrapper w-[300px]">
                  <div className="bg-gray-200 p-4 rounded-lg flex flex-col gap-3">
                    <div className="flex items-center gap-3 border-b border-gray-300 pb-2">
                      <div className="img">
                        <Image
                          src="/details-icon1.png"
                          alt="details icon 1"
                          width={32}
                          height={32}
                        />
                      </div>

                      <div className="info pl-2">
                        <h3>{t("product.shippingHeading")}</h3>
                        <p className="mt-0 mb-0 text-gray-800">
                          {t("product.shippingDesc")} $
                          {shippingdt.FreeDeliveryFee}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3  border-b border-gray-300 pb-2">
                      <div className="img">
                        <Image
                          src="/details-icon2.png"
                          alt="details icon 2"
                          width={32}
                          height={32}
                        />
                      </div>

                      <div className="info pl-2">
                        <h3>{t("product.returnHeading")}</h3>
                        <p className="mt-0 mb-0 text-gray-800">
                          {t("product.returnDesc")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ">
                      <div className="img">
                        <Image
                          src="/details-icon3.png"
                          alt="details icon 3"
                          width={32}
                          height={32}
                        />
                      </div>

                      <div className="info pl-2">
                        <h3> {t("product.paymentHeading")}</h3>
                        <p className="mt-0 mb-0 text-gray-800">
                          {t("product.paymentDesc")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <br />

                  <div className="bg-gray-200 p-4 rounded-lg flex flex-col gap-1">
                    <h4>{t("product.hotlineHeading")}</h4>
                    <p className="mt-0 mb-0">
                      {t("product.hotlineDesc")}{" "}
                      {locale === "ar"
                        ? siteSettings?.workingHourL1ar
                        : siteSettings?.workingHourL1}
                    </p>

                    <h2 className="text-[20px]">{siteSettings.contactNo}</h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="container mx-auto px-4 pt-10">
              <div className="flex items-center gap-8 mb-5">
                <button
                  className={`text-[17px] font-[500] ${
                    activeTab === 0 ? "text-primary" : "text-gray-700"
                  } hover:text-primary transition-colors`}
                  onClick={() => setActiveTab(0)}
                  aria-label="View product description"
                >
                  Description
                </button>
                <button
                  className={`text-[17px] font-[500] ${
                    activeTab === 1 ? "text-primary" : "text-gray-700"
                  } hover:text-primary transition-colors`}
                  onClick={() => setActiveTab(1)}
                  ref={reviewRef}
                  aria-label={`View product reviews (${reviewsCount})`}
                >
                  Reviews ({reviewsCount})
                </button>
              </div>
              {activeTab === 0 && (
                <div className="shadow-md w-full py-5 px-8 rounded-md text-[14px] bg-white">
                  {locale === "ar"
                    ? productData.arbDescription
                    : productData.description || "No description available"}
                </div>
              )}
              {activeTab === 1 && (
                <div className="w-full sm:w-[80%] py-0 rounded-md">
                  {productData?._id && (
                    <Reviews
                      productId={productData?._id}
                      setReviewsCount={setReviewsCount}
                    />
                  )}
                </div>
              )}
            </div>
            {relatedProductData?.length > 0 && (
              <div className="container mx-auto px-4 pt-8">
                <h2 className="text-[20px] font-[600] pb-4">
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
