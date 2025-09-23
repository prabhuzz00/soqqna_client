// "use client";
// import { useContext, useEffect, useState, useMemo, useRef, useCallback, lazy, Suspense } from "react";
// import HomeCatSlider from "@/components/HomeCatSlider";
// import Tabs from "@mui/material/Tabs";
// import Tab from "@mui/material/Tab";
// import { fetchDataFromApi } from "@/utils/api";
// import { MyContext } from "@/context/ThemeProvider";
// import BannerLoading from "@/components/LoadingSkeleton/bannerLoading";
// import ProductLoading from "@/components/ProductLoading";
// import { LiaShippingFastSolid } from "react-icons/lia";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/free-mode";
// import { Navigation, FreeMode } from "swiper/modules";
// import { useTranslation } from "@/utils/useTranslation";
// import { useLanguage } from "@/context/LanguageContext";
// import HomeLoading from "../LoadingSkeleton/homeLoading";
// import Cookies from "js-cookie";
// import { useCurrency } from "@/context/CurrencyContext";
// import { CloudCog } from "lucide-react";

// // Lazy load heavy components
// const ProductsSlider = lazy(() => import("@/components/ProductsSlider"));
// const AdsBannerSliderV2 = lazy(() => import("@/components/AdsBannerSliderV2"));
// const AdsBannerSlider = lazy(() => import("@/components/AdsBannerSlider"));
// const BannerBoxV2 = lazy(() => import("@/components/bannerBoxV2"));
// const HomeBannerV2 = lazy(() => import("@/components/HomeSliderV2"));
// const BlogItem = lazy(() => import("@/components/BlogItem"));
// const HomeSlider = lazy(() => import("../HomeSlider"));


// export default function Home() {
//   const { convertPrice, getSymbol } = useCurrency();
//   const [value, setValue] = useState(0);

//   // All sections data
//   const [homeSlidesData, setHomeSlidesData] = useState([]);
//   const [popularProductsData, setPopularProductsData] = useState([]);
//   const [productsData, setAllProductsData] = useState([]);
//   const [featuredProducts, setFeaturedProducts] = useState([]);
//   const [bannerV1Data, setBannerV1Data] = useState([]);
//   const [bannerList2Data, setBannerList2Data] = useState([]);
//   const [blogData, setBlogData] = useState([]);
//   const [randomCatProducts, setRandomCatProducts] = useState([]);
//   const [freeDeliveryFee, setFreeDeliveryFee] = useState(0);
//   const [siteSettings, setSiteSettings] = useState(null);

//   // Loading states - only for currently loading sections
//   const [loadingStates, setLoadingStates] = useState({});

//   // Loaded flags - track what's been loaded
//   const [loadedSections, setLoadedSections] = useState(new Set());

//   const [error, setError] = useState(null);

//   const context = useContext(MyContext);
//   const { locale } = useLanguage();
//   const { t } = useTranslation();

//   // Refs for each section
//   const heroRef = useRef(null);
//   const popularRef = useRef(null);
//   const latestRef = useRef(null);
//   const featuredRef = useRef(null);
//   const bannerV1Ref = useRef(null);
//   const bannerList2Ref = useRef(null);
//   const randomCatRef = useRef(null);
//   const blogRef = useRef(null);
//   const shippingRef = useRef(null);

//   // Memoized data
//   const memoizedPopularProducts = useMemo(() => popularProductsData, [popularProductsData]);
//   const memoizedProducts = useMemo(() => productsData.slice(0, 12), [productsData]);
//   const memoizedFeaturedProducts = useMemo(() => featuredProducts.slice(0, 12), [featuredProducts]);

//   // Only scroll to top on mount
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       window.scrollTo(0, 0);
//     }
//   }, []);

//   // Helper function to set loading state
//   const setLoadingState = useCallback((section, isLoading) => {
//     setLoadingStates(prev => ({
//       ...prev,
//       [section]: isLoading
//     }));
//   }, []);

//   // Helper function to mark section as loaded
//   const markSectionLoaded = useCallback((section) => {
//     setLoadedSections(prev => new Set([...prev, section]));
//   }, []);

//   // Async data loading functions
//   const loadHeroData = useCallback(async () => {
//     if (loadedSections.has('hero')) return;

//     setLoadingState('hero', true);
//     markSectionLoaded('hero');

//     try {
//       const homeSlides = await fetchDataFromApi("/api/homeSlides");
//       setHomeSlidesData(homeSlides?.data || []);
//     } catch (err) {
//       console.error("Error loading hero data:", err);
//     } finally {
//       setLoadingState('hero', false);
//     }
//   }, [loadedSections, setLoadingState, markSectionLoaded]);

//   const loadSiteSettings = useCallback(async () => {
//     if (loadedSections.has('settings')) return;

//     markSectionLoaded('settings');

//     try {
//       const cookieData = Cookies.get("siteSettings");
//       if (cookieData) {
//         setSiteSettings(JSON.parse(cookieData));
//         return;
//       }

//       const res = await fetchDataFromApi("/api/site-settings");
//       const settings = res?.data || {};
//       Cookies.set("siteSettings", JSON.stringify(settings), { expires: 1 });
//       setSiteSettings(settings);
//     } catch (err) {
//       console.error("Error fetching site settings:", err);
//     }
//   }, [loadedSections, markSectionLoaded]);

//   const loadShippingData = useCallback(async () => {
//     if (loadedSections.has('shipping')) return;

//     markSectionLoaded('shipping');

//     try {
//       const cookieData = Cookies.get("shippingdt");
//       if (cookieData) {
//         const shippingdt = JSON.parse(cookieData);
//         setFreeDeliveryFee(shippingdt.FreeDeliveryFee || 0);
//         return;
//       }

//       const res = await fetchDataFromApi("/api/shipping-cost");
//       const shippingdt = res?.data || {};
//       Cookies.set("shippingdt", JSON.stringify(shippingdt), { expires: 1 });
//       setFreeDeliveryFee(shippingdt.FreeDeliveryFee || 0);
//     } catch (err) {
//       console.error("Error fetching shipping settings:", err);
//     }
//   }, [loadedSections, markSectionLoaded]);

//   const loadPopularProducts = useCallback(async () => {
//     if (loadedSections.has('popular') || !context?.catData?.length) return;

//     setLoadingState('popular', true);
//     markSectionLoaded('popular');

//     try {
//       const res = await fetchDataFromApi(
//         `/api/product/getAllProductsByCatId/${context.catData[0]._id}`
//       );
//       if (res?.error === false) {
//         setPopularProductsData(res?.products || []);
//       }
//     } catch (err) {
//       console.error("Error loading popular products:", err);
//     } finally {
//       setLoadingState('popular', false);
//     }
//   }, [loadedSections, context?.catData, setLoadingState, markSectionLoaded]);

//   const loadLatestProducts = useCallback(async () => {
//     console.log("enterddddddddddddddddddd")
//     if (loadedSections.has('latest')) return;
//     setLoadingState('latest', true);
//     markSectionLoaded('latest');

//     try {
//       const res = await fetchDataFromApi("/api/product/getAllProducts");
//       if (res && res.products) {
//         setAllProductsData(res.products);
//       } else {
//         console.error("Unexpected API response structure:", res);
//         setAllProductsData([]);
//       }
//     } catch (err) {
//       console.error("Error loading latest products:", err);
//       setError("Failed to load latest products");
//     } finally {
//       setLoadingState('latest', false);
//     }
//   }, [loadedSections, setLoadingState, markSectionLoaded]);

//   // console.log("aaaaaaaaaaaaaaaaaaaaaaaaa", loadLatestProducts)

//   const loadFeaturedProducts = useCallback(async () => {
//     if (loadedSections.has('featured')) return;

//     setLoadingState('featured', true);
//     markSectionLoaded('featured');

//     try {
//       const res = await fetchDataFromApi("/api/product/getAllFeaturedProducts");
//       setFeaturedProducts(res?.products || []);
//     } catch (err) {
//       console.error("Error loading featured products:", err);
//     } finally {
//       setLoadingState('featured', false);
//     }
//   }, [loadedSections, setLoadingState, markSectionLoaded]);

//   const loadBannerV1Data = useCallback(async () => {
//     if (loadedSections.has('bannerV1')) return;

//     setLoadingState('bannerV1', true);
//     markSectionLoaded('bannerV1');

//     try {
//       const res = await fetchDataFromApi("/api/bannerV1");
//       setBannerV1Data(res?.data || []);
//     } catch (err) {
//       console.error("Error loading banners:", err);
//     } finally {
//       setLoadingState('bannerV1', false);
//     }
//   }, [loadedSections, setLoadingState, markSectionLoaded]);

//   const loadBannerList2Data = useCallback(async () => {
//     if (loadedSections.has('bannerList2')) return;

//     setLoadingState('bannerList2', true);
//     markSectionLoaded('bannerList2');

//     try {
//       const res = await fetchDataFromApi("/api/bannerList2");
//       setBannerList2Data(res?.data || []);
//     } catch (err) {
//       console.error("Error loading banner list:", err);
//     } finally {
//       setLoadingState('bannerList2', false);
//     }
//   }, [loadedSections, setLoadingState, markSectionLoaded]);

//   const loadRandomProducts = useCallback(async () => {
//     if (loadedSections.has('randomCat') || !context?.catData?.length) return;

//     setLoadingState('randomCat', true);
//     markSectionLoaded('randomCat');

//     try {
//       const maxCategories = Math.min(context.catData.length - 1, 8);
//       const numbers = new Set();
//       while (numbers.size < maxCategories && context.catData.length > 1) {
//         const number = Math.floor(1 + Math.random() * (context.catData.length - 1));
//         numbers.add(number);
//       }

//       const filterData = await Promise.all(
//         Array.from(numbers).map(async (index) => {
//           const catId = context.catData[index]?._id;
//           const res = await fetchDataFromApi(`/api/product/getAllProductsByCatId/${catId}`);
//           return {
//             catName: context.catData[index]?.name,
//             catNameAr: context.catData[index]?.arName,
//             data: res?.products || []
//           };
//         })
//       );
//       setRandomCatProducts(filterData);
//     } catch (err) {
//       console.error("Error fetching random products:", err);
//     } finally {
//       setLoadingState('randomCat', false);
//     }
//   }, [loadedSections, context?.catData, setLoadingState, markSectionLoaded]);

//   const loadBlogData = useCallback(async () => {
//     if (loadedSections.has('blog')) return;

//     setLoadingState('blog', true);
//     markSectionLoaded('blog');

//     try {
//       const res = await fetchDataFromApi("/api/blog");
//       setBlogData(res?.blogs || []);
//     } catch (err) {
//       console.error("Error loading blogs:", err);
//     } finally {
//       setLoadingState('blog', false);
//     }
//   }, [loadedSections, setLoadingState, markSectionLoaded]);

//   // Set up intersection observers ONLY when component mounts - no immediate loading
//   useEffect(() => {
//     const observerOptions = {
//       threshold: 0.1,
//       rootMargin: '50px' // Reduced from 200px to prevent too early loading
//     };

//     const observers = [];

//     // Create observers for each section
//     const sectionsConfig = [
//       { ref: heroRef, callback: loadHeroData },
//       { ref: popularRef, callback: () => { loadSiteSettings(); loadPopularProducts(); } },
//       { ref: latestRef, callback: loadLatestProducts },
//       { ref: featuredRef, callback: loadFeaturedProducts },
//       { ref: bannerV1Ref, callback: loadBannerV1Data },
//       { ref: bannerList2Ref, callback: loadBannerList2Data },
//       { ref: randomCatRef, callback: loadRandomProducts },
//       { ref: blogRef, callback: loadBlogData },
//       { ref: shippingRef, callback: loadShippingData },
//     ];

//     sectionsConfig.forEach(({ ref, callback }) => {
//       if (ref.current) {
//         const observer = new IntersectionObserver(([entry]) => {
//           if (entry.isIntersecting) {
//             // Use setTimeout to make it truly non-blocking
//             setTimeout(callback, 0);
//             observer.unobserve(entry.target);
//           }
//         }, observerOptions);

//         observer.observe(ref.current);
//         observers.push(observer);
//       }
//     });

//     // Cleanup
//     return () => {
//       observers.forEach(observer => observer.disconnect());
//     };
//   }, [loadHeroData, loadSiteSettings, loadPopularProducts, loadLatestProducts, loadFeaturedProducts, loadBannerV1Data, loadBannerList2Data, loadRandomProducts, loadBlogData, loadShippingData]);

//   // Re-fetch home slides when locale changes (only if already loaded)
//   useEffect(() => {
//     if (locale && loadedSections.has('hero')) {
//       const fetchHomeSlides = async () => {
//         try {
//           const homeSlides = await fetchDataFromApi("/api/homeSlides");
//           setHomeSlidesData(homeSlides?.data || []);
//         } catch (err) {
//           console.error("Failed to load home slides:", err);
//         }
//       };
//       // Make this non-blocking too
//       setTimeout(fetchHomeSlides, 0);
//     }
//   }, [locale, loadedSections]);

//   const handleChange = (event, newValue) => {
//     setValue(newValue);
//   };

//   const filterByCatId = (id) => {
//     setPopularProductsData([]);
//     setLoadingState('popular', true);

//     // Make this non-blocking
//     setTimeout(async () => {
//       try {
//         const res = await fetchDataFromApi(`/api/product/getAllProductsByCatId/${id}`);
//         if (res?.error === false) {
//           setPopularProductsData(res?.products || []);
//         }
//       } catch (err) {
//         console.error("Error filtering by category:", err);
//       } finally {
//         setLoadingState('popular', false);
//       }
//     }, 0);
//   };

//   if (!context) {
//     return <div>Error: Context not available</div>;
//   }

//   if (error) return <div>{error}</div>;

//   return (
//     <>
//       {/* Hero Section */}
//       <div ref={heroRef}>
//         {!loadedSections.has('hero') && (
//           <div className="h-[400px] bg-gray-100 animate-pulse"></div>
//         )}
//         {loadingStates.hero && <HomeLoading />}
//         {!loadingStates.hero && homeSlidesData?.length > 0 && (
//           <>
//             <HomeSlider data={homeSlidesData} locale={locale} />
//             {context?.catData?.length > 0 && (
//               <HomeCatSlider data={context.catData} />
//             )}
//           </>
//         )}
//       </div>

//       {/* Popular Products Section */}
//       <section className="bg-white py-3 lg:py-8 " ref={popularRef}>
//         <div className="flex items-center justify-between flex-col lg:flex-row">
//           <div className="leftSec w-full lg:w-[40%]">
//             <h2 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[20px] font-[600]">
//               {t("home.popularProductsTitle")}
//             </h2>
//             <p className="text-[12px] lg:min-h-[57px] sm:text-[14px] md:text-[13px] lg:text-[14px] font-[400] mt-0 mb-0">
//               {locale === "ar"
//                 ? siteSettings?.popularProductHeadingAr
//                 : siteSettings?.popularProductHeadingEn}
//             </p>
//           </div>
//           <div className="rightSec w-full lg:w-[60%]">
//             <Tabs
//               value={value}
//               onChange={handleChange}
//               variant="scrollable"
//               scrollButtons="auto"
//               aria-label="scrollable auto tabs example"
//             >
//               {context?.catData?.map((cat, index) => (
//                 <Tab
//                   label={locale === "ar" ? cat?.arName : cat?.name}
//                   className="!font-[600]"
//                   key={index}
//                   onClick={() => filterByCatId(cat?._id)}
//                 />
//               ))}
//             </Tabs>
//           </div>
//         </div>
//         <div className="min-h-max lg:min-h-[60vh]">
//           {(loadingStates.popular || memoizedPopularProducts?.length === 0) && <ProductLoading />}
//           {memoizedPopularProducts?.length > 0 && (
//             <ProductsSlider items={6} data={memoizedPopularProducts} />
//           )}
//         </div>
//       </section>

//       {/* Home Banner Section */}
//       <section className="py-6 pt-0 bg-white" ref={bannerV1Ref}>
//         <div className="container flex flex-col lg:flex-row gap-5">
//           {!loadedSections.has('bannerV1') ? (
//             <div className="h-[300px] bg-gray-50 animate-pulse rounded"></div>
//           ) : (
//             <>
//               <div className="part1 w-full lg:w-[70%]">
//                 {memoizedProducts?.length > 0 && (
//                   <HomeBannerV2 data={memoizedProducts} />
//                 )}
//               </div>
//               <div className="part2 scrollableBox w-full lg:w-[30%] flex items-center gap-5 justify-between flex-row lg:flex-col">
//                 {loadingStates.bannerV1 && <BannerLoading />}
//                 {bannerV1Data?.length > 1 && (
//                   <>
//                     <BannerBoxV2
//                       info={bannerV1Data[bannerV1Data.length - 1]?.alignInfo}
//                       image={bannerV1Data[bannerV1Data.length - 1]?.images?.[0]}
//                       item={bannerV1Data[bannerV1Data.length - 1]}
//                     />
//                     <BannerBoxV2
//                       info={bannerV1Data[bannerV1Data.length - 2]?.alignInfo}
//                       image={bannerV1Data[bannerV1Data.length - 2]?.images?.[0]}
//                       item={bannerV1Data[bannerV1Data.length - 2]}
//                     />
//                   </>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       </section>

//       {/* Free Shipping Section */}
//       <section className="py-0 lg:py-4 pt-0 lg:pt-8 pb-0 bg-white" ref={shippingRef}>
//         <div className="container">
//           {!loadedSections.has('shipping') ? (
//             <div className="h-[150px] bg-gray-50 animate-pulse rounded mb-7"></div>
//           ) : (
//             <>
//               <div className="freeShipping w-full md:w-[80%] m-auto py-4 p-4 border-2 border-[#ff5252] flex items-center justify-center lg:justify-between flex-col lg:flex-row rounded-md mb-7">
//                 <div className="col1 flex items-center gap-4">
//                   <LiaShippingFastSolid className="text-[30px] lg:text-[50px]" />
//                   <span className="text-[16px] lg:text-[20px] font-[600] uppercase">
//                     {t("home.freeShipping")}
//                   </span>
//                 </div>
//                 <div className="col2">
//                   <p className="mb-0 mt-0 font-[500] text-center">
//                     {t("home.freeShippingDesc")} {getSymbol()}
//                     {convertPrice(freeDeliveryFee)}
//                   </p>
//                 </div>
//                 <p className="font-bold text-[20px] lg:text-[25px]">
//                   {t("home.onlyPrice")} {getSymbol()}
//                   {convertPrice(freeDeliveryFee)}
//                 </p>
//               </div>
//               {loadingStates.bannerV1 && <BannerLoading />}
//               {bannerV1Data?.length > 0 && (
//                 <AdsBannerSliderV2 items={4} data={bannerV1Data} />
//               )}
//             </>
//           )}
//         </div>
//       </section>

//       {/* Latest Products Section */}
//       <section className="py-3 lg:py-2 pt-0 bg-white" ref={latestRef}>
//         <div className="container">
//           {!loadedSections.has('latest') ? (
//             <div className="h-[300px] bg-gray-50 animate-pulse rounded"></div>
//           ) : (
//             <>
//               <h2 className="text-[20px] font-[600]">{t("home.latestProducts")}</h2>
//               {(loadingStates.latest || memoizedProducts?.length === 0) && <ProductLoading />}
//               {memoizedProducts?.length > 0 && (
//                 <ProductsSlider items={6} data={memoizedProducts} />
//               )}
//             </>
//           )}
//         </div>
//       </section>

//       {/* Featured Products Section */}
//       <section className="py-6 lg:py-8 bg-white" ref={featuredRef}>
//         <div className="container px-4 mx-auto">
//           {!loadedSections.has('featured') ? (
//             <></>
//           ) : (
//             <div className="featured-products-section">
//               <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-900 text-center lg:text-left">
//                 {t("home.featuredProducts")}
//               </h2>

//               <div className="content-wrapper">
//                 {(loadingStates.featured || memoizedFeaturedProducts?.length === 0) && (
//                   <div className="mt-2">
//                     <ProductLoading />
//                   </div>
//                 )}

//                 {memoizedFeaturedProducts?.length > 0 && (
//                   <div className="mt-1">
//                     <ProductsSlider items={6} data={memoizedFeaturedProducts} />
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Banner List 2 Section */}
//       <section className="py-2 pt-0 bg-white" ref={bannerList2Ref}>
//         <div className="container">
//           {!loadedSections.has('bannerList2') ? (
//             <div className="h-[200px] bg-gray-50 animate-pulse rounded"></div>
//           ) : (
//             <>
//               {loadingStates.bannerList2 && <BannerLoading />}
//               {bannerList2Data?.length > 0 && (
//                 <AdsBannerSlider items={4} data={bannerList2Data} />
//               )}
//             </>
//           )}
//         </div>
//       </section>

//       {/* Random Category Products */}
//       <div ref={randomCatRef}>
//         {!loadedSections.has('randomCat') ? (
//           <div className="h-[300px] bg-gray-50 animate-pulse rounded mx-4 my-8"></div>
//         ) : (
//           <>
//             {loadingStates.randomCat && <ProductLoading />}
//             {randomCatProducts?.length > 0 &&
//               randomCatProducts.map(
//                 (productRow, index) =>
//                   productRow?.catName &&
//                   productRow?.data?.length > 0 && (
//                     <section className="py-5 pt-0 bg-white" key={index}>
//                       <div className="container">
//                         <h2 className="text-[20px] font-[600]">
//                           {locale === "ar"
//                             ? productRow.catNameAr
//                             : productRow.catName}
//                         </h2>
//                         <ProductsSlider items={6} data={productRow.data} />
//                       </div>
//                     </section>
//                   )
//               )}
//           </>
//         )}
//       </div>

//       {/* Blog Section */}
//       <div ref={blogRef}>
//         {loadedSections.has('blog') && blogData?.length > 0 && (
//           <section className="py-5 pb-8 pt-0 bg-white blogSection">
//             <div className="container">
//               <h2 className="text-[20px] font-[600] mb-4">
//                 {t("home.fromTheBlog")}
//               </h2>
//               {loadingStates.blog && <div className="h-[200px] bg-gray-50 animate-pulse rounded"></div>}
//               {blogData?.length > 0 && (
//                 <Swiper
//                   slidesPerView={4}
//                   spaceBetween={30}
//                   navigation={context?.windowWidth < 992 ? false : true}
//                   modules={[Navigation, FreeMode]}
//                   freeMode={true}
//                   breakpoints={{
//                     250: { slidesPerView: 1, spaceBetween: 10 },
//                     330: { slidesPerView: 1, spaceBetween: 10 },
//                     500: { slidesPerView: 2, spaceBetween: 20 },
//                     700: { slidesPerView: 3, spaceBetween: 20 },
//                     1100: { slidesPerView: 4, spaceBetween: 30 },
//                   }}
//                   className="blogSlider"
//                 >
//                   {blogData
//                     .slice()
//                     .reverse()
//                     .map((item, index) => (
//                       <SwiperSlide key={index}>
//                         <BlogItem item={item} />
//                       </SwiperSlide>
//                     ))}
//                 </Swiper>
//               )}
//             </div>
//           </section>
//         )}
//       </div>
//     </>
//   );
// }

"use client";
import { useContext, useEffect, useState, useMemo, useRef, useCallback, lazy, Suspense } from "react";
import HomeCatSlider from "@/components/HomeCatSlider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { fetchDataFromApi, postData } from "@/utils/api";
import { MyContext } from "@/context/ThemeProvider";
import BannerLoading from "@/components/LoadingSkeleton/bannerLoading";
import ProductLoading from "@/components/ProductLoading";
import { LiaShippingFastSolid } from "react-icons/lia";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Navigation, FreeMode } from "swiper/modules";
import { useTranslation } from "@/utils/useTranslation";
import { useLanguage } from "@/context/LanguageContext";
import HomeLoading from "../LoadingSkeleton/homeLoading";
import Cookies from "js-cookie";
import { useCurrency } from "@/context/CurrencyContext";
import { CloudCog } from "lucide-react";

// Lazy load heavy components
const ProductsSlider = lazy(() => import("@/components/ProductsSlider"));
const AdsBannerSliderV2 = lazy(() => import("@/components/AdsBannerSliderV2"));
const AdsBannerSlider = lazy(() => import("@/components/AdsBannerSlider"));
const BannerBoxV2 = lazy(() => import("@/components/bannerBoxV2"));
const HomeBannerV2 = lazy(() => import("@/components/HomeSliderV2"));
const BlogItem = lazy(() => import("@/components/BlogItem"));
const HomeSlider = lazy(() => import("../HomeSlider"));

export default function Home() {
  const { convertPrice, getSymbol } = useCurrency();
  const [value, setValue] = useState(0);

  // All sections data
  const [homeSlidesData, setHomeSlidesData] = useState([]);
  const [popularProductsData, setPopularProductsData] = useState([]);
  const [productsData, setAllProductsData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bannerV1Data, setBannerV1Data] = useState([]);
  const [bannerList2Data, setBannerList2Data] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [randomCatProducts, setRandomCatProducts] = useState([]);
  const [freeDeliveryFee, setFreeDeliveryFee] = useState(0);
  const [siteSettings, setSiteSettings] = useState(null);

  // Loading states - only for currently loading sections
  const [loadingStates, setLoadingStates] = useState({});

  // Loaded flags - track what's been loaded
  const [loadedSections, setLoadedSections] = useState(new Set());

  const [error, setError] = useState(null);

  const context = useContext(MyContext);
  const { locale } = useLanguage();
  const { t } = useTranslation();

  // Refs for each section
  const heroRef = useRef(null);
  const popularRef = useRef(null);
  const latestRef = useRef(null);
  const featuredRef = useRef(null);
  const bannerV1Ref = useRef(null);
  const bannerList2Ref = useRef(null);
  const randomCatRef = useRef(null);
  const blogRef = useRef(null);
  const shippingRef = useRef(null);

  // Memoized data
  const memoizedPopularProducts = useMemo(() => popularProductsData, [popularProductsData]);
  const memoizedProducts = useMemo(() => productsData.slice(0, 12), [productsData]);
  const memoizedFeaturedProducts = useMemo(() => featuredProducts.slice(0, 12), [featuredProducts]);

  // Only scroll to top on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, []);

  // Helper function to set loading state
  const setLoadingState = useCallback((section, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [section]: isLoading
    }));
  }, []);

  // Helper function to mark section as loaded
  const markSectionLoaded = useCallback((section) => {
    setLoadedSections(prev => new Set([...prev, section]));
  }, []);

  // Async data loading functions
  const loadHeroData = useCallback(async () => {
    if (loadedSections.has('hero')) return;

    setLoadingState('hero', true);
    markSectionLoaded('hero');

    try {
      const homeSlides = await fetchDataFromApi("/api/homeSlides");
      setHomeSlidesData(homeSlides?.data || []);
    } catch (err) {
      console.error("Error loading hero data:", err);
    } finally {
      setLoadingState('hero', false);
    }
  }, [loadedSections, setLoadingState, markSectionLoaded]);

  const loadSiteSettings = useCallback(async () => {
    if (loadedSections.has('settings')) return;

    markSectionLoaded('settings');

    try {
      const cookieData = Cookies.get("siteSettings");
      if (cookieData) {
        setSiteSettings(JSON.parse(cookieData));
        return;
      }

      const res = await fetchDataFromApi("/api/site-settings");
      const settings = res?.data || {};
      Cookies.set("siteSettings", JSON.stringify(settings), { expires: 1 });
      setSiteSettings(settings);
    } catch (err) {
      console.error("Error fetching site settings:", err);
    }
  }, [loadedSections, markSectionLoaded]);

  const loadShippingData = useCallback(async () => {
    if (loadedSections.has('shipping')) return;

    markSectionLoaded('shipping');

    try {
      const cookieData = Cookies.get("shippingdt");
      if (cookieData) {
        const shippingdt = JSON.parse(cookieData);
        setFreeDeliveryFee(shippingdt.FreeDeliveryFee || 0);
        return;
      }

      const res = await fetchDataFromApi("/api/shipping-cost");
      const shippingdt = res?.data || {};
      Cookies.set("shippingdt", JSON.stringify(shippingdt), { expires: 1 });
      setFreeDeliveryFee(shippingdt.FreeDeliveryFee || 0);
    } catch (err) {
      console.error("Error fetching shipping settings:", err);
    }
  }, [loadedSections, markSectionLoaded]);

  // BULK LOAD PRODUCTS FOR HOMEPAGE (POPULAR, FEATURED, RANDOM, LATEST)
  const loadBulkHomeProducts = useCallback(async () => {
    if (loadedSections.has('bulkHomeProducts') || !context?.catData?.length) return;

    setLoadingState('popular', true);
    setLoadingState('featured', true);
    setLoadingState('randomCat', true);
    setLoadingState('latest', true);
    markSectionLoaded('bulkHomeProducts');

    try {
      // Popular: first category
      const popularCatId = context.catData[0]?._id;

      // Random categories (excluding the first one used for popular)
      const maxCategories = Math.min(context.catData.length - 1, 8);
      const numbers = new Set();
      while (numbers.size < maxCategories && context.catData.length > 1) {
        const number = Math.floor(1 + Math.random() * (context.catData.length - 1));
        numbers.add(number);
      }
      const catIndexes = Array.from(numbers);
      const randomCatIds = catIndexes.map(idx => context.catData[idx]?._id);

      // Call bulk endpoint (POST)
      const res = await postData("/api/product/getBulkProductsHome", {
  popularCatId,
  randomCatIds,
  featured: true,
  latest: true,
});

      // Popular
      setPopularProductsData(res.popular || []);
      // Featured
      setFeaturedProducts(res.featured || []);
      // Latest
      setAllProductsData(res.latest || []);
      // Random by category
      setRandomCatProducts(
        catIndexes.map((index, i) => ({
          catName: context.catData[index]?.name,
          catNameAr: context.catData[index]?.arName,
          data: (res.randomByCategory || {})[randomCatIds[i]] || [],
        }))
      );
    } catch (err) {
      setError("Failed to load homepage products.");
    } finally {
      setLoadingState('popular', false);
      setLoadingState('featured', false);
      setLoadingState('randomCat', false);
      setLoadingState('latest', false);
    }
  }, [loadedSections, context?.catData, setLoadingState, markSectionLoaded]);

  const loadBannerV1Data = useCallback(async () => {
    if (loadedSections.has('bannerV1')) return;
    setLoadingState('bannerV1', true);
    markSectionLoaded('bannerV1');

    try {
      const res = await fetchDataFromApi("/api/bannerV1");
      setBannerV1Data(res?.data || []);
    } catch (err) {
      console.error("Error loading banners:", err);
    } finally {
      setLoadingState('bannerV1', false);
    }
  }, [loadedSections, setLoadingState, markSectionLoaded]);

  const loadBannerList2Data = useCallback(async () => {
    if (loadedSections.has('bannerList2')) return;
    setLoadingState('bannerList2', true);
    markSectionLoaded('bannerList2');

    try {
      const res = await fetchDataFromApi("/api/bannerList2");
      setBannerList2Data(res?.data || []);
    } catch (err) {
      console.error("Error loading banner list:", err);
    } finally {
      setLoadingState('bannerList2', false);
    }
  }, [loadedSections, setLoadingState, markSectionLoaded]);

  const loadBlogData = useCallback(async () => {
    if (loadedSections.has('blog')) return;
    setLoadingState('blog', true);
    markSectionLoaded('blog');

    try {
      const res = await fetchDataFromApi("/api/blog");
      setBlogData(res?.blogs || []);
    } catch (err) {
      console.error("Error loading blogs:", err);
    } finally {
      setLoadingState('blog', false);
    }
  }, [loadedSections, setLoadingState, markSectionLoaded]);

  // Set up intersection observers ONLY when component mounts - no immediate loading
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    };

    const observers = [];

    const sectionsConfig = [
      { ref: heroRef, callback: loadHeroData },
      { ref: popularRef, callback: () => { loadSiteSettings(); loadBulkHomeProducts(); } },
      { ref: latestRef, callback: () => {} }, // No explicit call, handled in bulk load
      { ref: featuredRef, callback: () => {} }, // No explicit call, handled in bulk load
      { ref: bannerV1Ref, callback: loadBannerV1Data },
      { ref: bannerList2Ref, callback: loadBannerList2Data },
      { ref: randomCatRef, callback: () => {} }, // No explicit call, handled in bulk load
      { ref: blogRef, callback: loadBlogData },
      { ref: shippingRef, callback: loadShippingData },
    ];

    sectionsConfig.forEach(({ ref, callback }) => {
      if (ref.current) {
        const observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(callback, 0);
            observer.unobserve(entry.target);
          }
        }, observerOptions);

        observer.observe(ref.current);
        observers.push(observer);
      }
    });

    // Cleanup
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, [loadHeroData, loadSiteSettings, loadBulkHomeProducts, loadBannerV1Data, loadBannerList2Data, loadBlogData, loadShippingData]);

  // Re-fetch home slides when locale changes (only if already loaded)
  useEffect(() => {
    if (locale && loadedSections.has('hero')) {
      const fetchHomeSlides = async () => {
        try {
          const homeSlides = await fetchDataFromApi("/api/homeSlides");
          setHomeSlidesData(homeSlides?.data || []);
        } catch (err) {
          console.error("Failed to load home slides:", err);
        }
      };
      setTimeout(fetchHomeSlides, 0);
    }
  }, [locale, loadedSections]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // On tab click, switch products to the selected category from context
    if (context?.catData?.[newValue]?._id) {
      setPopularProductsData([]);
      setLoadingState('popular', true);
      setTimeout(async () => {
        try {
          const res = await fetchDataFromApi(`/api/product/getAllProductsByCatId/${context.catData[newValue]._id}`);
          if (res?.error === false) {
            setPopularProductsData(res?.products || []);
          }
        } catch (err) {
          console.error("Error filtering by category:", err);
        } finally {
          setLoadingState('popular', false);
        }
      }, 0);
    }
  };

  if (!context) {
    return <div>Error: Context not available</div>;
  }

  if (error) return <div>{error}</div>;

  return (
    <>
      {/* Hero Section */}
      <div ref={heroRef}>
        {!loadedSections.has('hero') && (
          <div className="h-[400px] bg-gray-100 animate-pulse"></div>
        )}
        {loadingStates.hero && <HomeLoading />}
        {!loadingStates.hero && homeSlidesData?.length > 0 && (
          <>
            <HomeSlider data={homeSlidesData} locale={locale} />
            {context?.catData?.length > 0 && (
              <HomeCatSlider data={context.catData} />
            )}
          </>
        )}
      </div>

      {/* Popular Products Section */}
      <section className="bg-white py-3 lg:py-8 " ref={popularRef}>
        <div className="flex items-center justify-between flex-col lg:flex-row">
          <div className="leftSec w-full lg:w-[40%]">
            <h2 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[20px] font-[600]">
              {t("home.popularProductsTitle")}
            </h2>
            <p className="text-[12px] lg:min-h-[57px] sm:text-[14px] md:text-[13px] lg:text-[14px] font-[400] mt-0 mb-0">
              {locale === "ar"
                ? siteSettings?.popularProductHeadingAr
                : siteSettings?.popularProductHeadingEn}
            </p>
          </div>
          <div className="rightSec w-full lg:w-[60%]">
            <Tabs
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {context?.catData?.map((cat, index) => (
                <Tab
                  label={locale === "ar" ? cat?.arName : cat?.name}
                  className="!font-[600]"
                  key={index}
                />
              ))}
            </Tabs>
          </div>
        </div>
        <div className="min-h-max lg:min-h-[60vh]">
          {(loadingStates.popular || memoizedPopularProducts?.length === 0) && <ProductLoading />}
          {memoizedPopularProducts?.length > 0 && (
            <ProductsSlider items={6} data={memoizedPopularProducts} />
          )}
        </div>
      </section>

      {/* Home Banner Section */}
      <section className="py-6 pt-0 bg-white" ref={bannerV1Ref}>
        <div className="container flex flex-col lg:flex-row gap-5">
          {!loadedSections.has('bannerV1') ? (
            <div className="h-[300px] bg-gray-50 animate-pulse rounded"></div>
          ) : (
            <>
              <div className="part1 w-full lg:w-[70%]">
                {memoizedProducts?.length > 0 && (
                  <HomeBannerV2 data={memoizedProducts} />
                )}
              </div>
              <div className="part2 scrollableBox w-full lg:w-[30%] flex items-center gap-5 justify-between flex-row lg:flex-col">
                {loadingStates.bannerV1 && <BannerLoading />}
                {bannerV1Data?.length > 1 && (
                  <>
                    <BannerBoxV2
                      info={bannerV1Data[bannerV1Data.length - 1]?.alignInfo}
                      image={bannerV1Data[bannerV1Data.length - 1]?.images?.[0]}
                      item={bannerV1Data[bannerV1Data.length - 1]}
                    />
                    <BannerBoxV2
                      info={bannerV1Data[bannerV1Data.length - 2]?.alignInfo}
                      image={bannerV1Data[bannerV1Data.length - 2]?.images?.[0]}
                      item={bannerV1Data[bannerV1Data.length - 2]}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Free Shipping Section */}
      <section className="py-0 lg:py-4 pt-0 lg:pt-8 pb-0 bg-white" ref={shippingRef}>
        <div className="container">
          {!loadedSections.has('shipping') ? (
            <div className="h-[150px] bg-gray-50 animate-pulse rounded mb-7"></div>
          ) : (
            <>
              <div className="freeShipping w-full md:w-[80%] m-auto py-4 p-4 border-2 border-[#ff5252] flex items-center justify-center lg:justify-between flex-col lg:flex-row rounded-md mb-7">
                <div className="col1 flex items-center gap-4">
                  <LiaShippingFastSolid className="text-[30px] lg:text-[50px]" />
                  <span className="text-[16px] lg:text-[20px] font-[600] uppercase">
                    {t("home.freeShipping")}
                  </span>
                </div>
                <div className="col2">
                  <p className="mb-0 mt-0 font-[500] text-center">
                    {t("home.freeShippingDesc")} {getSymbol()}
                    {convertPrice(freeDeliveryFee)}
                  </p>
                </div>
                <p className="font-bold text-[20px] lg:text-[25px]">
                  {t("home.onlyPrice")} {getSymbol()}
                  {convertPrice(freeDeliveryFee)}
                </p>
              </div>
              {loadingStates.bannerV1 && <BannerLoading />}
              {bannerV1Data?.length > 0 && (
                <AdsBannerSliderV2 items={4} data={bannerV1Data} />
              )}
            </>
          )}
        </div>
      </section>

      {/* Latest Products Section */}
      <section className="py-3 lg:py-2 pt-0 bg-white" ref={latestRef}>
        <div className="container">
          {!loadedSections.has('bulkHomeProducts') ? (
            <div className="h-[300px] bg-gray-50 animate-pulse rounded"></div>
          ) : (
            <>
              <h2 className="text-[20px] font-[600]">{t("home.latestProducts")}</h2>
              {(loadingStates.latest || memoizedProducts?.length === 0) && <ProductLoading />}
              {memoizedProducts?.length > 0 && (
                <ProductsSlider items={6} data={memoizedProducts} />
              )}
            </>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-6 lg:py-8 bg-white" ref={featuredRef}>
        <div className="container px-4 mx-auto">
          {!loadedSections.has('bulkHomeProducts') ? (
            <></>
          ) : (
            <div className="featured-products-section">
              <h2 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-900 text-center lg:text-left">
                {t("home.featuredProducts")}
              </h2>

              <div className="content-wrapper">
                {(loadingStates.featured || memoizedFeaturedProducts?.length === 0) && (
                  <div className="mt-2">
                    <ProductLoading />
                  </div>
                )}

                {memoizedFeaturedProducts?.length > 0 && (
                  <div className="mt-1">
                    <ProductsSlider items={6} data={memoizedFeaturedProducts} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Banner List 2 Section */}
      <section className="py-2 pt-0 bg-white" ref={bannerList2Ref}>
        <div className="container">
          {!loadedSections.has('bannerList2') ? (
            <div className="h-[200px] bg-gray-50 animate-pulse rounded"></div>
          ) : (
            <>
              {loadingStates.bannerList2 && <BannerLoading />}
              {bannerList2Data?.length > 0 && (
                <AdsBannerSlider items={4} data={bannerList2Data} />
              )}
            </>
          )}
        </div>
      </section>

      {/* Random Category Products */}
      <div ref={randomCatRef}>
        {!loadedSections.has('bulkHomeProducts') ? (
          <div className="h-[300px] bg-gray-50 animate-pulse rounded mx-4 my-8"></div>
        ) : (
          <>
            {loadingStates.randomCat && <ProductLoading />}
            {randomCatProducts?.length > 0 &&
              randomCatProducts.map(
                (productRow, index) =>
                  productRow?.catName &&
                  productRow?.data?.length > 0 && (
                    <section className="py-5 pt-0 bg-white" key={index}>
                      <div className="container">
                        <h2 className="text-[20px] font-[600]">
                          {locale === "ar"
                            ? productRow.catNameAr
                            : productRow.catName}
                        </h2>
                        <ProductsSlider items={6} data={productRow.data} />
                      </div>
                    </section>
                  )
              )}
          </>
        )}
      </div>

      {/* Blog Section */}
      <div ref={blogRef}>
        {loadedSections.has('blog') && blogData?.length > 0 && (
          <section className="py-5 pb-8 pt-0 bg-white blogSection">
            <div className="container">
              <h2 className="text-[20px] font-[600] mb-4">
                {t("home.fromTheBlog")}
              </h2>
              {loadingStates.blog && <div className="h-[200px] bg-gray-50 animate-pulse rounded"></div>}
              {blogData?.length > 0 && (
                <Swiper
                  slidesPerView={4}
                  spaceBetween={30}
                  navigation={context?.windowWidth < 992 ? false : true}
                  modules={[Navigation, FreeMode]}
                  freeMode={true}
                  breakpoints={{
                    250: { slidesPerView: 1, spaceBetween: 10 },
                    330: { slidesPerView: 1, spaceBetween: 10 },
                    500: { slidesPerView: 2, spaceBetween: 20 },
                    700: { slidesPerView: 3, spaceBetween: 20 },
                    1100: { slidesPerView: 4, spaceBetween: 30 },
                  }}
                  className="blogSlider"
                >
                  {blogData
                    .slice()
                    .reverse()
                    .map((item, index) => (
                      <SwiperSlide key={index}>
                        <BlogItem item={item} />
                      </SwiperSlide>
                    ))}
                </Swiper>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
}