"use client";
import { useContext, useEffect, useState, useMemo } from "react";
import HomeCatSlider from "@/components/HomeCatSlider";
import HomeSlider from "@/components/HomeSlider";
import ProductsSlider from "@/components/ProductsSlider";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AdsBannerSliderV2 from "@/components/AdsBannerSliderV2";
import AdsBannerSlider from "@/components/AdsBannerSlider";
import { fetchDataFromApi } from "@/utils/api";
import { MyContext } from "@/context/ThemeProvider";
import BannerLoading from "@/components/LoadingSkeleton/bannerLoading";
import ProductLoading from "@/components/ProductLoading";
import BannerBoxV2 from "@/components/bannerBoxV2";
import { LiaShippingFastSolid } from "react-icons/lia";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import { Navigation, FreeMode } from "swiper/modules";
import BlogItem from "@/components/BlogItem";
import HomeBannerV2 from "@/components/HomeSliderV2";
import { useTranslation } from "@/utils/useTranslation";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const [value, setValue] = useState(0);
  const [homeSlidesData, setHomeSlidesData] = useState([]);
  const [popularProductsData, setPopularProductsData] = useState([]);
  const [productsData, setAllProductsData] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bannerV1Data, setBannerV1Data] = useState([]);
  const [bannerList2Data, setBannerList2Data] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [randomCatProducts, setRandomCatProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRandomLoading, setIsRandomLoading] = useState(false);
  const [error, setError] = useState(null);

  const context = useContext(MyContext);
  const { locale } = useLanguage();
  const { t } = useTranslation();

  // Move useMemo calls before any early returns
  const memoizedPopularProducts = useMemo(
    () => popularProductsData,
    [popularProductsData]
  );
  const memoizedProducts = useMemo(
    () => productsData.slice(0, 12),
    [productsData]
  );
  const memoizedFeaturedProducts = useMemo(
    () => featuredProducts.slice(0, 12),
    [featuredProducts]
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }

    const fetchData = async () => {
      try {
        const [homeSlides, products, featured, banners, banners2, blogs] =
          await Promise.all([
            fetchDataFromApi("/api/homeSlides"),
            fetchDataFromApi("/api/product/getAllProducts"),
            fetchDataFromApi("/api/product/getAllFeaturedProducts"),
            fetchDataFromApi("/api/bannerV1"),
            fetchDataFromApi("/api/bannerList2"),
            // fetchDataFromApi("/api/blog"),
          ]);
        setHomeSlidesData(homeSlides?.data || []);
        setAllProductsData(products?.products || []);
        setFeaturedProducts(featured?.products || []);
        setBannerV1Data(banners?.data || []);
        setBannerList2Data(banners2?.data || []);
        setBlogData(blogs?.blogs || []);
      } catch (err) {
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (context?.catData?.length > 0) {
      setIsRandomLoading(true);
      fetchDataFromApi(
        `/api/product/getAllProductsByCatId/${context.catData[0]._id}`
      ).then((res) => {
        if (res?.error === false) {
          setPopularProductsData(res?.products || []);
        }
      });

      const maxCategories = Math.min(context.catData.length - 1, 8);
      const numbers = new Set();
      while (numbers.size < maxCategories && context.catData.length > 1) {
        const number = Math.floor(
          1 + Math.random() * (context.catData.length - 1)
        );
        numbers.add(number);
      }
      getRendomProducts(Array.from(numbers), context.catData).finally(() =>
        setIsRandomLoading(false)
      );
    }
  }, [context?.catData]);

  if (!context) {
    return <div>Error: Context not available</div>;
  }

  const getRendomProducts = async (arr, catArr) => {
    try {
      const filterData = await Promise.all(
        arr.map(async (index) => {
          const catId = catArr[index]?._id;
          const res = await fetchDataFromApi(
            `/api/product/getAllProductsByCatId/${catId}`
          );
          return { catName: catArr[index]?.name, data: res?.products || [] };
        })
      );
      setRandomCatProducts(filterData);
    } catch (err) {
      console.error("Error fetching random products:", err);
    }
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const filterByCatId = (id) => {
    setPopularProductsData([]);
    fetchDataFromApi(`/api/product/getAllProductsByCatId/${id}`).then((res) => {
      if (res?.error === false) {
        setPopularProductsData(res?.products || []);
      }
    });
  };

  if (error) return <div>{error}</div>;
  if (isLoading) return <BannerLoading />;

  return (
    <>
      {homeSlidesData?.length === 0 && <BannerLoading />}
      {homeSlidesData?.length > 0 && <HomeSlider data={homeSlidesData} />}

      {context?.catData?.length > 0 && <HomeCatSlider data={context.catData} />}

      <section className="bg-white py-3 lg:py-8">
        <div className="container">
          <div className="flex items-center justify-between flex-col lg:flex-row">
            <div className="leftSec w-full lg:w-[40%]">
              <h2 className="text-[14px] sm:text-[14px] md:text-[16px] lg:text-[20px] font-[600]">
                {t("home.popularProductsTitle")}
              </h2>
              <p className="text-[12px] sm:text-[14px] md:text-[13px] lg:text-[14px] font-[400] mt-0 mb-0">
                {t("home.popularProductsDesc")}
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
                    onClick={() => filterByCatId(cat?._id)}
                  />
                ))}
              </Tabs>
            </div>
          </div>
          <div className="min-h-max lg:min-h-[60vh]">
            {memoizedPopularProducts?.length === 0 && <ProductLoading />}
            {memoizedPopularProducts?.length > 0 && (
              <ProductsSlider items={6} data={memoizedPopularProducts} />
            )}
          </div>
        </div>
      </section>

      <section className="py-6 pt-0 bg-white">
        <div className="container flex flex-col lg:flex-row gap-5">
          <div className="part1 w-full lg:w-[70%]">
            {memoizedProducts?.length > 0 && (
              <HomeBannerV2 data={memoizedProducts} />
            )}
          </div>
          <div className="part2 scrollableBox w-full lg:w-[30%] flex items-center gap-5 justify-between flex-row lg:flex-col">
            {bannerV1Data?.length > 0 && (
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
        </div>
      </section>

      <section className="py-0 lg:py-4 pt-0 lg:pt-8 pb-0 bg-white">
        <div className="container">
          <div className="freeShipping w-full md:w-[80%] m-auto py-4 p-4 border-2 border-[#ff5252] flex items-center justify-center lg:justify-between flex-col lg:flex-row rounded-md mb-7">
            <div className="col1 flex items-center gap-4">
              <LiaShippingFastSolid className="text-[30px] lg:text-[50px]" />
              <span className="text-[16px] lg:text-[20px] font-[600] uppercase">
                {t("home.freeShipping")}
              </span>
            </div>
            <div className="col2">
              <p className="mb-0 mt-0 font-[500] text-center">
                {t("home.freeShippingDesc")}
              </p>
            </div>
            <p className="font-bold text-[20px] lg:text-[25px]">
              {t("home.onlyPrice")}
            </p>
          </div>
          {bannerV1Data?.length === 0 && <BannerLoading />}
          {bannerV1Data?.length > 0 && (
            <AdsBannerSliderV2 items={4} data={bannerV1Data} />
          )}
        </div>
      </section>

      <section className="py-3 lg:py-2 pt-0 bg-white">
        <div className="container">
          <h2 className="text-[20px] font-[600]">{t("home.latestProducts")}</h2>
          {memoizedProducts?.length === 0 && <ProductLoading />}
          {memoizedProducts?.length > 0 && (
            <ProductsSlider items={6} data={memoizedProducts} />
          )}
        </div>
      </section>

      <section className="py-2 lg:py-0 pt-0 bg-white">
        <div className="container">
          <h2 className="text-[20px] font-[600]">
            {t("home.featuredProducts")}
          </h2>
          {memoizedFeaturedProducts?.length === 0 && <ProductLoading />}
          {memoizedFeaturedProducts?.length > 0 && (
            <ProductsSlider items={6} data={memoizedFeaturedProducts} />
          )}
          {bannerList2Data?.length === 0 && <BannerLoading />}
          {bannerList2Data?.length > 0 && (
            <AdsBannerSlider items={4} data={bannerList2Data} />
          )}
        </div>
      </section>

      {isRandomLoading && <ProductLoading />}
      {randomCatProducts?.length > 0 &&
        randomCatProducts.map(
          (productRow, index) =>
            productRow?.catName &&
            productRow?.data?.length > 0 && (
              <section className="py-5 pt-0 bg-white" key={index}>
                <div className="container">
                  <h2 className="text-[20px] font-[600]">
                    {productRow.catName}
                  </h2>
                  {productRow.data?.length === 0 && <ProductLoading />}
                  {productRow.data?.length > 0 && (
                    <ProductsSlider items={6} data={productRow.data} />
                  )}
                </div>
              </section>
            )
        )}

      {blogData?.length > 0 && (
        <section className="py-5 pb-8 pt-0 bg-white blogSection">
          <div className="container">
            <h2 className="text-[20px] font-[600] mb-4">
              {t("home.fromTheBlog")}
            </h2>
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
          </div>
        </section>
      )}
    </>
  );
}
