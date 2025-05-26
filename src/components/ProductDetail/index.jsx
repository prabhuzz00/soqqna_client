// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { ProductZoom } from "@/components/ProductZoom";
// import { ProductDetailsComponent } from "@/components/ProductDetails";
// import { Reviews } from "../../app/product/[productId]/reviews";
// import ProductsSlider from "@/components/ProductsSlider";
// import CircularProgress from "@mui/material/CircularProgress";
// import { useLanguage } from "@/context/LanguageContext";
// import { useTranslation } from "@/utils/useTranslation";
// import Breadcrumb from "../Breadcrumb";

// const ProductOverview = ({ reviewsCountProp, product, relatedProducts }) => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [productData, setProductData] = useState(product);
//   const [images, setImages] = useState([]); // State to manage images
//   const [productName, setProductName] = useState();
//   const [isLoading, setIsLoading] = useState(false);
//   const [reviewsCount, setReviewsCount] = useState(reviewsCountProp ?? 0);
//   const [relatedProductData, setRelatedProductData] = useState(relatedProducts);

//   const { locale } = useLanguage();
//   const { t } = useTranslation();
//   const reviewSec = useRef();

//   useEffect(() => {
//     setProductData(product);
//     setRelatedProductData(relatedProducts);
//     setProductName(product.name);

//     // Set initial images (default to product.images or first variation's images)
//     const initialImages =
//       product?.variation?.length > 0
//         ? product?.variation[0]?.color?.images || product?.images
//         : product?.images;
//     setImages(initialImages || []);

//     if (typeof window !== "undefined") {
//       window.scrollTo(0, 0);
//     }
//   }, [product, relatedProducts]);

//   const gotoReviews = () => {
//     window.scrollTo({
//       top: reviewSec?.current.offsetTop - 170,
//       behavior: "smooth",
//     });

//     setActiveTab(1);
//   };

//   return (
//     <>
//       <Breadcrumb
//         paths={[
//           {
//             label: productName,
//             href: `/`,
//           },
//         ]}
//       />

//       <section className="py-5 bg-white">
//         {isLoading === true ? (
//           <div className="flex items-center justify-center min-h-[300px]">
//             <CircularProgress />
//           </div>
//         ) : (
//           <>
//             <div className="container flex flex-col items-start gap-8 lg:flex-row lg:items-center">
//               <div className="productZoomContainer w-full lg:w-[40%]">
//                 <ProductZoom images={images} /> {/* Use dynamic images */}
//               </div>

//               <div className="productContent w-full lg:w-[60%] pr-2 pl-2 lg:pr-10 lg:pl-10">
//                 <ProductDetailsComponent
//                   item={productData}
//                   reviewsCount={reviewsCount}
//                   gotoReviews={gotoReviews}
//                   setImages={setImages} // Pass setImages to update images
//                 />
//               </div>
//             </div>

//             <div className="container pt-10">
//               <div className="flex items-center gap-8 mb-5">
//                 <span
//                   className={`link text-[17px] cursor-pointer font-[500] ${
//                     activeTab === 0 && "text-primary"
//                   }`}
//                   onClick={() => setActiveTab(0)}
//                 >
//                   Description
//                 </span>

//                 <span
//                   className={`link text-[17px] cursor-pointer font-[500] ${
//                     activeTab === 1 && "text-primary"
//                   }`}
//                   onClick={() => setActiveTab(1)}
//                   ref={reviewSec}
//                 >
//                   Reviews ({reviewsCount})
//                 </span>
//               </div>

//               {activeTab === 0 && (
//                 <div className="shadow-md w-full py-5 px-8 rounded-md text-[14px]">
//                   {locale === "ar"
//                     ? productData.arbDescription
//                     : productData.description}
//                 </div>
//               )}

//               {activeTab === 1 && (
//                 <div className="w-full sm:w-[80%] py-0 rounded-md">
//                   {productData?._id && (
//                     <Reviews
//                       productId={productData?._id}
//                       setReviewsCount={setReviewsCount}
//                     />
//                   )}
//                 </div>
//               )}
//             </div>

//             {relatedProductData?.length !== 0 && (
//               <div className="container pt-8">
//                 <h2 className="text-[20px] font-[600] pb-0">
//                   Related Products
//                 </h2>
//                 <ProductsSlider items={6} data={relatedProductData} />
//               </div>
//             )}
//           </>
//         )}
//       </section>
//     </>
//   );
// };

// export default ProductOverview;

"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Skeleton from "@mui/material/Skeleton";
import { useLanguage } from "@/context/LanguageContext";
import Breadcrumb from "../Breadcrumb";

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

  const { locale } = useLanguage();
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
              <div className="productContent w-full lg:w-[60%] pr-2 pl-2 lg:pr-10 lg:pl-10">
                <ProductDetailsComponent
                  item={productData}
                  reviewsCount={reviewsCount}
                  gotoReviews={gotoReviews}
                  setImages={setImages}
                />
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
