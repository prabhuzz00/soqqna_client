// import Home from "@/components/Home";
// import { fetchDataFromApi } from "@/utils/api";

// export default async function Page() {
//   "use server";
//   const [homeSlides, products, featured, banners, banners2, blogs] =
//     await Promise.all([
//       fetchDataFromApi("/api/homeSlides"),
//       fetchDataFromApi("/api/product/getAllProducts"),
//       fetchDataFromApi("/api/product/getAllFeaturedProducts"),
//       fetchDataFromApi("/api/bannerV1"),
//       fetchDataFromApi("/api/bannerList2"),
//       fetchDataFromApi("/api/blog"),
//     ]);

//   return (
//     <Home
//       homeSlidesData={homeSlides?.data || []}
//       productsData={products?.products || []}
//       featuredProducts={featured?.products || []}
//       bannerV1Data={banners?.data || []}
//       bannerList2Data={banners2?.data || []}
//       blogData={blogs?.blogs || []}
//     />
//   );
// }

import Home from "@/components/Home";
import { fetchDataFromApi } from "@/utils/api";

export default async function Page() {
  "use server";

  return <Home />;
}
