// // "use client";
// import { fetchDataFromApi } from "@/utils/api";
// import ProductOverview from "@/components/ProductDetail";
// import { cache } from "react";

// const ProductPage = async ({ params }) => {
//   const id = params.productId;

//   // Server Action
//   async function getReviews() {
//     "use server";
//     const res = await fetchDataFromApi(`/api/user/getReviews?productId=${id}`);
//     if (res?.error === false) {
//       return res.reviews.length;
//     }
//     return 0;
//   }

//   const getProductDetail = cache(async function getProductDetail() {
//     "use server";
//     const res = await fetchDataFromApi(`/api/product/${id}`);
//     if (res?.error === true) {
//       return null;
//     }
//     const subCategory = await fetchDataFromApi(
//       `/api/product/getAllProductsBySubCatId/${res?.product?.subCatId}`
//     );
//     if (subCategory?.error === true) {
//       return null;
//     }
//     const filteredData = res?.products?.filter((item) => item._id !== id);
//     return {
//       product: res?.product,
//       relatedProducts: filteredData ? filteredData : [],
//     };
//   });

//   const reviewsCount = await getReviews();

//   const productDetail = await getProductDetail();

//   return (
//     <ProductOverview
//       product={productDetail.product}
//       relatedProducts={productDetail.relatedProducts}
//       reviewsCount={reviewsCount}
//     />
//   );
// };

// export default ProductPage;

import { fetchDataFromApi } from "@/utils/api";
import ProductOverview from "@/components/ProductDetail";
import { cache } from "react";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { CircularProgress } from "@mui/material";

async function getReviews(productId) {
  console.time("fetchReviews");
  const res = await fetchDataFromApi(
    `/api/user/getReviews?productId=${productId}`,
    {
      next: { revalidate: 3600 },
    }
  );
  console.timeEnd("fetchReviews");
  return res?.error === false ? res.reviews.length : 0;
}

const getProductDetail = cache(async (productId) => {
  try {
    console.time("fetchProduct");
    const productRes = await fetchDataFromApi(`/api/product/${productId}`, {
      next: { revalidate: 3600 },
    });
    console.timeEnd("fetchProduct");

    if (productRes?.error || !productRes?.product) {
      return { product: null, relatedProducts: [] };
    }

    console.time("fetchRelatedProducts");
    const subCategoryRes = await fetchDataFromApi(
      `/api/product/getAllProductsBySubCatId/${productRes?.product?.subCatId}?limit=6&exclude=${productId}`,
      { next: { revalidate: 3600 } }
    );
    console.timeEnd("fetchRelatedProducts");

    return {
      product: productRes?.product,
      relatedProducts: subCategoryRes?.products || [],
    };
  } catch (error) {
    console.error("Error fetching product details:", error);
    return { product: null, relatedProducts: [] };
  }
});

export default async function ProductPage({ params }) {
  const id = params.productId;
  const [reviewsCount, productDetail] = await Promise.all([
    getReviews(id),
    getProductDetail(id),
  ]);

  if (!productDetail.product) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <CircularProgress />
        </div>
      }
    >
      <ProductOverview
        product={productDetail.product}
        relatedProducts={productDetail.relatedProducts}
        reviewsCountProp={reviewsCount}
      />
    </Suspense>
  );
}
